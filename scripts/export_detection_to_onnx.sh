#!/bin/bash
# Script to export PaddleOCR detection model to ONNX format
# Requires: paddle2onnx

set -e

# Configuration
PADDLE_MODEL_DIR="${1:-./PaddleOCR/inference/det_model}"
OUTPUT_PATH="${2:-./models/detection.onnx}"
OPSET_VERSION="${3:-14}"

echo "========================================="
echo "PaddleOCR Detection Model → ONNX Export"
echo "========================================="
echo ""

# Check if paddle2onnx is installed
if ! command -v paddle2onnx &> /dev/null; then
    echo "❌ paddle2onnx not found!"
    echo ""
    echo "Install with:"
    echo "  pip install paddle2onnx"
    echo ""
    exit 1
fi

# Check if model directory exists
if [ ! -d "$PADDLE_MODEL_DIR" ]; then
    echo "❌ Model directory not found: $PADDLE_MODEL_DIR"
    echo ""
    echo "Please download PaddleOCR detection model first:"
    echo "  cd PaddleOCR"
    echo "  mkdir -p inference"
    echo "  cd inference"
    echo "  wget https://paddleocr.bj.bcebos.com/PP-OCRv3/english/en_PP-OCRv3_det_infer.tar"
    echo "  tar -xf en_PP-OCRv3_det_infer.tar"
    echo "  mv en_PP-OCRv3_det_infer det_model"
    echo ""
    exit 1
fi

# Create output directory
mkdir -p "$(dirname "$OUTPUT_PATH")"

echo "Converting PaddleOCR model to ONNX..."
echo "  Input:  $PADDLE_MODEL_DIR"
echo "  Output: $OUTPUT_PATH"
echo "  Opset:  $OPSET_VERSION"
echo ""

# Convert using paddle2onnx
paddle2onnx \
  --model_dir "$PADDLE_MODEL_DIR" \
  --model_filename inference.pdmodel \
  --params_filename inference.pdiparams \
  --save_file "$OUTPUT_PATH" \
  --opset_version "$OPSET_VERSION" \
  --enable_onnx_checker True

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Detection model exported successfully!"
    echo "   Saved to: $OUTPUT_PATH"
    echo ""

    # Check file size
    FILE_SIZE=$(du -h "$OUTPUT_PATH" | cut -f1)
    echo "   File size: $FILE_SIZE"
    echo ""
else
    echo ""
    echo "❌ Export failed!"
    echo ""
    exit 1
fi

# Verify ONNX model (if onnx package is available)
if command -v python3 &> /dev/null; then
    python3 << EOF
import sys
try:
    import onnx
    model = onnx.load("$OUTPUT_PATH")
    onnx.checker.check_model(model)
    print("✅ ONNX model verification passed")
    print("")
    print("Model Info:")
    print(f"  Inputs:  {[i.name for i in model.graph.input]}")
    print(f"  Outputs: {[o.name for o in model.graph.output]}")
    print("")
except ImportError:
    print("⚠️  Install 'onnx' package to verify model: pip install onnx")
except Exception as e:
    print(f"⚠️  Model verification failed: {e}")
    sys.exit(1)
EOF
fi

echo "========================================="
echo "Next steps:"
echo "  1. Set USE_ONNX=true in .env file"
echo "  2. Update DETECTION_MODEL_PATH=$OUTPUT_PATH"
echo "  3. Export recognition model (see export_recognition_to_onnx.py)"
echo "  4. Run: npm run dev"
echo "========================================="
