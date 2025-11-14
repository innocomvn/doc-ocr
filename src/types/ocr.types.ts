/**
 * OCR Types and Interfaces
 */

export interface BoundingBox {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface OCRResult {
  success: boolean;
  boxes: [number, number][][];
  texts: string[];
  count: number;
  error?: string;
  filename?: string;
  originalname?: string;
  uploadPath?: string;
  processingTime?: number;
}

export interface ImageMetadata {
  width: number;
  height: number;
  channels: number;
  format?: string;
}

export interface DetectionResult {
  boxes: BoundingBox[];
  confidence?: number[];
}

export interface RecognitionResult {
  text: string;
  confidence?: number;
}

export interface OCRConfig {
  detectionModelPath: string;
  recognitionModelPath: string;
  device?: 'cpu' | 'cuda' | 'wasm';
  maxImageSize?: number;
  paddingSize?: number;
}

export type DeviceType = 'cpu' | 'cuda' | 'mps';

export interface ProcessingOptions {
  device?: DeviceType;
  padding?: number;
  enhanceImage?: boolean;
}
