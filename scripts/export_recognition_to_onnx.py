#!/usr/bin/env python3
"""
Script to export VietOCR model to ONNX format
This is a template - you need to adjust paths and config based on your models
"""

import torch
import sys
import os

# Add vietocr to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'vietocr'))

from vietocr.tool.config import Cfg
from vietocr.model.transformerocr import VietOCR

def export_vietocr_to_onnx(
    output_path='models/recognition.onnx',
    config_name='vgg_transformer',
    weights_path=None
):
    """
    Export VietOCR model to ONNX format

    Args:
        output_path: Path to save ONNX model
        config_name: VietOCR config name
        weights_path: Path to pretrained weights (optional)
    """
    print(f"Loading VietOCR config: {config_name}")

    # Load config
    config = Cfg.load_config_from_name(config_name)
    config['device'] = 'cpu'
    config['cnn']['pretrained'] = False if weights_path else True

    # Create model
    print("Creating VietOCR model...")
    model = VietOCR(
        len(config['vocab']),
        config['backbone'],
        config['cnn'],
        config['transformer'],
        config['seq_modeling']
    )

    # Load weights if provided
    if weights_path:
        print(f"Loading weights from {weights_path}")
        model.load_state_dict(torch.load(weights_path, map_location='cpu'))

    model.eval()

    # Create dummy input
    # VietOCR expects: [batch, channels, height, width]
    # Standard size: [1, 3, 32, 256]
    dummy_input = torch.randn(1, 3, 32, 256)

    # Create output directory
    os.makedirs(os.path.dirname(output_path), exist_ok=True)

    # Export to ONNX
    print(f"Exporting to {output_path}...")
    torch.onnx.export(
        model,
        dummy_input,
        output_path,
        input_names=['input'],
        output_names=['output'],
        dynamic_axes={
            'input': {0: 'batch', 3: 'width'},
            'output': {0: 'batch'}
        },
        opset_version=14,
        export_params=True,
        do_constant_folding=True
    )

    print(f"✅ VietOCR model exported successfully to {output_path}")

    # Verify ONNX model
    try:
        import onnx
        onnx_model = onnx.load(output_path)
        onnx.checker.check_model(onnx_model)
        print("✅ ONNX model is valid")

        # Print model info
        print("\nModel Info:")
        print(f"  Inputs: {[i.name for i in onnx_model.graph.input]}")
        print(f"  Outputs: {[o.name for o in onnx_model.graph.output]}")

    except ImportError:
        print("⚠️  Install 'onnx' package to verify model: pip install onnx")
    except Exception as e:
        print(f"⚠️  Model verification failed: {e}")

def main():
    import argparse

    parser = argparse.ArgumentParser(description='Export VietOCR model to ONNX')
    parser.add_argument(
        '--output',
        default='models/recognition.onnx',
        help='Output ONNX file path'
    )
    parser.add_argument(
        '--config',
        default='vgg_transformer',
        help='VietOCR config name'
    )
    parser.add_argument(
        '--weights',
        help='Path to pretrained weights file (.pth)'
    )

    args = parser.parse_args()

    try:
        export_vietocr_to_onnx(
            output_path=args.output,
            config_name=args.config,
            weights_path=args.weights
        )
    except Exception as e:
        print(f"❌ Export failed: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == '__main__':
    main()
