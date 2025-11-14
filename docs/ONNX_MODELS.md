# ONNX Models Setup Guide

This document explains how to set up ONNX models for the TypeScript OCR service.

## Overview

The TypeScript implementation supports two modes:

1. **Python Wrapper Mode** (Default) - Uses the existing Python OCR scripts
2. **ONNX Runtime Mode** - Pure TypeScript/Node.js using ONNX models

## Quick Start (Python Wrapper Mode)

By default, the TypeScript server uses the Python wrapper, which requires no additional setup:

```bash
# Just run the TypeScript server
npm run dev
```

This will use the existing Python OCR implementation (`ocr_api.py`).

## Converting to ONNX Models

To use pure TypeScript/Node.js OCR, you need to convert the PyTorch/Paddle models to ONNX format.

### Prerequisites

```bash
pip install onnx onnxruntime torch
```

### Step 1: Export VietOCR Model to ONNX

Create a script `export_vietocr_to_onnx.py`:

```python
import torch
from vietocr.vietocr.tool.config import Cfg
from vietocr.vietocr.model.transformerocr import VietOCR

# Load VietOCR config
config = Cfg.load_config_from_name('vgg_transformer')
config['cnn']['pretrained'] = False
config['device'] = 'cpu'

# Create model
model = VietOCR(config['vocab'], config['backbone'], config['cnn'],
                config['transformer'], config['seq_modeling'])

# Load pretrained weights
model.load_state_dict(torch.load('path/to/weights.pth', map_location='cpu'))
model.eval()

# Create dummy input (batch=1, channels=3, height=32, width=256)
dummy_input = torch.randn(1, 3, 32, 256)

# Export to ONNX
torch.onnx.export(
    model,
    dummy_input,
    'models/recognition.onnx',
    input_names=['input'],
    output_names=['output'],
    dynamic_axes={
        'input': {0: 'batch', 3: 'width'},
        'output': {0: 'batch'}
    },
    opset_version=14
)

print('VietOCR model exported to models/recognition.onnx')
```

Run the script:

```bash
python export_vietocr_to_onnx.py
```

### Step 2: Export PaddleOCR Detection Model to ONNX

PaddleOCR models can be exported using Paddle2ONNX:

```bash
pip install paddle2onnx

# Export detection model
paddle2onnx \
  --model_dir path/to/paddle_detection_model \
  --model_filename inference.pdmodel \
  --params_filename inference.pdiparams \
  --save_file models/detection.onnx \
  --opset_version 14 \
  --enable_onnx_checker True
```

### Step 3: Verify ONNX Models

```python
import onnx

# Check detection model
detection_model = onnx.load('models/detection.onnx')
onnx.checker.check_model(detection_model)
print('Detection model is valid')

# Check recognition model
recognition_model = onnx.load('models/recognition.onnx')
onnx.checker.check_model(recognition_model)
print('Recognition model is valid')
```

## Alternative: Pre-converted Models

If you don't want to convert models yourself, you can use pre-converted ONNX models:

### Option 1: PaddleOCR ONNX Models

Download from PaddleOCR's official ONNX exports:

```bash
mkdir -p models
cd models

# Download detection model
wget https://paddleocr.bj.bcebos.com/dygraph_v2.0/en/det_mv3_db_v2.0_infer.tar
tar -xf det_mv3_db_v2.0_infer.tar

# Convert to ONNX (see Step 2 above)
```

### Option 2: Use Generic OCR ONNX Models

You can use other OCR models available in ONNX format:

- **EasyOCR Models**: https://github.com/JaidedAI/EasyOCR
- **TrOCR**: https://huggingface.co/microsoft/trocr-base-printed

Note: These may not be optimized for Vietnamese text.

## Configuration

After exporting models, configure the TypeScript server:

### 1. Create `.env` file

```bash
cp .env.example .env
```

### 2. Edit `.env`

```env
# Enable ONNX mode
USE_ONNX=true

# Specify model paths
DETECTION_MODEL_PATH=./models/detection.onnx
RECOGNITION_MODEL_PATH=./models/recognition.onnx
```

### 3. Start server

```bash
npm run dev
```

## Custom Post-Processing

The ONNX service includes placeholder post-processing functions that need to be implemented based on your specific models:

### Detection Post-Processing

Edit `src/services/ONNXOCRService.ts`:

```typescript
private postprocessDetection(results, ...): BoundingBox[] {
  // Implement based on your detection model's output format
  // Common formats:
  // 1. [batch, num_boxes, 5] where 5 = [x1, y1, x2, y2, confidence]
  // 2. [batch, num_boxes, 6] where 6 = [class, confidence, x1, y1, x2, y2]
  // 3. Multiple outputs: boxes, scores, classes
}
```

### Recognition Post-Processing

```typescript
private postprocessRecognition(results): string {
  // Implement CTC decoding or attention-based decoding
  // You'll need:
  // 1. Vietnamese character dictionary
  // 2. CTC decoder or beam search
  // 3. Post-processing (remove duplicates, blank tokens, etc.)
}
```

## Character Dictionary for Vietnamese

Create `src/utils/vocabulary.ts`:

```typescript
export const VIETNAMESE_CHARS = [
  ' ', '!', '"', '#', '$', '%', '&', "'", '(', ')', '*', '+', ',', '-', '.', '/',
  '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
  ':', ';', '<', '=', '>', '?', '@',
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
  'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
  'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
  'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
  // Vietnamese characters
  'À', 'Á', 'Â', 'Ã', 'È', 'É', 'Ê', 'Ì', 'Í', 'Ò', 'Ó', 'Ô', 'Õ', 'Ù', 'Ú', 'Ý',
  'à', 'á', 'â', 'ã', 'è', 'é', 'ê', 'ì', 'í', 'ò', 'ó', 'ô', 'õ', 'ù', 'ú', 'ý',
  'Ă', 'ă', 'Đ', 'đ', 'Ĩ', 'ĩ', 'Ũ', 'ũ', 'Ơ', 'ơ', 'Ư', 'ư',
  'Ạ', 'ạ', 'Ả', 'ả', 'Ấ', 'ấ', 'Ầ', 'ầ', 'Ẩ', 'ẩ', 'Ẫ', 'ẫ', 'Ậ', 'ậ',
  'Ắ', 'ắ', 'Ằ', 'ằ', 'Ẳ', 'ẳ', 'Ẵ', 'ẵ', 'Ặ', 'ặ',
  'Ẹ', 'ẹ', 'Ẻ', 'ẻ', 'Ẽ', 'ẽ', 'Ế', 'ế', 'Ề', 'ề', 'Ể', 'ể', 'Ễ', 'ễ', 'Ệ', 'ệ',
  'Ỉ', 'ỉ', 'Ị', 'ị',
  'Ọ', 'ọ', 'Ỏ', 'ỏ', 'Ố', 'ố', 'Ồ', 'ồ', 'Ổ', 'ổ', 'Ỗ', 'ỗ', 'Ộ', 'ộ',
  'Ớ', 'ớ', 'Ờ', 'ờ', 'Ở', 'ở', 'Ỡ', 'ỡ', 'Ợ', 'ợ',
  'Ụ', 'ụ', 'Ủ', 'ủ', 'Ứ', 'ứ', 'Ừ', 'ừ', 'Ử', 'ử', 'Ữ', 'ữ', 'Ự', 'ự',
  'Ỳ', 'ỳ', 'Ỵ', 'ỵ', 'Ỷ', 'ỷ', 'Ỹ', 'ỹ'
];

export function charToIndex(char: string): number {
  return VIETNAMESE_CHARS.indexOf(char);
}

export function indexToChar(index: number): string {
  return VIETNAMESE_CHARS[index] || '';
}
```

## Performance Comparison

| Mode | Startup Time | Processing Speed | Accuracy | Dependencies |
|------|--------------|------------------|----------|--------------|
| Python Wrapper | Fast | Medium | High | Python + libs |
| ONNX Runtime | Slow (load models) | Fast | High* | Node.js only |

*Accuracy depends on model conversion quality

## Troubleshooting

### Model Loading Errors

```
Error: Failed to load ONNX models
```

**Solutions:**
1. Verify model files exist at specified paths
2. Check ONNX models are valid (use `onnx.checker.check_model()`)
3. Ensure onnxruntime-node is installed correctly
4. Try falling back to Python wrapper mode (`USE_ONNX=false`)

### Post-Processing Issues

```
Text recognition returns empty or incorrect results
```

**Solutions:**
1. Implement proper post-processing for your model
2. Verify character dictionary matches your model's vocabulary
3. Check model input/output shapes match expected formats
4. Test models with Python/PyTorch first to validate

## Recommended Approach

For production use, we recommend:

1. **Start with Python Wrapper Mode** - Works out of the box
2. **Test thoroughly** - Ensure OCR accuracy meets requirements
3. **Then convert to ONNX** - If you need pure Node.js deployment
4. **Validate accuracy** - Compare ONNX vs Python results

## Resources

- [ONNX Runtime](https://onnxruntime.ai/)
- [Paddle2ONNX](https://github.com/PaddlePaddle/Paddle2ONNX)
- [PyTorch ONNX Export](https://pytorch.org/docs/stable/onnx.html)
- [VietOCR](https://github.com/pbcquoc/vietocr)
- [PaddleOCR](https://github.com/PaddlePaddle/PaddleOCR)
