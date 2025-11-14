/**
 * ONNX OCR Service
 * Pure TypeScript/Node.js implementation using ONNX Runtime
 *
 * NOTE: This requires ONNX models to be available.
 * See docs/ONNX_MODELS.md for instructions on converting PyTorch models to ONNX.
 */

import * as ort from 'onnxruntime-node';
import path from 'path';
import { OCRService } from './OCRService';
import { OCRResult, ProcessingOptions, BoundingBox } from '../types/ocr.types';
import { ImagePreprocessor } from '../utils/imagePreprocessing';

export class ONNXOCRService extends OCRService {
  private detectionSession: ort.InferenceSession | null = null;
  private recognitionSession: ort.InferenceSession | null = null;
  private ready: boolean = false;

  private detectionModelPath: string;
  private recognitionModelPath: string;

  constructor(
    detectionModelPath?: string,
    recognitionModelPath?: string
  ) {
    super();
    this.detectionModelPath = detectionModelPath || path.join(process.cwd(), 'models', 'detection.onnx');
    this.recognitionModelPath = recognitionModelPath || path.join(process.cwd(), 'models', 'recognition.onnx');
  }

  async initialize(): Promise<void> {
    try {
      console.log('Loading ONNX models...');

      // Load detection model
      this.detectionSession = await ort.InferenceSession.create(
        this.detectionModelPath,
        {
          executionProviders: ['cpu'], // Can be changed to 'cuda' if available
          graphOptimizationLevel: 'all',
        }
      );

      console.log('Detection model loaded');

      // Load recognition model
      this.recognitionSession = await ort.InferenceSession.create(
        this.recognitionModelPath,
        {
          executionProviders: ['cpu'],
          graphOptimizationLevel: 'all',
        }
      );

      console.log('Recognition model loaded');

      this.ready = true;
    } catch (error) {
      throw new Error(
        `Failed to load ONNX models: ${(error as Error).message}\n` +
        `Make sure models exist at:\n` +
        `- ${this.detectionModelPath}\n` +
        `- ${this.recognitionModelPath}\n` +
        `See docs/ONNX_MODELS.md for setup instructions.`
      );
    }
  }

  async cleanup(): Promise<void> {
    if (this.detectionSession) {
      await this.detectionSession.release();
      this.detectionSession = null;
    }
    if (this.recognitionSession) {
      await this.recognitionSession.release();
      this.recognitionSession = null;
    }
    this.ready = false;
  }

  isReady(): boolean {
    return this.ready;
  }

  async processImage(
    imagePath: string,
    options?: ProcessingOptions
  ): Promise<OCRResult> {
    if (!this.ready || !this.detectionSession || !this.recognitionSession) {
      throw new Error('OCR Service not initialized');
    }

    const startTime = Date.now();

    try {
      // Step 1: Text Detection
      const boxes = await this.detectText(imagePath, options?.padding || 4);

      // Step 2: Text Recognition for each detected region
      const texts: string[] = [];

      for (const box of boxes) {
        const text = await this.recognizeText(imagePath, box, options?.padding || 4);
        texts.push(text);
      }

      const processingTime = Date.now() - startTime;

      return {
        success: true,
        boxes: boxes.map(b => [[b.x1, b.y1], [b.x2, b.y2]]),
        texts,
        count: texts.length,
        processingTime,
      };
    } catch (error) {
      return {
        success: false,
        boxes: [],
        texts: [],
        count: 0,
        error: (error as Error).message,
      };
    }
  }

  /**
   * Detect text regions in the image
   */
  private async detectText(
    imagePath: string,
    padding: number
  ): Promise<BoundingBox[]> {
    if (!this.detectionSession) {
      throw new Error('Detection model not loaded');
    }

    // Prepare image for detection model
    // Most detection models expect input size of 640x640 or 960x960
    const { tensor, originalWidth, originalHeight } =
      await ImagePreprocessor.prepareImageTensor(imagePath, 640, 640);

    // Create ONNX tensor
    const imageTensor = new ort.Tensor('float32', tensor, [1, 3, 640, 640]);

    // Run inference
    const feeds = { [this.detectionSession.inputNames[0]]: imageTensor };
    const results = await this.detectionSession.run(feeds);

    // Post-process detection results
    // This depends on the specific model output format
    // Here's a generic implementation - you'll need to adjust based on your model
    const boxes = this.postprocessDetection(
      results,
      originalWidth,
      originalHeight,
      640,
      640
    );

    return boxes;
  }

  /**
   * Recognize text in a specific region
   */
  private async recognizeText(
    imagePath: string,
    box: BoundingBox,
    padding: number
  ): Promise<string> {
    if (!this.recognitionSession) {
      throw new Error('Recognition model not loaded');
    }

    // Crop image region
    const width = box.x2 - box.x1;
    const height = box.y2 - box.y1;

    const croppedImage = await ImagePreprocessor.cropRegion(
      imagePath,
      box.x1,
      box.y1,
      width,
      height,
      padding
    );

    // Save cropped image temporarily and prepare tensor
    // Recognition models typically expect height=32, variable width
    const tempPath = `/tmp/cropped_${Date.now()}.jpg`;
    await require('fs').promises.writeFile(tempPath, croppedImage);

    const { tensor } = await ImagePreprocessor.prepareImageTensor(
      tempPath,
      32,
      256
    );

    // Clean up temp file
    await require('fs').promises.unlink(tempPath);

    // Create ONNX tensor
    const imageTensor = new ort.Tensor('float32', tensor, [1, 3, 32, 256]);

    // Run inference
    const feeds = { [this.recognitionSession.inputNames[0]]: imageTensor };
    const results = await this.recognitionSession.run(feeds);

    // Post-process recognition results
    const text = this.postprocessRecognition(results);

    return text;
  }

  /**
   * Post-process detection model output
   * TODO: Implement based on your specific model's output format
   */
  private postprocessDetection(
    results: ort.InferenceSession.OnnxValueMapType,
    originalWidth: number,
    originalHeight: number,
    modelWidth: number,
    modelHeight: number
  ): BoundingBox[] {
    // This is a placeholder implementation
    // You need to implement this based on your detection model's output format

    // Example for models that output [batch, num_boxes, 5] where 5 = [x1, y1, x2, y2, confidence]
    const outputName = Object.keys(results)[0];
    const output = results[outputName];

    if (!output || !(output instanceof ort.Tensor)) {
      return [];
    }

    const boxes: BoundingBox[] = [];
    const data = output.data as Float32Array;

    // Scale factors
    const scaleX = originalWidth / modelWidth;
    const scaleY = originalHeight / modelHeight;

    // Parse boxes (this is model-specific)
    // This is just an example - adjust based on your model
    const numBoxes = output.dims[1] || 0;
    for (let i = 0; i < numBoxes; i++) {
      const offset = i * 5;
      const confidence = data[offset + 4];

      // Filter by confidence threshold
      if (confidence > 0.5) {
        boxes.push({
          x1: Math.round(data[offset] * scaleX),
          y1: Math.round(data[offset + 1] * scaleY),
          x2: Math.round(data[offset + 2] * scaleX),
          y2: Math.round(data[offset + 3] * scaleY),
        });
      }
    }

    return boxes;
  }

  /**
   * Post-process recognition model output
   * TODO: Implement based on your specific model's output format
   */
  private postprocessRecognition(
    results: ort.InferenceSession.OnnxValueMapType
  ): string {
    // This is a placeholder implementation
    // You need to implement this based on your recognition model's output format

    const outputName = Object.keys(results)[0];
    const output = results[outputName];

    if (!output || !(output instanceof ort.Tensor)) {
      return '';
    }

    // Example for CTC-based models that output character probabilities
    // You'll need a character dictionary and CTC decoder
    const data = output.data as Float32Array;

    // Placeholder: return empty string
    // TODO: Implement CTC decoding with Vietnamese character set
    return '[Text recognition not yet implemented - see docs/ONNX_MODELS.md]';
  }
}
