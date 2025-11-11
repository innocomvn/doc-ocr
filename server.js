const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Create necessary directories
const UPLOAD_DIR = path.join(__dirname, 'uploads');
const RESULTS_DIR = path.join(__dirname, 'results');

[UPLOAD_DIR, RESULTS_DIR].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, UPLOAD_DIR);
    },
    filename: function (req, file, cb) {
        const uniqueId = uuidv4();
        const ext = path.extname(file.originalname);
        cb(null, `${uniqueId}${ext}`);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: function (req, file, cb) {
        const allowedTypes = /jpeg|jpg|png|gif|bmp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'));
        }
    }
});

// Helper function to run OCR
function runOCR(imagePath, device = 'cpu') {
    return new Promise((resolve, reject) => {
        const pythonScript = path.join(__dirname, 'ocr_api.py');

        const pythonProcess = spawn('python3', [
            pythonScript,
            '--img', imagePath,
            '--device', device,
            '--padding', '4'
        ]);

        let stdout = '';
        let stderr = '';

        pythonProcess.stdout.on('data', (data) => {
            stdout += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
            stderr += data.toString();
        });

        pythonProcess.on('close', (code) => {
            if (code !== 0) {
                reject(new Error(`OCR process failed: ${stderr}`));
            } else {
                try {
                    const result = JSON.parse(stdout);
                    resolve(result);
                } catch (e) {
                    reject(new Error(`Failed to parse OCR result: ${e.message}`));
                }
            }
        });

        pythonProcess.on('error', (error) => {
            reject(new Error(`Failed to start OCR process: ${error.message}`));
        });
    });
}

// Routes

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'OCR API is running' });
});

// Upload and process image
app.post('/api/ocr', upload.single('image'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No image file provided' });
    }

    const imagePath = req.file.path;
    const device = req.body.device || 'cpu';

    try {
        console.log(`Processing image: ${req.file.filename}`);
        console.log(`Device: ${device}`);

        const result = await runOCR(imagePath, device);

        // Add file information to result
        result.filename = req.file.filename;
        result.originalname = req.file.originalname;
        result.uploadPath = `/uploads/${req.file.filename}`;

        res.json(result);

    } catch (error) {
        console.error('OCR Error:', error);
        res.status(500).json({
            error: 'OCR processing failed',
            message: error.message
        });
    }
});

// Serve uploaded images
app.use('/uploads', express.static(UPLOAD_DIR));

// Get list of processed images
app.get('/api/images', (req, res) => {
    fs.readdir(UPLOAD_DIR, (err, files) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to read uploads directory' });
        }

        const images = files.filter(file => {
            return /\.(jpg|jpeg|png|gif|bmp)$/i.test(file);
        }).map(file => ({
            filename: file,
            path: `/uploads/${file}`,
            uploadedAt: fs.statSync(path.join(UPLOAD_DIR, file)).mtime
        }));

        res.json({ images });
    });
});

// Delete uploaded image
app.delete('/api/images/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(UPLOAD_DIR, filename);

    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'File not found' });
    }

    fs.unlink(filePath, (err) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to delete file' });
        }
        res.json({ message: 'File deleted successfully' });
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        error: 'Internal server error',
        message: err.message
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║          🚀 OCR API Server is running!                    ║
║                                                            ║
║          Port: ${PORT}                                         ║
║          URL:  http://localhost:${PORT}                        ║
║                                                            ║
║          API Endpoints:                                    ║
║          • POST /api/ocr          - Process image          ║
║          • GET  /api/health       - Health check           ║
║          • GET  /api/images       - List images            ║
║          • DELETE /api/images/:id - Delete image           ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
    `);
});
