/**
 * Python OCR Service
 * Fallback implementation that calls the Python OCR script
 */

import { spawn } from 'child_process';
import path from 'path';
import { OCRService } from './OCRService';
import { OCRResult, ProcessingOptions } from '../types/ocr.types';

export class PythonOCRService extends OCRService {
  private ready: boolean = false;
  private pythonScriptPath: string;

  constructor() {
    super();
    this.pythonScriptPath = path.join(process.cwd(), 'ocr_api.py');
  }

  async initialize(): Promise<void> {
    // Check if Python script exists
    const fs = require('fs').promises;
    try {
      await fs.access(this.pythonScriptPath);
      this.ready = true;
    } catch (error) {
      throw new Error(`Python OCR script not found at ${this.pythonScriptPath}`);
    }
  }

  async cleanup(): Promise<void> {
    this.ready = false;
  }

  isReady(): boolean {
    return this.ready;
  }

  async processImage(
    imagePath: string,
    options?: ProcessingOptions
  ): Promise<OCRResult> {
    if (!this.ready) {
      throw new Error('OCR Service not initialized');
    }

    const device = options?.device || 'cpu';
    const padding = options?.padding || 4;

    return new Promise((resolve, reject) => {
      const pythonProcess = spawn('python3', [
        this.pythonScriptPath,
        '--img', imagePath,
        '--device', device,
        '--padding', padding.toString()
      ]);

      let stdout = '';
      let stderr = '';

      pythonProcess.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      pythonProcess.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      pythonProcess.on('close', (code) => {
        if (code !== 0) {
          reject(new Error(`OCR process failed: ${stderr}`));
        } else {
          try {
            const result = JSON.parse(stdout);
            resolve(result);
          } catch (e) {
            reject(new Error(`Failed to parse OCR result: ${(e as Error).message}`));
          }
        }
      });

      pythonProcess.on('error', (error) => {
        reject(new Error(`Failed to start OCR process: ${error.message}`));
      });
    });
  }
}
