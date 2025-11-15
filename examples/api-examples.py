#!/usr/bin/env python3
"""
API Testing Examples - Python
Vietnamese OCR API
"""

import requests
import json
import os
from pathlib import Path

# Configuration
API_URL = os.getenv('API_URL', 'http://localhost:3000')
SAMPLES_DIR = Path(__file__).parent.parent / 'samples'


def print_header(title):
    """Print formatted header"""
    print("\n" + "="*60)
    print(f"  {title}")
    print("="*60 + "\n")


def print_result(result):
    """Pretty print JSON result"""
    print(json.dumps(result, indent=2, ensure_ascii=False))
    print()


def example_1_health_check():
    """Example 1: Health Check"""
    print_header("Example 1: Health Check")

    response = requests.get(f'{API_URL}/api/health')

    print(f"Status Code: {response.status_code}")
    print_result(response.json())


def example_2_ocr_cpu():
    """Example 2: OCR Processing (CPU)"""
    print_header("Example 2: OCR Processing (CPU)")

    image_path = SAMPLES_DIR / 'doanvan1.png'

    if not image_path.exists():
        print(f"Error: Image not found at {image_path}")
        return

    with open(image_path, 'rb') as f:
        files = {'image': f}
        data = {'device': 'cpu'}

        response = requests.post(
            f'{API_URL}/api/ocr',
            files=files,
            data=data
        )

    print(f"Status Code: {response.status_code}")
    print_result(response.json())


def example_3_ocr_gpu():
    """Example 3: OCR Processing (GPU)"""
    print_header("Example 3: OCR Processing (CUDA GPU)")

    image_path = SAMPLES_DIR / 'doanvan1.png'

    if not image_path.exists():
        print(f"Error: Image not found at {image_path}")
        return

    with open(image_path, 'rb') as f:
        files = {'image': f}
        data = {'device': 'cuda'}

        response = requests.post(
            f'{API_URL}/api/ocr',
            files=files,
            data=data
        )

    print(f"Status Code: {response.status_code}")
    result = response.json()

    if result.get('success'):
        print(f"✅ OCR Successful!")
        print(f"Text count: {result.get('count', 0)}")
        print(f"Processing time: {result.get('processingTime', 'N/A')} ms")
        print("\nRecognized Texts:")
        for i, text in enumerate(result.get('texts', []), 1):
            print(f"  {i}. {text}")
    else:
        print(f"❌ OCR Failed: {result.get('error', 'Unknown error')}")

    print()


def example_4_list_images():
    """Example 4: List Uploaded Images"""
    print_header("Example 4: List Uploaded Images")

    response = requests.get(f'{API_URL}/api/images')

    print(f"Status Code: {response.status_code}")
    result = response.json()

    images = result.get('images', [])
    print(f"Total images: {len(images)}\n")

    for img in images[:5]:  # Show first 5
        print(f"  - {img.get('filename')}")
        print(f"    Uploaded: {img.get('uploadedAt')}")
        print(f"    Path: {img.get('path')}\n")


def example_5_extract_text_only():
    """Example 5: Extract Only Text"""
    print_header("Example 5: Extract Only Text")

    image_path = SAMPLES_DIR / 'doanvan1.png'

    if not image_path.exists():
        print(f"Error: Image not found at {image_path}")
        return

    with open(image_path, 'rb') as f:
        files = {'image': f}
        data = {'device': 'cpu'}

        response = requests.post(
            f'{API_URL}/api/ocr',
            files=files,
            data=data
        )

    result = response.json()

    if result.get('success'):
        texts = result.get('texts', [])
        print("Extracted Text:\n")
        print('\n'.join(texts))
    else:
        print(f"Error: {result.get('error')}")

    print()


def example_6_save_result():
    """Example 6: Save Result to File"""
    print_header("Example 6: Save Result to File")

    image_path = SAMPLES_DIR / 'doanvan1.png'

    if not image_path.exists():
        print(f"Error: Image not found at {image_path}")
        return

    with open(image_path, 'rb') as f:
        files = {'image': f}
        data = {'device': 'cpu'}

        response = requests.post(
            f'{API_URL}/api/ocr',
            files=files,
            data=data
        )

    # Save result
    output_file = f'result_{os.getpid()}.json'

    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(response.json(), f, indent=2, ensure_ascii=False)

    print(f"✅ Result saved to: {output_file}")
    print(f"File size: {os.path.getsize(output_file)} bytes\n")


def example_7_batch_processing():
    """Example 7: Batch Processing Multiple Images"""
    print_header("Example 7: Batch Processing")

    # Get all images in samples directory
    image_files = list(SAMPLES_DIR.glob('*.png')) + list(SAMPLES_DIR.glob('*.jpg'))

    print(f"Found {len(image_files)} images\n")

    results = []

    for image_path in image_files[:3]:  # Process first 3
        print(f"Processing: {image_path.name}...")

        with open(image_path, 'rb') as f:
            files = {'image': f}
            data = {'device': 'cpu'}

            response = requests.post(
                f'{API_URL}/api/ocr',
                files=files,
                data=data
            )

        result = response.json()

        if result.get('success'):
            print(f"  ✅ Success - {result.get('count', 0)} texts found")
            results.append({
                'filename': image_path.name,
                'texts': result.get('texts', []),
                'count': result.get('count', 0)
            })
        else:
            print(f"  ❌ Failed - {result.get('error', 'Unknown error')}")

    print(f"\nBatch processing complete: {len(results)}/{len(image_files[:3])} successful\n")


def example_8_error_handling():
    """Example 8: Error Handling"""
    print_header("Example 8: Error Handling")

    print("Testing with invalid image path...\n")

    # Test with non-existent file
    try:
        response = requests.post(
            f'{API_URL}/api/ocr',
            files={'image': ('test.txt', b'not an image')},
            data={'device': 'cpu'}
        )

        print(f"Status Code: {response.status_code}")
        print_result(response.json())

    except requests.exceptions.RequestException as e:
        print(f"Request failed: {e}")


def main():
    """Run all examples"""
    print("\n" + "="*60)
    print("  Vietnamese OCR API - Python Examples")
    print(f"  API URL: {API_URL}")
    print("="*60)

    try:
        # Run examples
        example_1_health_check()
        example_2_ocr_cpu()
        example_4_list_images()
        example_5_extract_text_only()
        example_6_save_result()
        example_7_batch_processing()
        example_8_error_handling()

        # Optional: GPU example (comment out if no GPU)
        # example_3_ocr_gpu()

        print("\n" + "="*60)
        print("  All Examples Completed!")
        print("="*60 + "\n")

    except requests.exceptions.ConnectionError:
        print(f"\n❌ Error: Cannot connect to API at {API_URL}")
        print("Make sure the server is running:\n")
        print("  npm run dev")
        print()
    except KeyboardInterrupt:
        print("\n\nInterrupted by user")
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()


if __name__ == '__main__':
    main()
