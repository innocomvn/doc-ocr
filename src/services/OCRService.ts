/**
 * Abstract OCR Service Interface
 */

import { OCRResult, ProcessingOptions } from '../types/ocr.types';

export abstract class OCRService {
  /**
   * Process an image and return OCR results
   */
  abstract processImage(
    imagePath: string,
    options?: ProcessingOptions
  ): Promise<OCRResult>;

  /**
   * Initialize the OCR service (load models, etc.)
   */
  abstract initialize(): Promise<void>;

  /**
   * Clean up resources
   */
  abstract cleanup(): Promise<void>;

  /**
   * Check if service is ready
   */
  abstract isReady(): boolean;
}
