/**
 * TypeScript OCR API Server
 */

import express, { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import cors from 'cors';
import path from 'path';
import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';

import { OCRService } from './services/OCRService';
import { PythonOCRService } from './services/PythonOCRService';
import { ONNXOCRService } from './services/ONNXOCRService';
import { ProcessingOptions } from './types/ocr.types';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Directories
const UPLOAD_DIR = path.join(process.cwd(), 'uploads');
const RESULTS_DIR = path.join(process.cwd(), 'results');

// Initialize OCR Service
let ocrService: OCRService;

// Determine which OCR service to use
const USE_ONNX = process.env.USE_ONNX === 'true';

async function initializeOCRService() {
  try {
    if (USE_ONNX) {
      console.log('Initializing ONNX OCR Service...');
      ocrService = new ONNXOCRService();
    } else {
      console.log('Initializing Python OCR Service...');
      ocrService = new PythonOCRService();
    }

    await ocrService.initialize();
    console.log('OCR Service initialized successfully');
  } catch (error) {
    console.error('Failed to initialize OCR Service:', error);
    console.log('Falling back to Python OCR Service...');

    // Fallback to Python service
    ocrService = new PythonOCRService();
    await ocrService.initialize();
  }
}

// Create directories
async function createDirectories() {
  for (const dir of [UPLOAD_DIR, RESULTS_DIR]) {
    try {
      await fs.access(dir);
    } catch {
      await fs.mkdir(dir, { recursive: true });
    }
  }
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use('/uploads', express.static(UPLOAD_DIR));

// Configure multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueId = uuidv4();
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueId}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|bmp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  },
});

// Routes

/**
 * Health check
 */
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'OK',
    message: 'OCR API is running',
    ocrService: USE_ONNX ? 'ONNX' : 'Python',
    ready: ocrService.isReady(),
  });
});

/**
 * Upload and process image
 */
app.post(
  '/api/ocr',
  upload.single('image'),
  async (req: Request, res: Response) => {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const imagePath = req.file.path;
    const device = (req.body.device as string) || 'cpu';

    try {
      console.log(`Processing image: ${req.file.filename}`);
      console.log(`Device: ${device}`);

      const options: ProcessingOptions = {
        device: device as 'cpu' | 'cuda' | 'mps',
        padding: 4,
      };

      const result = await ocrService.processImage(imagePath, options);

      // Add file information
      result.filename = req.file.filename;
      result.originalname = req.file.originalname;
      result.uploadPath = `/uploads/${req.file.filename}`;

      res.json(result);
    } catch (error) {
      console.error('OCR Error:', error);
      res.status(500).json({
        error: 'OCR processing failed',
        message: (error as Error).message,
      });
    }
  }
);

/**
 * Get list of uploaded images
 */
app.get('/api/images', async (req: Request, res: Response) => {
  try {
    const files = await fs.readdir(UPLOAD_DIR);

    const images = await Promise.all(
      files
        .filter((file) => /\.(jpg|jpeg|png|gif|bmp)$/i.test(file))
        .map(async (file) => {
          const filePath = path.join(UPLOAD_DIR, file);
          const stats = await fs.stat(filePath);

          return {
            filename: file,
            path: `/uploads/${file}`,
            uploadedAt: stats.mtime,
          };
        })
    );

    res.json({ images });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to read uploads directory',
      message: (error as Error).message,
    });
  }
});

/**
 * Delete uploaded image
 */
app.delete('/api/images/:filename', async (req: Request, res: Response) => {
  const filename = req.params.filename;
  const filePath = path.join(UPLOAD_DIR, filename);

  try {
    await fs.access(filePath);
    await fs.unlink(filePath);
    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    res.status(404).json({ error: 'File not found' });
  }
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message,
  });
});

// Cleanup on shutdown
process.on('SIGINT', async () => {
  console.log('\nShutting down gracefully...');
  await ocrService.cleanup();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\nShutting down gracefully...');
  await ocrService.cleanup();
  process.exit(0);
});

// Start server
async function start() {
  try {
    await createDirectories();
    await initializeOCRService();

    app.listen(PORT, () => {
      console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║          🚀 OCR API Server (TypeScript) is running!       ║
║                                                            ║
║          Port:        ${PORT}                                     ║
║          URL:         http://localhost:${PORT}                    ║
║          OCR Service: ${USE_ONNX ? 'ONNX Runtime' : 'Python Wrapper'}                  ║
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
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

start();
