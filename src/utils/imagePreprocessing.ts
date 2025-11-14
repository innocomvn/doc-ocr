/**
 * Image Preprocessing Utilities
 * Using Sharp for image manipulation
 */

import sharp from 'sharp';
import { ImageMetadata } from '../types/ocr.types';

export class ImagePreprocessor {
  /**
   * Load and get image metadata
   */
  static async getMetadata(imagePath: string): Promise<ImageMetadata> {
    const metadata = await sharp(imagePath).metadata();

    return {
      width: metadata.width || 0,
      height: metadata.height || 0,
      channels: metadata.channels || 3,
      format: metadata.format,
    };
  }

  /**
   * Resize image to fit within max dimensions while maintaining aspect ratio
   */
  static async resizeImage(
    imagePath: string,
    maxWidth: number = 1500,
    maxHeight: number = 1500
  ): Promise<Buffer> {
    return sharp(imagePath)
      .resize(maxWidth, maxHeight, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .toBuffer();
  }

  /**
   * Convert image to RGB format
   */
  static async toRGB(imagePath: string): Promise<Buffer> {
    return sharp(imagePath)
      .ensureAlpha()
      .flatten({ background: { r: 255, g: 255, b: 255 } })
      .toBuffer();
  }

  /**
   * Normalize image for model input
   * Returns normalized pixel values (0-1 range)
   */
  static async normalizeImage(
    imagePath: string,
    targetWidth?: number,
    targetHeight?: number
  ): Promise<{
    data: Float32Array;
    width: number;
    height: number;
  }> {
    let pipeline = sharp(imagePath).ensureAlpha().flatten({ background: { r: 255, g: 255, b: 255 } });

    if (targetWidth && targetHeight) {
      pipeline = pipeline.resize(targetWidth, targetHeight, { fit: 'fill' });
    }

    const { data, info } = await pipeline
      .raw()
      .toBuffer({ resolveWithObject: true });

    // Convert to Float32Array and normalize to [0, 1]
    const normalized = new Float32Array(data.length);
    for (let i = 0; i < data.length; i++) {
      normalized[i] = data[i] / 255.0;
    }

    return {
      data: normalized,
      width: info.width,
      height: info.height,
    };
  }

  /**
   * Crop image region
   */
  static async cropRegion(
    imagePath: string,
    x: number,
    y: number,
    width: number,
    height: number,
    padding: number = 0
  ): Promise<Buffer> {
    const metadata = await sharp(imagePath).metadata();
    const imgWidth = metadata.width || 0;
    const imgHeight = metadata.height || 0;

    // Apply padding and ensure within bounds
    const left = Math.max(0, x - padding);
    const top = Math.max(0, y - padding);
    const right = Math.min(imgWidth, x + width + padding);
    const bottom = Math.min(imgHeight, y + height + padding);

    return sharp(imagePath)
      .extract({
        left,
        top,
        width: right - left,
        height: bottom - top,
      })
      .toBuffer();
  }

  /**
   * Enhance image quality for better OCR
   */
  static async enhanceForOCR(imagePath: string): Promise<Buffer> {
    return sharp(imagePath)
      .grayscale()
      .normalize()
      .sharpen()
      .toBuffer();
  }

  /**
   * Prepare image tensor for ONNX model (NCHW format)
   * Returns Float32Array in [batch, channels, height, width] format
   */
  static async prepareImageTensor(
    imagePath: string,
    targetHeight: number,
    targetWidth: number
  ): Promise<{
    tensor: Float32Array;
    originalWidth: number;
    originalHeight: number;
  }> {
    const { data, info } = await sharp(imagePath)
      .resize(targetWidth, targetHeight, { fit: 'fill' })
      .raw()
      .toBuffer({ resolveWithObject: true });

    const channels = info.channels;
    const size = targetHeight * targetWidth;

    // Convert HWC to CHW format and normalize
    const tensor = new Float32Array(channels * size);

    for (let c = 0; c < channels; c++) {
      for (let i = 0; i < size; i++) {
        tensor[c * size + i] = data[i * channels + c] / 255.0;
      }
    }

    return {
      tensor,
      originalWidth: info.width,
      originalHeight: info.height,
    };
  }
}
