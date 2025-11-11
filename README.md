# Vietnamese OCR - API Service & Web Interface

This project provides a complete OCR solution for Vietnamese documents with:
- **Node.js API Service** - RESTful API for OCR processing
- **Web Interface** - Modern, responsive frontend for document upload and OCR
- **PaddleOCR** - Text detection using DB algorithm
- **VietOCR** - Vietnamese text recognition using Transformer architecture

## Features

✨ **Easy-to-use Web Interface**
- Drag & drop or click to upload images
- Real-time preview with bounding boxes
- Support for CPU, CUDA GPU, and Apple Silicon (MPS)
- Copy text results or download as JSON

🚀 **RESTful API**
- File upload endpoint
- OCR processing with device selection
- JSON response format
- CORS enabled for cross-origin requests

🎯 **High Accuracy**
- PaddleOCR for robust text detection
- VietOCR Transformer for Vietnamese recognition
- Configurable padding for better accuracy

# Outline

1. Text Detection (PaddleOCR DB Algorithm)
2. Text Recognition (VietOCR Transformer)
3. API Service (Node.js + Express)
4. Web Interface (HTML/CSS/JavaScript)

# Text Dectection
Text detection is the process of locating text in an image or video and recognizing the presence of characters. The [DB algorithm](https://github.com/PaddlePaddle/PaddleOCR/blob/release/2.6/doc/doc_en/algorithm_det_db_en.md) is a popular algorithm used in the [PaddleOCR](https://github.com/PaddlePaddle/PaddleOCR) framework to localize text in the input image. It works by detecting the text regions in the image and then grouping them into text lines. This algorithm is known for its high accuracy and speed.

To enhance the accuracy of Text Recognition, images cropped by the DB algorithm were padded. This is because the padding helps to ensure that the text is not cut off during the recognition process.

# Text Recognition

Text Recognition is the process of recognizing the text in an image or video. For Text Recognition part, you used [VietOCR](https://github.com/pbcquoc/vietocr), which is a popular framework for Vietnamese OCR task. It is based on Transformer OCR architecture. The Transformer OCR architecture is a combination of the CNN and Transformer models. The CNN model is used to extract features from the input image, while the Transformer model is used to recognize the text in the image. This architecture is known for its high accuracy and speed.

# Installation & Setup

## Prerequisites

- Python 3.7+ with pip
- Node.js 14+ with npm
- (Optional) CUDA for GPU acceleration
- (Optional) Apple Silicon for MPS acceleration

## Step 1: Clone Repository

```bash
git clone https://github.com/your-repo/doc-ocr.git
cd doc-ocr
```

## Step 2: Install Python Dependencies

```bash
pip install -r requirement.txt
```

## Step 3: Install Node.js Dependencies

```bash
npm install
```

# Usage

## Option 1: Web Interface (Recommended)

### Start the API Server

```bash
npm start
```

Or for development with auto-reload:

```bash
npm run dev
```

### Access the Web Interface

Open your browser and navigate to:
```
http://localhost:3000
```

### Using the Web Interface

1. **Upload Image**: Drag & drop or click to select an image file (JPG, PNG, GIF, BMP)
2. **Select Device**: Choose CPU, CUDA (GPU), or MPS (Apple Silicon)
3. **Process**: Click "Xử lý OCR" button to start OCR processing
4. **View Results**: See detected text with bounding boxes
5. **Copy/Download**: Copy text to clipboard or download as JSON

## Option 2: API Endpoints

### Health Check
```bash
curl http://localhost:3000/api/health
```

### OCR Processing
```bash
curl -X POST http://localhost:3000/api/ocr \
  -F "image=@path/to/your/image.jpg" \
  -F "device=cpu"
```

**Response Format:**
```json
{
  "success": true,
  "boxes": [
    [[x1, y1], [x2, y2]],
    ...
  ],
  "texts": [
    "Recognized text line 1",
    "Recognized text line 2",
    ...
  ],
  "count": 10,
  "filename": "uuid.jpg",
  "originalname": "document.jpg"
}
```

### List Uploaded Images
```bash
curl http://localhost:3000/api/images
```

### Delete Image
```bash
curl -X DELETE http://localhost:3000/api/images/{filename}
```

## Option 3: Python Command Line (Original)

For direct Python usage:

```bash
python ocr_api.py --img path/to/image.jpg --device cpu --output result.json
```

**Parameters:**
- `--img`: Path to input image (required)
- `--device`: Device to use - cpu, cuda, or mps (default: cpu)
- `--padding`: Padding around detected boxes (default: 4)
- `--output`: Path to save JSON output (optional)

## Option 4: Jupyter Notebook

Explore and experiment with the code at [predict.ipynb](./predict.ipynb).

# Project Structure

```
doc-ocr/
├── server.js                 # Express.js API server
├── ocr_api.py               # Python OCR wrapper script
├── package.json             # Node.js dependencies
├── requirement.txt          # Python dependencies
├── public/                  # Frontend files
│   ├── index.html          # Web interface
│   ├── style.css           # Styling
│   └── app.js              # Frontend logic
├── uploads/                 # Uploaded images (auto-created)
├── PaddleOCR/              # PaddleOCR framework
├── vietocr/                # VietOCR framework
└── samples/                # Sample images for testing
```

# API Reference

## POST /api/ocr

Upload and process an image for OCR.

**Request:**
- Content-Type: `multipart/form-data`
- Body:
  - `image` (file): Image file to process
  - `device` (string): Device to use (cpu, cuda, mps)

**Response:**
```json
{
  "success": true,
  "boxes": [[x1, y1], [x2, y2], ...],
  "texts": ["text1", "text2", ...],
  "count": 10,
  "filename": "uuid.jpg",
  "originalname": "original.jpg",
  "uploadPath": "/uploads/uuid.jpg"
}
```

## GET /api/health

Check API server status.

**Response:**
```json
{
  "status": "OK",
  "message": "OCR API is running"
}
```

## GET /api/images

List all uploaded images.

**Response:**
```json
{
  "images": [
    {
      "filename": "uuid.jpg",
      "path": "/uploads/uuid.jpg",
      "uploadedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

## DELETE /api/images/:filename

Delete an uploaded image.

**Response:**
```json
{
  "message": "File deleted successfully"
}
```

# Configuration

## Environment Variables

Create a `.env` file in the root directory (optional):

```env
PORT=3000                    # API server port
UPLOAD_MAX_SIZE=10485760    # Max upload size in bytes (10MB)
```

## Device Selection

- **CPU**: Works on all systems, slower processing
- **CUDA (GPU)**: Requires NVIDIA GPU with CUDA support, fastest
- **MPS (Apple Silicon)**: For M1/M2/M3 Macs, fast on compatible hardware

# Troubleshooting

## Common Issues

### 1. "Module not found" error

**Solution:** Install dependencies
```bash
pip install -r requirement.txt
npm install
```

### 2. "Port already in use"

**Solution:** Change port in server.js or kill the process using port 3000
```bash
# Linux/Mac
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### 3. "OCR processing failed"

**Solution:**
- Check if Python dependencies are installed correctly
- Verify image format is supported (JPG, PNG, GIF, BMP)
- Try using CPU device instead of GPU/MPS

### 4. "CUDA out of memory"

**Solution:** Use CPU device or process smaller images

### 5. Slow processing on CPU

**Solution:**
- Use GPU (CUDA) if available
- Process smaller images
- Reduce image resolution before upload

# Performance Tips

1. **Use GPU acceleration** when available (CUDA or MPS)
2. **Optimize image size** - resize large images to ~1500px width
3. **Use appropriate padding** - default is 4px, adjust based on text density
4. **Batch processing** - process multiple images sequentially through API

# Development

## Running in Development Mode

```bash
npm run dev
```

This uses nodemon to auto-reload the server on code changes.

## Testing API with curl

```bash
# Test OCR with a sample image
curl -X POST http://localhost:3000/api/ocr \
  -F "image=@samples/doanvan1.png" \
  -F "device=cpu" \
  | jq '.'
```

## Testing API with Python

```python
import requests

url = "http://localhost:3000/api/ocr"
files = {"image": open("samples/doanvan1.png", "rb")}
data = {"device": "cpu"}

response = requests.post(url, files=files, data=data)
print(response.json())
```

# Screenshots

## Web Interface
- Upload screen with drag & drop
- Image preview with device selection
- OCR results with bounding boxes
- Text extraction display

# License

MIT License

# Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

# Acknowledgments

This project combines multiple OCR frameworks:
- [PaddleOCR](https://github.com/PaddlePaddle/PaddleOCR) - Text detection
- [VietOCR](https://github.com/pbcquoc/vietocr) - Vietnamese text recognition

# References

- [PaddleOCR](https://github.com/PaddlePaddle/PaddleOCR)
- [VietOCR](https://github.com/pbcquoc/vietocr)
- [DB Text Detection Algorithm](https://github.com/PaddlePaddle/PaddleOCR/blob/release/2.6/doc/doc_en/algorithm_det_db_en.md)
- [Transformer OCR Architecture](https://arxiv.org/abs/1910.04396)
