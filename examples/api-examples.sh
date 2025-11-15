#!/bin/bash
# API Testing Examples
# Vietnamese OCR API

BASE_URL="${API_URL:-http://localhost:3000}"

echo "========================================="
echo "Vietnamese OCR API - Testing Examples"
echo "Base URL: $BASE_URL"
echo "========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Example 1: Health Check
echo -e "${BLUE}Example 1: Health Check${NC}"
echo "Request: GET /api/health"
echo ""
curl -X GET "$BASE_URL/api/health" | jq '.'
echo ""
echo ""

# Example 2: OCR Processing (CPU)
echo -e "${BLUE}Example 2: OCR Processing (CPU)${NC}"
echo "Request: POST /api/ocr"
echo "File: samples/doanvan1.png"
echo "Device: cpu"
echo ""

if [ -f "samples/doanvan1.png" ]; then
    curl -X POST "$BASE_URL/api/ocr" \
      -F "image=@samples/doanvan1.png" \
      -F "device=cpu" | jq '.'
else
    echo -e "${RED}Error: samples/doanvan1.png not found${NC}"
fi
echo ""
echo ""

# Example 3: OCR Processing (GPU)
echo -e "${BLUE}Example 3: OCR Processing (CUDA GPU)${NC}"
echo "Request: POST /api/ocr"
echo "File: samples/doanvan1.png"
echo "Device: cuda"
echo ""

if [ -f "samples/doanvan1.png" ]; then
    curl -X POST "$BASE_URL/api/ocr" \
      -F "image=@samples/doanvan1.png" \
      -F "device=cuda" | jq '.'
else
    echo -e "${RED}Error: samples/doanvan1.png not found${NC}"
fi
echo ""
echo ""

# Example 4: List Uploaded Images
echo -e "${BLUE}Example 4: List Uploaded Images${NC}"
echo "Request: GET /api/images"
echo ""
curl -X GET "$BASE_URL/api/images" | jq '.'
echo ""
echo ""

# Example 5: Delete Image
echo -e "${BLUE}Example 5: Delete Image${NC}"
echo "Request: DELETE /api/images/{filename}"
echo ""
echo "Note: Replace {filename} with actual filename"
echo "Example: curl -X DELETE \"$BASE_URL/api/images/abc123.jpg\""
echo ""
echo ""

# Example 6: Upload Custom Image
echo -e "${BLUE}Example 6: Upload Custom Image${NC}"
echo "Usage:"
echo "  curl -X POST \"$BASE_URL/api/ocr\" \\"
echo "    -F \"image=@/path/to/your/image.jpg\" \\"
echo "    -F \"device=cpu\" | jq '.'"
echo ""
echo ""

# Example 7: Save Result to File
echo -e "${BLUE}Example 7: Save OCR Result to File${NC}"
echo ""

if [ -f "samples/doanvan1.png" ]; then
    OUTPUT_FILE="result_$(date +%s).json"
    curl -X POST "$BASE_URL/api/ocr" \
      -F "image=@samples/doanvan1.png" \
      -F "device=cpu" \
      -o "$OUTPUT_FILE"

    echo -e "${GREEN}Result saved to: $OUTPUT_FILE${NC}"
    echo ""
    cat "$OUTPUT_FILE" | jq '.'
else
    echo -e "${RED}Error: samples/doanvan1.png not found${NC}"
fi
echo ""
echo ""

# Example 8: Extract Only Texts
echo -e "${BLUE}Example 8: Extract Only Text (jq filter)${NC}"
echo ""

if [ -f "samples/doanvan1.png" ]; then
    curl -X POST "$BASE_URL/api/ocr" \
      -F "image=@samples/doanvan1.png" \
      -F "device=cpu" \
      -s | jq -r '.texts | join("\n")'
else
    echo -e "${RED}Error: samples/doanvan1.png not found${NC}"
fi
echo ""
echo ""

echo "========================================="
echo "Testing Complete!"
echo "========================================="
