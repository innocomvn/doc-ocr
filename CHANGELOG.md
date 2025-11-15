# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2024-11-15

### Added - TypeScript & Production Features

#### Core Implementation
- Full TypeScript implementation with ONNX Runtime support
- Type-safe API with complete type definitions
- Abstract OCRService base class for polymorphic implementations
- PythonOCRService: Wrapper for existing Python OCR scripts
- ONNXOCRService: Pure Node.js implementation using ONNX Runtime
- Image preprocessing utilities using Sharp library
- Automatic failover between Python and ONNX services

#### Production Features
- Docker support with multi-stage builds
- docker-compose.yml for easy orchestration
- Health check endpoints
- Graceful shutdown handling
- Environment-based configuration
- Volume persistence for uploads and models

#### Documentation
- README_TYPESCRIPT.md - Complete TypeScript guide
- QUICKSTART.md - Getting started guide
- docs/DOCKER.md - Docker deployment guide
- docs/ONNX_MODELS.md - ONNX model setup guide
- PROJECT_SUMMARY.md - Project overview
- MIT License added

#### Development Tools
- Export scripts for ONNX models
  - scripts/export_detection_to_onnx.sh
  - scripts/export_recognition_to_onnx.py
- API testing examples
  - examples/api-examples.sh (Bash/curl)
  - examples/api-examples.py (Python)

#### Configuration
- .env.example for environment configuration
- tsconfig.json for TypeScript compilation
- .dockerignore for optimized builds
- Updated .gitignore for TypeScript/Docker

### Changed
- Updated package.json with TypeScript dependencies
- Enhanced README.md with Docker and TypeScript sections
- Improved error handling and logging
- Better separation of concerns with service architecture

### Technical Details
- TypeScript 5.3.2
- Node.js 18+
- ONNX Runtime 1.16.3
- Sharp 0.33.0 for image processing
- Express.js with type safety

## [1.0.0] - 2024-11-14

### Added - Initial Release

#### Web Interface
- Modern, responsive web interface
- Drag & drop file upload
- Real-time image preview
- Bounding box visualization
- Device selection (CPU/CUDA/MPS)
- Copy text and download JSON results

#### API Service
- RESTful API with Express.js
- POST /api/ocr - OCR processing
- GET /api/health - Health check
- GET /api/images - List uploaded images
- DELETE /api/images/:filename - Delete images
- CORS enabled for cross-origin requests

#### OCR Processing
- PaddleOCR for text detection (DB algorithm)
- VietOCR for Vietnamese text recognition
- Transformer-based architecture
- Support for CPU, CUDA GPU, and Apple Silicon (MPS)
- Configurable padding for better accuracy

#### Backend
- Python wrapper for OCR processing
- JavaScript/Node.js API server
- File upload with multer (10MB limit)
- Support for JPG, PNG, GIF, BMP formats

#### Documentation
- Comprehensive README.md
- API reference and examples
- Installation instructions
- Troubleshooting guide

---

## Migration Guide

### From 1.0.0 to 2.0.0

#### Breaking Changes
None - Fully backwards compatible. All existing JavaScript code continues to work.

#### New Features Available
1. **TypeScript Support**: Use `npm run dev` instead of `npm run dev:js`
2. **Docker Deployment**: Run `docker-compose up -d` for instant deployment
3. **ONNX Mode**: Optional pure Node.js mode (requires model conversion)

#### Upgrade Steps

**Option 1: Continue with JavaScript**
```bash
# No changes needed - keep using
npm run dev:js
```

**Option 2: Migrate to TypeScript**
```bash
# Install new dependencies
npm install

# Use TypeScript server
npm run dev
```

**Option 3: Use Docker**
```bash
# Create environment config
cp .env.example .env

# Run with Docker
docker-compose up -d
```

---

## Roadmap

### Potential Future Features
- [ ] Unit and integration tests
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Kubernetes deployment configurations
- [ ] Rate limiting middleware
- [ ] Authentication/Authorization
- [ ] Batch processing API
- [ ] S3/Cloud storage integration
- [ ] WebSocket for real-time updates
- [ ] Model caching for performance
- [ ] Prometheus metrics
- [ ] Admin dashboard

### Performance Improvements
- [ ] Model quantization for faster inference
- [ ] Request queuing and batching
- [ ] Redis caching layer
- [ ] CDN for static assets

### Additional OCR Features
- [ ] Multiple language support
- [ ] Table detection and extraction
- [ ] Document layout analysis
- [ ] PDF support
- [ ] Handwriting recognition

---

## Notes

### Version 2.0.0
This major version represents a complete rewrite in TypeScript while maintaining full backwards compatibility. The project is now production-ready with Docker support, comprehensive documentation, and flexible deployment options.

### Version 1.0.0
Initial release with core OCR functionality for Vietnamese documents, combining PaddleOCR for detection and VietOCR for recognition.

---

[2.0.0]: https://github.com/your-repo/doc-ocr/compare/v1.0.0...v2.0.0
[1.0.0]: https://github.com/your-repo/doc-ocr/releases/tag/v1.0.0
