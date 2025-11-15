# Multi-stage Dockerfile for Vietnamese OCR API
# Supports both Python wrapper mode and ONNX Runtime mode

FROM node:18-slim AS base

# Install system dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-dev \
    build-essential \
    libgomp1 \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    libgl1-mesa-glx \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install Node.js dependencies
RUN npm ci --only=production

# Copy Python requirements
COPY requirement.txt ./

# Install Python dependencies
RUN pip3 install --no-cache-dir -r requirement.txt

# Development stage
FROM base AS development

# Install dev dependencies
RUN npm install

# Copy source code
COPY . .

# Expose port
EXPOSE 3000

# Start development server
CMD ["npm", "run", "dev"]

# Build stage
FROM base AS build

# Install all dependencies (including dev)
RUN npm install

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Production stage
FROM base AS production

# Copy only production files
COPY --from=build /app/dist ./dist
COPY --from=build /app/public ./public
COPY --from=build /app/PaddleOCR ./PaddleOCR
COPY --from=build /app/vietocr ./vietocr
COPY --from=build /app/ocr_api.py ./ocr_api.py
COPY --from=build /app/samples ./samples
COPY --from=build /app/.env.example ./.env.example

# Create directories for uploads and results
RUN mkdir -p uploads results models

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start production server
CMD ["npm", "start"]
