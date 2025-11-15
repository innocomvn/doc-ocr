# Docker Deployment Guide

This guide explains how to run the Vietnamese OCR API using Docker.

## Quick Start

### Option 1: Production (Recommended)

```bash
# 1. Create .env file
cp .env.example .env

# 2. Build and run
docker-compose up -d

# 3. Check logs
docker-compose logs -f

# 4. Access API
# http://localhost:3000
```

### Option 2: Development

```bash
# Run development container with hot reload
docker-compose --profile development up ocr-api-dev
```

## Docker Commands

### Build Image

```bash
# Build production image
docker build -t vietnamese-ocr-api .

# Build specific stage
docker build --target development -t vietnamese-ocr-api:dev .
docker build --target production -t vietnamese-ocr-api:prod .
```

### Run Container

```bash
# Run production container
docker run -d \
  --name ocr-api \
  -p 3000:3000 \
  -v $(pwd)/uploads:/app/uploads \
  -v $(pwd)/results:/app/results \
  -e USE_ONNX=false \
  vietnamese-ocr-api

# Run with GPU support (NVIDIA)
docker run -d \
  --name ocr-api \
  --gpus all \
  -p 3000:3000 \
  -v $(pwd)/uploads:/app/uploads \
  vietnamese-ocr-api
```

### Docker Compose

```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f ocr-api

# Stop services
docker-compose down

# Rebuild and restart
docker-compose up -d --build

# Remove volumes
docker-compose down -v
```

## Configuration

### Environment Variables

Create `.env` file:

```env
# Server
PORT=3000

# OCR Mode
USE_ONNX=false

# ONNX Models (if USE_ONNX=true)
DETECTION_MODEL_PATH=./models/detection.onnx
RECOGNITION_MODEL_PATH=./models/recognition.onnx
```

### Volume Mounts

The docker-compose.yml mounts these directories:

- `./uploads` - Uploaded images
- `./results` - Processing results
- `./models` - ONNX models (if using ONNX mode)

### Ports

Default port mapping: `3000:3000`

Change in docker-compose.yml or use PORT environment variable.

## Multi-Stage Build

The Dockerfile uses multi-stage builds:

1. **base** - System dependencies and Python/Node.js
2. **development** - Development dependencies
3. **build** - TypeScript compilation
4. **production** - Optimized production image

## Health Check

The container includes a health check:

```bash
# Check container health
docker inspect --format='{{.State.Health.Status}}' vietnamese-ocr-api

# View health check logs
docker inspect vietnamese-ocr-api | jq '.[0].State.Health'
```

## ONNX Mode with Docker

To use ONNX Runtime mode:

### 1. Export Models

```bash
# On host machine (not in container)
./scripts/export_detection_to_onnx.sh
python scripts/export_recognition_to_onnx.py
```

### 2. Configure Environment

Edit `.env`:

```env
USE_ONNX=true
DETECTION_MODEL_PATH=./models/detection.onnx
RECOGNITION_MODEL_PATH=./models/recognition.onnx
```

### 3. Start Container

```bash
docker-compose up -d
```

The models directory is mounted as a volume.

## GPU Support

### NVIDIA GPU (CUDA)

Requires nvidia-docker:

```bash
# Install nvidia-docker
# https://github.com/NVIDIA/nvidia-docker

# Run with GPU
docker run --gpus all \
  -p 3000:3000 \
  vietnamese-ocr-api
```

Update docker-compose.yml:

```yaml
services:
  ocr-api:
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: 1
              capabilities: [gpu]
```

## Troubleshooting

### Container Won't Start

```bash
# Check logs
docker-compose logs ocr-api

# Check if port is in use
lsof -i :3000

# Remove old containers
docker-compose down
docker-compose up -d
```

### Python Dependencies Issues

```bash
# Rebuild image
docker-compose build --no-cache ocr-api
docker-compose up -d
```

### Out of Memory

Increase Docker memory limit in Docker Desktop settings or:

```bash
# Limit container memory
docker run -m 4g -p 3000:3000 vietnamese-ocr-api
```

In docker-compose.yml:

```yaml
services:
  ocr-api:
    deploy:
      resources:
        limits:
          memory: 4G
```

### Models Not Loading

```bash
# Verify models exist
ls -la models/

# Check volume mount
docker exec vietnamese-ocr-api ls -la /app/models/

# Verify permissions
chmod -R 755 models/
```

## Production Deployment

### Best Practices

1. **Use specific image tags**

```yaml
services:
  ocr-api:
    image: vietnamese-ocr-api:1.0.0
```

2. **Set resource limits**

```yaml
deploy:
  resources:
    limits:
      cpus: '2'
      memory: 4G
```

3. **Use secrets for sensitive data**

```yaml
secrets:
  env_file:
    file: .env
```

4. **Enable logging**

```yaml
logging:
  driver: "json-file"
  options:
    max-size: "10m"
    max-file: "3"
```

### Scaling

```bash
# Run multiple instances
docker-compose up -d --scale ocr-api=3
```

Add load balancer (nginx):

```yaml
services:
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
    depends_on:
      - ocr-api
```

## Example nginx.conf

```nginx
upstream ocr-api {
    server ocr-api:3000;
}

server {
    listen 80;

    location / {
        proxy_pass http://ocr-api;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Testing

```bash
# Health check
curl http://localhost:3000/api/health

# OCR processing
curl -X POST http://localhost:3000/api/ocr \
  -F "image=@samples/doanvan1.png" \
  -F "device=cpu"
```

## Cleanup

```bash
# Stop and remove containers
docker-compose down

# Remove images
docker rmi vietnamese-ocr-api

# Remove volumes
docker-compose down -v

# Remove all unused images
docker image prune -a
```

## References

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [nvidia-docker](https://github.com/NVIDIA/nvidia-docker)
