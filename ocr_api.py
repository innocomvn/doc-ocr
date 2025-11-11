#!/usr/bin/env python3
"""
OCR API Script
Processes images using PaddleOCR for detection and VietOCR for recognition
Returns results as JSON
"""

import sys
import json
import argparse
import cv2
from PIL import Image
import torch

from vietocr.vietocr.tool.predictor import Predictor
from vietocr.vietocr.tool.config import Cfg
from PaddleOCR import PaddleOCR


def predict(recognitor, detector, img_path, padding=4):
    """
    Perform OCR on an image

    Args:
        recognitor: VietOCR predictor
        detector: PaddleOCR detector
        img_path: Path to input image
        padding: Padding around detected boxes

    Returns:
        boxes: List of bounding boxes
        texts: List of recognized texts
    """
    try:
        # Load image
        img = cv2.imread(img_path)

        if img is None:
            return None, None

        # Text detection using PaddleOCR
        result = detector.ocr(img_path, cls=False, det=True, rec=False)

        if not result or not result[0]:
            return [], []

        result = result[0]

        # Filter and format boxes
        boxes = []
        for line in result:
            boxes.append([
                [int(line[0][0]), int(line[0][1])],
                [int(line[2][0]), int(line[2][1])]
            ])

        # Reverse order (bottom to top)
        boxes = boxes[::-1]

        # Add padding to boxes
        for box in boxes:
            box[0][0] = max(0, box[0][0] - padding)
            box[0][1] = max(0, box[0][1] - padding)
            box[1][0] = box[1][0] + padding
            box[1][1] = box[1][1] + padding

        # Text recognition using VietOCR
        texts = []
        valid_boxes = []

        for box in boxes:
            try:
                # Crop image region
                cropped_image = img[box[0][1]:box[1][1], box[0][0]:box[1][0]]

                if cropped_image.size == 0:
                    continue

                # Convert to PIL Image
                cropped_image = Image.fromarray(cropped_image)

                # Recognize text
                rec_result = recognitor.predict(cropped_image)

                texts.append(rec_result)
                valid_boxes.append(box)

            except Exception as e:
                # Skip boxes that cause errors
                continue

        return valid_boxes, texts

    except Exception as e:
        print(f"Error in predict: {str(e)}", file=sys.stderr)
        return None, None


def main():
    parser = argparse.ArgumentParser(description='OCR API for Vietnamese documents')
    parser.add_argument('--img', required=True, help='Path to input image')
    parser.add_argument('--padding', type=int, default=4, help='Padding around detected boxes')
    parser.add_argument('--device', default='cpu', help='Device to use: cpu, cuda, or mps')
    parser.add_argument('--output', help='Path to save output JSON (optional)')
    args = parser.parse_args()

    try:
        # Configure VietOCR
        config = Cfg.load_config_from_name('vgg_transformer')
        config['cnn']['pretrained'] = True
        config['predictor']['beamsearch'] = True

        # Set device (cpu, cuda, or mps for Apple Silicon)
        if args.device == 'auto':
            if torch.cuda.is_available():
                config['device'] = 'cuda:0'
            elif torch.backends.mps.is_available():
                config['device'] = 'mps'
            else:
                config['device'] = 'cpu'
        else:
            config['device'] = args.device

        recognitor = Predictor(config)

        # Configure PaddleOCR
        use_gpu = args.device.startswith('cuda')
        detector = PaddleOCR(use_angle_cls=False, lang="vi", use_gpu=use_gpu, show_log=False)

        # Perform OCR
        boxes, texts = predict(recognitor, detector, args.img, padding=args.padding)

        if boxes is None or texts is None:
            result = {
                'success': False,
                'error': 'Failed to process image',
                'boxes': [],
                'texts': []
            }
        else:
            result = {
                'success': True,
                'boxes': boxes,
                'texts': texts,
                'count': len(texts)
            }

        # Output JSON
        output_json = json.dumps(result, ensure_ascii=False, indent=2)

        if args.output:
            with open(args.output, 'w', encoding='utf-8') as f:
                f.write(output_json)

        print(output_json)

    except Exception as e:
        error_result = {
            'success': False,
            'error': str(e),
            'boxes': [],
            'texts': []
        }
        print(json.dumps(error_result, ensure_ascii=False), file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
