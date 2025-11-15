# Quick Start Guide

## Mode 1: Python Wrapper (Recommended for Beginners)

### 1. Install Dependencies

```bash
# Node.js dependencies
npm install

# Python dependencies
pip install -r requirement.txt
```

### 2. Start Server

```bash
# Copy environment config
cp .env.example .env

# Run development server
npm run dev
```

### 3. Open Browser

```
http://localhost:3000
```

**Done!** Upload an image and see OCR results.

---

## Mode 2: TypeScript with ONNX (Advanced)

### Prerequisites

```bash
pip install paddle2onnx onnx onnxruntime torch
```

### 1. Export Models to ONNX

#### Option A: Auto Export (Recommended)

```bash
# Make scripts executable
chmod +x scripts/*.sh scripts/*.py

# Export detection model
./scripts/export_detection_to_onnx.sh

# Export recognition model
python scripts/export_recognition_to_onnx.py
```

#### Option B: Manual Export

See [docs/ONNX_MODELS.md](docs/ONNX_MODELS.md) for detailed instructions.

### 2. Configure Environment

Edit `.env`:

```env
USE_ONNX=true
DETECTION_MODEL_PATH=./models/detection.onnx
RECOGNITION_MODEL_PATH=./models/recognition.onnx
```

### 3. Run Server

```bash
npm run dev
```

---

## Troubleshooting

### "Module not found" errors

```bash
rm -rf node_modules package-lock.json
npm install
```

### Python dependencies issues

```bash
pip install --upgrade pip
pip install -r requirement.txt
```

### Port already in use

```bash
# Change port in .env
echo "PORT=3001" >> .env
```

### ONNX models not loading

1. Verify models exist: `ls -la models/`
2. Check file permissions
3. Try Python wrapper mode: `USE_ONNX=false`

---

## What's Next?

- Read [README_TYPESCRIPT.md](README_TYPESCRIPT.md) for TypeScript details
- Read [docs/ONNX_MODELS.md](docs/ONNX_MODELS.md) for ONNX setup
- Read [README.md](README.md) for full API documentation

---

## Common Commands

```bash
# Development
npm run dev              # TypeScript server with hot reload
npm run dev:js           # JavaScript server

# Production
npm run build            # Compile TypeScript
npm start                # Run compiled server

# Utilities
npm run watch            # Watch TypeScript compilation
npm run clean            # Remove compiled files
```

---

## Testing API

### Health Check

```bash
curl http://localhost:3000/api/health
```

### OCR Processing

```bash
curl -X POST http://localhost:3000/api/ocr \
  -F "image=@samples/doanvan1.png" \
  -F "device=cpu"
```

### Using Python

```python
import requests

response = requests.post(
    'http://localhost:3000/api/ocr',
    files={'image': open('samples/doanvan1.png', 'rb')},
    data={'device': 'cpu'}
)

print(response.json())
```

---

## Need Help?

- Check [README.md](README.md) for full documentation
- Check [README_TYPESCRIPT.md](README_TYPESCRIPT.md) for TypeScript guide
- Check [docs/ONNX_MODELS.md](docs/ONNX_MODELS.md) for ONNX setup
- Open an issue on GitHub
