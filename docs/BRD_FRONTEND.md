# Business Requirements Document (BRD)
# Vietnamese OCR Web Application - Frontend

**Version:** 2.0.0
**Date:** November 15, 2024
**Status:** Final
**Author:** Product Team
**Stakeholders:** Development Team, End Users, Product Management

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Project Overview](#2-project-overview)
3. [Business Objectives](#3-business-objectives)
4. [User Personas](#4-user-personas)
5. [User Stories](#5-user-stories)
6. [Functional Requirements](#6-functional-requirements)
7. [Screen Specifications](#7-screen-specifications)
8. [UI/UX Requirements](#8-uiux-requirements)
9. [Technical Requirements](#9-technical-requirements)
10. [Non-Functional Requirements](#10-non-functional-requirements)
11. [Acceptance Criteria](#11-acceptance-criteria)
12. [Future Enhancements](#12-future-enhancements)

---

## 1. Executive Summary

### 1.1 Purpose
This document defines the business and functional requirements for the Vietnamese OCR Web Application frontend. The application enables users to upload images of Vietnamese documents and extract text using advanced OCR technology.

### 1.2 Scope
The frontend application provides:
- Image upload interface (drag & drop + file selection)
- Real-time OCR processing with device selection
- Visual results display with bounding boxes
- Text extraction and export capabilities
- Responsive design for desktop and mobile devices

### 1.3 Target Audience
- Vietnamese-speaking users
- Document digitization professionals
- Students and researchers
- Business users processing Vietnamese documents
- Developers integrating OCR capabilities

---

## 2. Project Overview

### 2.1 Background
Traditional OCR solutions often struggle with Vietnamese text due to its complex diacritical marks and character combinations. This application combines PaddleOCR for text detection and VietOCR for accurate Vietnamese text recognition.

### 2.2 Goals
1. Provide an intuitive, user-friendly interface for Vietnamese OCR
2. Support multiple device types (CPU, GPU, Apple Silicon)
3. Display results with visual feedback (bounding boxes)
4. Enable easy text extraction and export
5. Ensure fast, responsive user experience

### 2.3 Success Metrics
- **User Engagement:** 80% of users complete full OCR workflow
- **Performance:** OCR processing completes within 10 seconds (CPU)
- **Usability:** 90% of users can upload and process without instructions
- **Accuracy:** User satisfaction with OCR results > 85%
- **Accessibility:** Works on 95% of modern browsers

---

## 3. Business Objectives

### 3.1 Primary Objectives
1. **Simplify Vietnamese Text Extraction**
   - Reduce manual transcription time by 90%
   - Provide accurate Vietnamese character recognition
   - Support various document types and image qualities

2. **Enhance User Experience**
   - Intuitive drag-and-drop interface
   - Real-time visual feedback
   - Clear error messages and guidance

3. **Enable Productivity**
   - Batch processing capability (future)
   - Copy/paste functionality
   - Export in multiple formats

### 3.2 Secondary Objectives
1. Demonstrate OCR technology capabilities
2. Provide API integration examples
3. Support research and education
4. Enable document digitization workflows

---

## 4. User Personas

### 4.1 Persona 1: Document Administrator
**Name:** Lan Nguyen
**Age:** 32
**Role:** Administrative Assistant
**Tech Savvy:** Moderate

**Goals:**
- Digitize paper documents quickly
- Extract text for archiving
- Minimize manual data entry

**Pain Points:**
- Manual transcription is time-consuming
- Typing Vietnamese with diacritics is error-prone
- Limited OCR tools for Vietnamese

**Usage Pattern:**
- Processes 10-20 documents daily
- Needs quick results
- Values accuracy over speed

### 4.2 Persona 2: Researcher
**Name:** Minh Tran
**Age:** 28
**Role:** Graduate Student
**Tech Savvy:** High

**Goals:**
- Extract text from historical documents
- Analyze large volumes of Vietnamese text
- Integrate with research workflow

**Pain Points:**
- Need for API integration
- Batch processing requirements
- Export to various formats

**Usage Pattern:**
- Occasional heavy use (100+ documents)
- Needs programmatic access
- Requires high accuracy

### 4.3 Persona 3: Small Business Owner
**Name:** Hoa Le
**Age:** 45
**Role:** Shop Owner
**Tech Savvy:** Low

**Goals:**
- Process invoices and receipts
- Simple, straightforward operation
- No technical knowledge required

**Pain Points:**
- Complex software is overwhelming
- Needs mobile support
- Limited time for learning

**Usage Pattern:**
- Uses 2-3 times per week
- Basic functionality only
- Prefers visual interface

---

## 5. User Stories

### 5.1 Core User Stories

**US-001: Upload Image**
```
AS A user
I WANT TO upload an image of a Vietnamese document
SO THAT I can extract text from it
```

**US-002: Drag and Drop**
```
AS A user
I WANT TO drag and drop an image file
SO THAT I can upload it quickly without browsing
```

**US-003: See Preview**
```
AS A user
I WANT TO see a preview of my uploaded image
SO THAT I can verify I uploaded the correct file
```

**US-004: Select Device**
```
AS A user
I WANT TO choose between CPU, GPU, or MPS processing
SO THAT I can optimize for my hardware
```

**US-005: View Results**
```
AS A user
I WANT TO see extracted text with bounding boxes
SO THAT I can verify OCR accuracy
```

**US-006: Copy Text**
```
AS A user
I WANT TO copy extracted text to clipboard
SO THAT I can paste it into other applications
```

**US-007: Download Results**
```
AS A user
I WANT TO download OCR results as JSON
SO THAT I can process them programmatically
```

**US-008: Clear and Start Over**
```
AS A user
I WANT TO clear results and upload a new image
SO THAT I can process multiple documents
```

**US-009: See Processing Status**
```
AS A user
I WANT TO see a loading indicator during OCR
SO THAT I know the system is working
```

**US-010: Handle Errors**
```
AS A user
I WANT TO see clear error messages when something fails
SO THAT I can understand and fix the problem
```

---

## 6. Functional Requirements

### 6.1 Image Upload

**FR-001: File Selection**
- Users can click "Chọn tệp" button to open file browser
- Supported formats: JPG, JPEG, PNG, GIF, BMP
- Maximum file size: 10MB
- Clear error message if file exceeds size limit

**FR-002: Drag and Drop**
- Users can drag image files into upload area
- Visual feedback on drag over (highlighted border)
- Auto-upload on drop
- Reject non-image files with error message

**FR-003: File Validation**
- Validate file type before upload
- Validate file size before processing
- Display validation errors as toast notifications
- Prevent multiple simultaneous uploads

### 6.2 Image Preview

**FR-004: Preview Display**
- Show uploaded image in preview section
- Maintain aspect ratio
- Fit image within container (max 800px width)
- Display original filename

**FR-005: Preview Controls**
- Show device selection radio buttons
- Display "Xử lý OCR" button
- Display "Xóa" (Clear) button
- Disable process button during processing

### 6.3 Device Selection

**FR-006: Device Options**
- Provide 3 radio button options:
  - CPU (default)
  - CUDA GPU
  - Apple Silicon (MPS)
- Default selection: CPU
- Persist selection between uploads (session storage)

### 6.4 OCR Processing

**FR-007: Processing Workflow**
- Display loading spinner on "Xử lý OCR" click
- Disable all controls during processing
- Show processing status in button text
- Handle processing timeout (60 seconds)

**FR-008: Progress Indication**
- Change button text to "Đang xử lý..."
- Show animated spinner icon
- Disable button during processing
- Re-enable on completion or error

### 6.5 Results Display

**FR-009: Results Section**
- Display results section after successful OCR
- Show statistics:
  - Number of text lines detected
  - Processing time (if available)
  - Status (success/failure)
- Scroll to results automatically

**FR-010: Bounding Boxes**
- Overlay canvas on preview image
- Draw rectangles around detected text
- Use consistent color (blue #4f46e5)
- Number each box sequentially
- Scale boxes to match displayed image size

**FR-011: Text Display**
- List all recognized text lines
- Number each line matching bounding box
- Display in readable font with padding
- Highlight each line on hover (future)
- Support UTF-8 Vietnamese characters

### 6.6 Text Export

**FR-012: Copy to Clipboard**
- "📋 Sao chép văn bản" button
- Copy all text lines (newline-separated)
- Show success toast: "Đã sao chép văn bản!"
- Handle copy failures gracefully

**FR-013: Download JSON**
- "💾 Tải xuống JSON" button
- Download complete OCR result as JSON file
- Filename: `ocr_result_[timestamp].json`
- Include all data: boxes, texts, metadata

### 6.7 Clear/Reset

**FR-014: Clear Functionality**
- "Xóa" button clears all state
- Removes preview image
- Hides results section
- Resets file input
- Clears canvas overlay
- Returns to initial upload state

---

## 7. Screen Specifications

### 7.1 Screen 1: Initial Upload State

**Screen ID:** SCR-001
**State:** Initial/Empty
**URL:** `/` (index.html)

#### 7.1.1 Layout Structure

```
┌─────────────────────────────────────────────────┐
│                    HEADER                        │
│  📄 Vietnamese Document OCR                     │
│  Nhận dạng văn bản tiếng Việt từ hình ảnh      │
└─────────────────────────────────────────────────┘
│                                                  │
│  ┌──────────────────────────────────────────┐  │
│  │         UPLOAD SECTION                    │  │
│  │                                           │  │
│  │         ┌─────────────────────┐          │  │
│  │         │                     │          │  │
│  │         │       📤            │          │  │
│  │         │                     │          │  │
│  │         │ Kéo thả hình ảnh   │          │  │
│  │         │     vào đây        │          │  │
│  │         │                     │          │  │
│  │         │       hoặc          │          │  │
│  │         │                     │          │  │
│  │         │  [Chọn tệp]        │          │  │
│  │         │                     │          │  │
│  │         │  Hỗ trợ: JPG, PNG │          │  │
│  │         │  (Tối đa 10MB)    │          │  │
│  │         │                     │          │  │
│  │         └─────────────────────┘          │  │
│  │                                           │  │
│  │         DEVICE SELECTOR                   │  │
│  │  ○ CPU  ○ GPU (CUDA)  ○ Apple Silicon   │  │
│  │                                           │  │
│  └──────────────────────────────────────────┘  │
│                                                  │
│                    FOOTER                        │
│         Powered by PaddleOCR + VietOCR          │
└─────────────────────────────────────────────────┘
```

#### 7.1.2 Components

**Component: Header**
- **Element:** `<header>`
- **Content:**
  - Title: "📄 Vietnamese Document OCR"
  - Subtitle: "Nhận dạng văn bản tiếng Việt từ hình ảnh"
- **Styling:**
  - Text align: center
  - Font size: 2.5rem (title), 1.1rem (subtitle)
  - Color: Primary (#4f46e5) for title
  - Padding: 2rem top/bottom

**Component: Upload Area**
- **Element:** `<div id="uploadArea">`
- **State:** Default (no hover)
- **Content:**
  - Icon: 📤 (font-size: 4rem)
  - Text: "Kéo thả hình ảnh vào đây"
  - Text: "hoặc"
  - Button: "Chọn tệp"
  - Help text: "Hỗ trợ: JPG, PNG, GIF, BMP (Tối đa 10MB)"
- **Styling:**
  - Border: 2px dashed #e5e7eb
  - Border-radius: 0.75rem
  - Padding: 3rem 2rem
  - Background: white
  - Cursor: pointer
- **States:**
  - Default: border-color #e5e7eb
  - Hover: border-color #4f46e5, background rgba(79,70,229,0.05)
  - Dragover: border-color #4f46e5, background rgba(79,70,229,0.05)

**Component: Device Selector**
- **Element:** `<div class="device-selector">`
- **Content:**
  - Radio: CPU (checked by default)
  - Radio: GPU (CUDA)
  - Radio: Apple Silicon (MPS)
- **Styling:**
  - Display: flex, gap 2rem, justify-center
  - Border-top: 1px solid #e5e7eb
  - Padding-top: 1.5rem
  - Margin-top: 1.5rem

**Component: File Input**
- **Element:** `<input type="file" id="fileInput">`
- **Attributes:**
  - accept: "image/*"
  - hidden: true
- **Trigger:** Clicking upload area or "Chọn tệp" button

**Component: Footer**
- **Element:** `<footer>`
- **Content:** "Powered by PaddleOCR + VietOCR"
- **Styling:**
  - Text align: center
  - Color: #6b7280
  - Font-size: 0.875rem
  - Padding: 2rem

#### 7.1.3 User Interactions

| Action | Event | Response |
|--------|-------|----------|
| Click upload area | onclick | Open file browser |
| Click "Chọn tệp" | onclick | Open file browser |
| Drag file over area | ondragover | Highlight border (blue) |
| Drag file out of area | ondragleave | Remove highlight |
| Drop file | ondrop | Validate and load image → Go to SCR-002 |
| Select file from browser | onchange | Validate and load image → Go to SCR-002 |
| Select device radio | onchange | Update selected device |

#### 7.1.4 Validation Rules

| Field | Rule | Error Message |
|-------|------|---------------|
| File type | Must be image/* | "Vui lòng chọn file hình ảnh!" |
| File size | ≤ 10MB | "File quá lớn! Vui lòng chọn file nhỏ hơn 10MB." |
| File exists | Must be provided | "Vui lòng chọn hình ảnh!" |

#### 7.1.5 Error Handling

**Error Display:** Toast notification
- Position: Bottom-right (fixed)
- Duration: 3 seconds
- Colors:
  - Error: Red (#ef4444)
  - Success: Green (#10b981)
  - Info: Blue (#3b82f6)

---

### 7.2 Screen 2: Preview State

**Screen ID:** SCR-002
**State:** Image Uploaded, Ready to Process
**Trigger:** After successful image upload

#### 7.2.1 Layout Structure

```
┌─────────────────────────────────────────────────┐
│                    HEADER                        │
│  📄 Vietnamese Document OCR                     │
└─────────────────────────────────────────────────┘
│                                                  │
│  ┌──────────────────────────────────────────┐  │
│  │      PREVIEW SECTION (visible)            │  │
│  │                                           │  │
│  │  Hình ảnh đã tải lên                     │  │
│  │                                           │  │
│  │  ┌─────────────────────────────────────┐ │  │
│  │  │                                     │ │  │
│  │  │                                     │ │  │
│  │  │      [PREVIEW IMAGE]                │ │  │
│  │  │                                     │ │  │
│  │  │                                     │ │  │
│  │  └─────────────────────────────────────┘ │  │
│  │                                           │  │
│  │  Device: ● CPU  ○ GPU  ○ MPS            │  │
│  │                                           │  │
│  │  [Xử lý OCR]  [Xóa]                     │  │
│  │                                           │  │
│  └──────────────────────────────────────────┘  │
│                                                  │
│  (Results section hidden)                       │
│                                                  │
└─────────────────────────────────────────────────┘
```

#### 7.2.2 Components

**Component: Preview Section**
- **Element:** `<section id="previewSection">`
- **Display:** block (visible)
- **Content:**
  - Heading: "Hình ảnh đã tải lên"
  - Image preview container
  - Device selector
  - Action buttons

**Component: Image Container**
- **Element:** `<div class="image-container">`
- **Content:**
  - `<img id="previewImage">` - The uploaded image
  - `<canvas id="overlayCanvas">` - Overlay for bounding boxes (initially empty)
- **Styling:**
  - Position: relative
  - Max-width: 100%
  - Display: inline-block
  - Box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1)

**Component: Preview Image**
- **Element:** `<img id="previewImage">`
- **Attributes:**
  - src: Data URL of uploaded image
  - alt: "Preview"
- **Styling:**
  - Max-width: 100%
  - Height: auto
  - Border-radius: 0.5rem

**Component: Overlay Canvas**
- **Element:** `<canvas id="overlayCanvas">`
- **Purpose:** Draw bounding boxes (populated after OCR)
- **Initial State:** Empty, same dimensions as image
- **Styling:**
  - Position: absolute
  - Top: 0, Left: 0
  - Pointer-events: none

**Component: Action Buttons**
- **Element:** `<div class="action-buttons">`
- **Content:**
  - Button: "Xử lý OCR" (primary)
  - Button: "Xóa" (secondary)
- **Styling:**
  - Display: flex
  - Gap: 1rem
  - Margin-top: 1.5rem

**Button: Process OCR**
- **Element:** `<button id="processBtn">`
- **States:**
  - Default: "Xử lý OCR"
  - Processing: "Đang xử lý..." + spinner
  - Disabled: opacity 0.5, cursor not-allowed
- **Styling:**
  - Background: #4f46e5 (primary blue)
  - Color: white
  - Padding: 0.75rem 1.5rem
  - Border-radius: 0.5rem
  - Font-weight: 500

**Button: Clear**
- **Element:** `<button id="clearBtn">`
- **Text:** "Xóa"
- **Styling:**
  - Background: white
  - Border: 1px solid #e5e7eb
  - Color: #111827
  - Padding: 0.75rem 1.5rem

#### 7.2.3 User Interactions

| Action | Event | Response |
|--------|-------|----------|
| Click "Xử lý OCR" | onclick | Start OCR processing → Go to SCR-003 |
| Click "Xóa" | onclick | Clear all → Return to SCR-001 |
| Change device | onchange | Update selected device (no visual change) |

#### 7.2.4 Business Rules

- Preview section only visible after successful upload
- Process button enabled only when image is loaded
- Canvas overlay hidden until OCR results available
- Device selection preserved during processing

---

### 7.3 Screen 3: Processing State

**Screen ID:** SCR-003
**State:** OCR Processing in Progress
**Trigger:** User clicks "Xử lý OCR"

#### 7.3.1 Layout Structure

```
┌─────────────────────────────────────────────────┐
│                    HEADER                        │
└─────────────────────────────────────────────────┘
│                                                  │
│  ┌──────────────────────────────────────────┐  │
│  │      PREVIEW SECTION                      │  │
│  │                                           │  │
│  │  Hình ảnh đã tải lên                     │  │
│  │                                           │  │
│  │  ┌─────────────────────────────────────┐ │  │
│  │  │      [PREVIEW IMAGE]                │ │  │
│  │  └─────────────────────────────────────┘ │  │
│  │                                           │  │
│  │  Device: ● CPU  ○ GPU  ○ MPS            │  │
│  │                                           │  │
│  │  [⏳ Đang xử lý...]  [Xóa] (disabled)   │  │
│  │                                           │  │
│  └──────────────────────────────────────────┘  │
│                                                  │
└─────────────────────────────────────────────────┘
```

#### 7.3.2 Component Changes

**Button: Process OCR (Processing State)**
- **Text:** "Đang xử lý..."
- **Icon:** Animated spinner (⏳ or CSS animation)
- **Disabled:** true
- **Styling:**
  - Background: #6b7280 (gray, disabled state)
  - Cursor: not-allowed
  - Opacity: 0.7

**Spinner Animation**
- **Element:** `<span class="loader">`
- **Styling:**
  - Width: 1rem, Height: 1rem
  - Border: 2px solid rgba(255,255,255,0.3)
  - Border-top-color: white
  - Border-radius: 50%
  - Animation: spin 0.8s linear infinite

**Button: Clear (Disabled)**
- **Disabled:** true
- **Styling:**
  - Opacity: 0.5
  - Cursor: not-allowed

#### 7.3.3 Processing Flow

1. **User clicks "Xử lý OCR"**
2. **Button state changes:**
   - Text → "Đang xử lý..."
   - Spinner appears
   - Button disabled
   - Clear button disabled
3. **API request sent:**
   - POST to `/api/ocr`
   - FormData: image file + device
4. **Waiting for response** (timeout: 60 seconds)
5. **On success:** → Go to SCR-004
6. **On error:** → Show error toast, reset button

#### 7.3.4 Error Scenarios

| Error | Message | Action |
|-------|---------|--------|
| Network error | "Không thể kết nối đến API server!" | Reset button, show toast |
| Timeout (>60s) | "Xử lý quá lâu, vui lòng thử lại!" | Reset button, show toast |
| Server error (500) | "Lỗi xử lý: [error message]" | Reset button, show toast |
| No text found | Show success with 0 texts | → Go to SCR-004 |

---

### 7.4 Screen 4: Results State

**Screen ID:** SCR-004
**State:** OCR Completed with Results
**Trigger:** Successful OCR processing

#### 7.4.1 Layout Structure

```
┌─────────────────────────────────────────────────┐
│                    HEADER                        │
└─────────────────────────────────────────────────┘
│                                                  │
│  ┌──────────────────────────────────────────┐  │
│  │      PREVIEW SECTION                      │  │
│  │                                           │  │
│  │  ┌─────────────────────────────────────┐ │  │
│  │  │  ┌──────────────────────────────┐   │ │  │
│  │  │  │  [PREVIEW IMAGE]             │   │ │  │
│  │  │  │  with bounding boxes         │   │ │  │
│  │  │  │  numbered 1, 2, 3...        │   │ │  │
│  │  │  └──────────────────────────────┘   │ │  │
│  │  │  (Canvas overlay visible)           │ │  │
│  │  └─────────────────────────────────────┘ │  │
│  │                                           │  │
│  │  [Xử lý OCR]  [Xóa]                     │  │
│  └──────────────────────────────────────────┘  │
│                                                  │
│  ┌──────────────────────────────────────────┐  │
│  │      RESULTS SECTION (visible)            │  │
│  │                                           │  │
│  │  Kết quả nhận dạng                       │  │
│  │                                           │  │
│  │  ┌─────────────┐  ┌─────────────────┐   │  │
│  │  │ Số dòng VB: │  │ Trạng thái:     │   │  │
│  │  │     10      │  │  ✓ Thành công   │   │  │
│  │  └─────────────┘  └─────────────────┘   │  │
│  │                                           │  │
│  │  Văn bản nhận dạng:                      │  │
│  │  ┌─────────────────────────────────────┐ │  │
│  │  │ 1. Extracted text line 1           │ │  │
│  │  │ 2. Extracted text line 2           │ │  │
│  │  │ 3. Extracted text line 3           │ │  │
│  │  │ ...                                 │ │  │
│  │  └─────────────────────────────────────┘ │  │
│  │                                           │  │
│  │  [📋 Sao chép văn bản]  [💾 Tải xuống JSON] │  │
│  │                                           │  │
│  └──────────────────────────────────────────┘  │
│                                                  │
└─────────────────────────────────────────────────┘
```

#### 7.4.2 Components

**Component: Results Section**
- **Element:** `<section id="resultsSection">`
- **Display:** block (visible after OCR success)
- **Content:**
  - Heading: "Kết quả nhận dạng"
  - Statistics cards
  - Text results
  - Action buttons

**Component: Statistics Cards**
- **Element:** `<div class="results-stats">`
- **Layout:** Grid, 2 columns (auto-fit, min 200px)
- **Cards:**
  1. **Text Count Card**
     - Label: "Số dòng văn bản:"
     - Value: [count] (from API response)
     - Font-size: 1.5rem (value)
  2. **Status Card**
     - Label: "Trạng thái:"
     - Value: "✓ Thành công" (green) or "✗ Thất bại" (red)

**Component: Text Results Container**
- **Element:** `<div class="text-results">`
- **Content:**
  - Heading: "Văn bản nhận dạng:"
  - Text content display

**Component: Text Content**
- **Element:** `<div id="recognizedText">`
- **Content:** List of recognized text lines
- **Styling:**
  - Background: #f9fafb
  - Padding: 1.5rem
  - Border: 1px solid #e5e7eb
  - Border-radius: 0.5rem
  - Max-height: 400px
  - Overflow-y: auto

**Component: Text Line**
- **Element:** `<div class="text-line">`
- **Content:** "[number]. [text]"
- **Styling:**
  - Padding: 0.5rem
  - Margin-bottom: 0.5rem
  - Background: white
  - Border-radius: 0.25rem
  - Border-left: 3px solid #4f46e5
- **Example:**
  ```html
  <div class="text-line">1. Trường Đại học Bách Khoa Hà Nội</div>
  <div class="text-line">2. Khoa Công nghệ Thông tin</div>
  ```

**Component: Bounding Boxes (Canvas Overlay)**
- **Drawing:** Blue rectangles over detected text regions
- **Numbering:** Small numbers (1, 2, 3...) at top-left of each box
- **Color:** #4f46e5 (blue)
- **Line Width:** 2px
- **Font:** 14px Arial

**Component: Action Buttons**
- **Element:** `<div class="action-buttons">`
- **Buttons:**
  1. "📋 Sao chép văn bản" (Copy)
  2. "💾 Tải xuống JSON" (Download)

#### 7.4.3 Bounding Box Rendering

**Algorithm:**
```javascript
// Get canvas and context
const canvas = overlayCanvas;
const ctx = canvas.getContext('2d');

// Clear previous drawings
ctx.clearRect(0, 0, canvas.width, canvas.height);

// Calculate scale factors
const scaleX = canvas.width / img.naturalWidth;
const scaleY = canvas.height / img.naturalHeight;

// Draw each box
boxes.forEach((box, index) => {
  const x1 = box[0][0] * scaleX;
  const y1 = box[0][1] * scaleY;
  const x2 = box[1][0] * scaleX;
  const y2 = box[1][1] * scaleY;

  // Draw rectangle
  ctx.strokeStyle = '#4f46e5';
  ctx.lineWidth = 2;
  ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);

  // Draw label
  ctx.fillStyle = '#4f46e5';
  ctx.font = '14px Arial';
  ctx.fillText(index + 1, x1 + 5, y1 + 15);
});
```

#### 7.4.4 User Interactions

| Action | Event | Response |
|--------|-------|----------|
| Click "Sao chép văn bản" | onclick | Copy text to clipboard → Show success toast |
| Click "Tải xuống JSON" | onclick | Download JSON file → Show success toast |
| Click "Xử lý OCR" | onclick | Re-process same image → Go to SCR-003 |
| Click "Xóa" | onclick | Clear all → Return to SCR-001 |
| Scroll to results | automatic | Smooth scroll on results display |

#### 7.4.5 Copy Text Functionality

**Process:**
1. User clicks "📋 Sao chép văn bản"
2. Extract all texts from result
3. Join with newline: `texts.join('\n')`
4. Copy to clipboard: `navigator.clipboard.writeText(text)`
5. Show toast: "Đã sao chép văn bản!"

**Example Copied Text:**
```
Trường Đại học Bách Khoa Hà Nội
Khoa Công nghệ Thông tin
Bộ môn Khoa học Máy tính
```

#### 7.4.6 Download JSON Functionality

**Process:**
1. User clicks "💾 Tải xuống JSON"
2. Create JSON string: `JSON.stringify(result, null, 2)`
3. Create Blob: `new Blob([dataStr], { type: 'application/json' })`
4. Create download link
5. Trigger download with filename: `ocr_result_[timestamp].json`
6. Show toast: "Đã tải xuống kết quả!"

**Example JSON:**
```json
{
  "success": true,
  "boxes": [
    [[120, 45], [450, 85]],
    [[120, 95], [520, 135]]
  ],
  "texts": [
    "Trường Đại học Bách Khoa Hà Nội",
    "Khoa Công nghệ Thông tin"
  ],
  "count": 2,
  "filename": "abc123.jpg",
  "originalname": "document.jpg",
  "processingTime": 3542
}
```

#### 7.4.7 Empty Results Handling

**Scenario:** OCR completes but finds no text

**Display:**
```
Kết quả nhận dạng

┌─────────────┐  ┌─────────────────┐
│ Số dòng VB: │  │ Trạng thái:     │
│      0      │  │  ✓ Thành công   │
└─────────────┘  └─────────────────┘

Văn bản nhận dạng:
┌─────────────────────────────────────┐
│ Không tìm thấy văn bản nào.        │
└─────────────────────────────────────┘
```

**Message Styling:**
- Color: #6b7280 (gray)
- Font-style: italic
- Text-align: center

---

### 7.5 Screen 5: Error State

**Screen ID:** SCR-005
**State:** Error During Processing
**Trigger:** API error, network failure, or validation failure

#### 7.5.1 Toast Notification

**Component: Toast**
- **Element:** `<div id="toast">`
- **Position:** Fixed, bottom-right
- **Initial State:** Translated down (hidden)
- **Active State:** Translated to view
- **Duration:** 3 seconds
- **Animation:** Slide up from bottom

**Toast Types:**

1. **Error Toast**
   - Background: #ef4444 (red)
   - Icon: ❌
   - Examples:
     - "Vui lòng chọn file hình ảnh!"
     - "File quá lớn! Vui lòng chọn file nhỏ hơn 10MB."
     - "Lỗi xử lý: [error message]"
     - "Không thể kết nối đến API server!"

2. **Success Toast**
   - Background: #10b981 (green)
   - Icon: ✓
   - Examples:
     - "Đã sao chép văn bản!"
     - "Đã tải xuống kết quả!"
     - "OCR thành công!"

3. **Info Toast**
   - Background: #3b82f6 (blue)
   - Icon: ℹ️
   - Examples:
     - "Đang xử lý..."

**Toast Styling:**
```css
.toast {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  padding: 1rem 1.5rem;
  border-radius: 0.5rem;
  color: white;
  font-weight: 500;
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
  transform: translateY(150%);
  transition: transform 0.3s ease;
  z-index: 1000;
}

.toast.show {
  transform: translateY(0);
}
```

#### 7.5.2 Error Scenarios

| Scenario | Toast Message | Duration | Recovery |
|----------|---------------|----------|----------|
| Invalid file type | "Vui lòng chọn file hình ảnh!" | 3s | User selects valid file |
| File too large | "File quá lớn! Vui lòng chọn file nhỏ hơn 10MB." | 3s | User selects smaller file |
| Network error | "Không thể kết nối đến API server!" | 3s | User retries |
| API error 500 | "Lỗi xử lý: [error message]" | 3s | User retries or contacts support |
| Timeout | "Xử lý quá lâu, vui lòng thử lại!" | 3s | User retries |
| Copy failed | "Không thể sao chép văn bản!" | 3s | User tries again |

---

## 8. UI/UX Requirements

### 8.1 Design System

#### 8.1.1 Color Palette

**Primary Colors:**
```css
--primary-color: #4f46e5;      /* Indigo 600 */
--primary-hover: #4338ca;      /* Indigo 700 */
```

**Secondary Colors:**
```css
--secondary-color: #6b7280;    /* Gray 500 */
```

**Status Colors:**
```css
--success-color: #10b981;      /* Green 500 */
--error-color: #ef4444;        /* Red 500 */
--info-color: #3b82f6;         /* Blue 500 */
```

**Neutral Colors:**
```css
--background: #f9fafb;         /* Gray 50 */
--surface: #ffffff;            /* White */
--text-primary: #111827;       /* Gray 900 */
--text-secondary: #6b7280;     /* Gray 500 */
--border-color: #e5e7eb;       /* Gray 200 */
```

#### 8.1.2 Typography

**Font Family:**
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
             'Helvetica Neue', Arial, sans-serif;
```

**Font Sizes:**
- Heading 1 (h1): 2.5rem (40px)
- Heading 2 (h2): 1.5rem (24px)
- Heading 3 (h3): 1.1rem (18px)
- Body: 1rem (16px)
- Small: 0.875rem (14px)

**Font Weights:**
- Regular: 400
- Medium: 500
- Semibold: 600
- Bold: 700

#### 8.1.3 Spacing System

**Scale:** Based on 0.25rem (4px) increments
- xs: 0.25rem (4px)
- sm: 0.5rem (8px)
- md: 1rem (16px)
- lg: 1.5rem (24px)
- xl: 2rem (32px)
- 2xl: 3rem (48px)

#### 8.1.4 Border Radius

- Small: 0.25rem (4px)
- Medium: 0.5rem (8px)
- Large: 0.75rem (12px)
- XL: 1rem (16px)

#### 8.1.5 Shadows

```css
--shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
```

### 8.2 Responsive Design

#### 8.2.1 Breakpoints

```css
/* Mobile First Approach */
/* Base: Mobile (< 768px) */

/* Tablet */
@media (min-width: 768px) { }

/* Desktop */
@media (min-width: 1024px) { }

/* Large Desktop */
@media (min-width: 1280px) { }
```

#### 8.2.2 Mobile Adaptations

**Container (< 768px):**
- Padding: 1rem (reduced from 2rem)
- Max-width: 100%

**Header:**
- Title: 2rem (reduced from 2.5rem)
- Subtitle: 1rem (reduced from 1.1rem)

**Upload Area:**
- Padding: 2rem 1rem (reduced from 3rem 2rem)
- Icon: 3rem (reduced from 4rem)

**Device Selector:**
- Flex-direction: column
- Align-items: flex-start
- Gap: 1rem

**Buttons:**
- Width: 100%
- Flex-direction: column

**Image Preview:**
- Max-width: 100vw - 2rem
- Responsive scaling

### 8.3 Accessibility (A11Y)

#### 8.3.1 WCAG 2.1 AA Compliance

**Color Contrast:**
- Text/Background: Minimum 4.5:1 ratio
- Large text: Minimum 3:1 ratio
- Interactive elements: Clear focus states

**Keyboard Navigation:**
- Tab order: Logical flow
- Focus indicators: Visible outline
- Keyboard shortcuts: All actions accessible

**Screen Reader Support:**
- Alt text for images
- ARIA labels for icons
- ARIA live regions for dynamic content
- Semantic HTML

#### 8.3.2 ARIA Attributes

**Upload Area:**
```html
<div
  id="uploadArea"
  role="button"
  tabindex="0"
  aria-label="Upload image file"
>
```

**File Input:**
```html
<input
  type="file"
  id="fileInput"
  aria-label="Select image file"
  accept="image/*"
>
```

**Process Button:**
```html
<button
  id="processBtn"
  aria-label="Process OCR"
  aria-busy="false"
>
```

**Results Section:**
```html
<section
  id="resultsSection"
  role="region"
  aria-label="OCR Results"
  aria-live="polite"
>
```

#### 8.3.3 Focus Management

**Focus States:**
```css
button:focus,
input:focus {
  outline: 2px solid var(--primary-color);
  outline-offset: 2px;
}
```

**Focus Order:**
1. Upload area / File input
2. Device selection (CPU)
3. Device selection (GPU)
4. Device selection (MPS)
5. Process button
6. Clear button
7. Copy button (when visible)
8. Download button (when visible)

### 8.4 Animations & Transitions

#### 8.4.1 Micro-interactions

**Button Hover:**
```css
.btn:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-lg);
  transition: all 0.2s ease;
}
```

**Upload Area Hover:**
```css
.upload-area:hover {
  border-color: var(--primary-color);
  background: rgba(79, 70, 229, 0.05);
  transition: all 0.3s ease;
}
```

**Toast Slide In:**
```css
.toast {
  transform: translateY(150%);
  transition: transform 0.3s ease;
}

.toast.show {
  transform: translateY(0);
}
```

#### 8.4.2 Loading States

**Spinner Animation:**
```css
@keyframes spin {
  to { transform: rotate(360deg); }
}

.loader {
  animation: spin 0.8s linear infinite;
}
```

**Pulse Animation (Alternative):**
```css
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
```

#### 8.4.3 Smooth Scrolling

**Auto-scroll to Results:**
```javascript
resultsSection.scrollIntoView({
  behavior: 'smooth',
  block: 'nearest'
});
```

### 8.5 Performance Requirements

**Loading Time:**
- Initial page load: < 2 seconds
- Image preview: < 500ms
- OCR processing: 3-10 seconds (CPU), 0.5-2 seconds (GPU)

**Image Optimization:**
- Preview: Max 800px width
- Compress large images before display
- Lazy load non-critical content

**JavaScript Bundle:**
- Size: < 50KB (minified)
- No heavy frameworks (vanilla JS)

---

## 9. Technical Requirements

### 9.1 Browser Support

**Minimum Supported Browsers:**
- Chrome/Edge: Version 90+
- Firefox: Version 88+
- Safari: Version 14+
- Mobile Safari: iOS 14+
- Chrome Mobile: Android 90+

**Required APIs:**
- File API
- Canvas API
- Fetch API
- Clipboard API
- FormData API

### 9.2 File Upload Specifications

**Supported Formats:**
- JPEG (.jpg, .jpeg)
- PNG (.png)
- GIF (.gif)
- BMP (.bmp)

**File Size Limits:**
- Maximum: 10MB per file
- Recommended: < 5MB for best performance

**Validation:**
- Client-side: File type and size
- Server-side: Additional validation

### 9.3 API Integration

**Endpoint:** `POST /api/ocr`

**Request:**
```javascript
const formData = new FormData();
formData.append('image', file);
formData.append('device', 'cpu'); // or 'cuda', 'mps'

fetch('/api/ocr', {
  method: 'POST',
  body: formData
})
```

**Response Format:**
```json
{
  "success": true,
  "boxes": [[[x1, y1], [x2, y2]], ...],
  "texts": ["text1", "text2", ...],
  "count": 10,
  "filename": "abc.jpg",
  "originalname": "document.jpg",
  "uploadPath": "/uploads/abc.jpg",
  "processingTime": 3542
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Error message",
  "boxes": [],
  "texts": [],
  "count": 0
}
```

### 9.4 State Management

**Application State:**
```javascript
{
  currentImage: File | null,
  currentResult: OCRResult | null,
  isProcessing: boolean,
  selectedDevice: 'cpu' | 'cuda' | 'mps'
}
```

**Storage:**
- Session Storage: Device preference
- Local Storage: None (privacy)
- Cookies: None

---

## 10. Non-Functional Requirements

### 10.1 Performance

**NFR-001:** Page load time < 2 seconds on 3G connection
**NFR-002:** OCR processing completes within 10 seconds (CPU)
**NFR-003:** Image preview renders within 500ms
**NFR-004:** UI remains responsive during processing
**NFR-005:** Smooth animations at 60 FPS

### 10.2 Usability

**NFR-006:** 90% of users complete OCR without help
**NFR-007:** Error messages are clear and actionable
**NFR-008:** Interface text in Vietnamese
**NFR-009:** Intuitive drag-and-drop operation
**NFR-010:** Mobile-friendly responsive design

### 10.3 Accessibility

**NFR-011:** WCAG 2.1 AA compliance
**NFR-012:** Keyboard navigation for all functions
**NFR-013:** Screen reader compatible
**NFR-014:** Color contrast ratio ≥ 4.5:1
**NFR-015:** Focus indicators visible

### 10.4 Compatibility

**NFR-016:** Works on 95% of modern browsers
**NFR-017:** No JavaScript errors in supported browsers
**NFR-018:** Graceful degradation for older browsers
**NFR-019:** Mobile Safari iOS 14+ support
**NFR-020:** Chrome Android support

### 10.5 Security

**NFR-021:** Client-side file validation
**NFR-022:** No sensitive data in localStorage
**NFR-023:** HTTPS required for production
**NFR-024:** CSP headers configured
**NFR-025:** XSS protection enabled

### 10.6 Reliability

**NFR-026:** 99% uptime (API server)
**NFR-027:** Error recovery without page refresh
**NFR-028:** Timeout handling for slow networks
**NFR-029:** Graceful degradation on API failure
**NFR-030:** Clear offline/online indicators

---

## 11. Acceptance Criteria

### 11.1 Upload Functionality

**AC-001:** User can click upload area to select file
**AC-002:** User can drag and drop image file
**AC-003:** Only image files are accepted
**AC-004:** Files > 10MB are rejected with error
**AC-005:** Invalid file types show error toast
**AC-006:** Upload area highlights on drag over
**AC-007:** Image preview displays after upload

### 11.2 OCR Processing

**AC-008:** Process button triggers OCR
**AC-009:** Loading spinner shows during processing
**AC-010:** Device selection is sent to API
**AC-011:** Results display after successful OCR
**AC-012:** Errors show toast notification
**AC-013:** Timeout after 60 seconds
**AC-014:** Can re-process same image

### 11.3 Results Display

**AC-015:** Bounding boxes overlay image
**AC-016:** Text lines numbered sequentially
**AC-017:** Statistics show correct counts
**AC-018:** Empty results handled gracefully
**AC-019:** Auto-scroll to results section
**AC-020:** Canvas scales with image

### 11.4 Export Functions

**AC-021:** Copy button copies all text
**AC-022:** Download creates valid JSON file
**AC-023:** Filename includes timestamp
**AC-024:** Success toast shows after copy
**AC-025:** Success toast shows after download
**AC-026:** Copy fails show error toast

### 11.5 Clear/Reset

**AC-027:** Clear button resets all state
**AC-028:** Preview section hidden after clear
**AC-029:** Results section hidden after clear
**AC-030:** Can upload new image after clear
**AC-031:** File input reset after clear

### 11.6 Responsive Design

**AC-032:** Layout adapts to mobile screens
**AC-033:** Touch targets ≥ 44px on mobile
**AC-034:** No horizontal scroll on mobile
**AC-035:** Images scale correctly on mobile
**AC-036:** Buttons stack vertically on mobile

### 11.7 Accessibility

**AC-037:** All interactive elements keyboard accessible
**AC-038:** Focus indicators visible
**AC-039:** ARIA labels present
**AC-040:** Screen reader announces states
**AC-041:** Color contrast meets WCAG AA

---

## 12. Future Enhancements

### 12.1 Phase 2 Features

**FE-001: Batch Upload**
- Multiple image upload
- Queue management
- Progress indicator for each file
- Bulk export options

**FE-002: Image Editing**
- Crop before OCR
- Rotate image
- Brightness/contrast adjustment
- Manual box drawing

**FE-003: Export Formats**
- Export as TXT file
- Export as DOCX
- Export as PDF
- Copy formatted text (markdown)

**FE-004: History**
- View previous OCR results
- Re-download past results
- Search history
- Delete history

### 12.2 Phase 3 Features

**FE-005: Advanced OCR**
- Table detection
- Multi-column layout
- Handwriting recognition
- Formula recognition

**FE-006: Language Support**
- English OCR
- Mixed language detection
- Language auto-detection

**FE-007: Collaboration**
- Share results via link
- Comments on results
- Team workspaces
- Result annotations

**FE-008: Integration**
- Google Drive upload
- Dropbox integration
- API key management
- Webhook configuration

### 12.3 UI Enhancements

**FE-009: Dark Mode**
- Toggle dark/light theme
- System preference detection
- Persistent theme selection

**FE-010: Customization**
- Adjustable text size
- Color scheme options
- Layout preferences

**FE-011: Tooltips**
- Contextual help
- Feature tours
- Keyboard shortcuts guide

---

## Appendices

### Appendix A: Glossary

**OCR:** Optical Character Recognition - Technology for converting images of text into machine-readable text

**Bounding Box:** Rectangle drawn around detected text regions in an image

**Canvas:** HTML5 element for drawing graphics

**Toast:** Brief notification message that appears temporarily

**API:** Application Programming Interface

**Device:** Processing hardware (CPU, GPU, or MPS)

**MPS:** Metal Performance Shaders (Apple Silicon GPU acceleration)

**CUDA:** NVIDIA's parallel computing platform for GPU acceleration

### Appendix B: Wireframe References

*Note: Wireframes are represented in ASCII art format in the Screen Specifications section (Section 7)*

### Appendix C: API Contract

See Section 9.3 for complete API integration specifications.

### Appendix D: Change Log

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0.0 | 2024-11-14 | Initial version | Product Team |
| 2.0.0 | 2024-11-15 | Added TypeScript support, updated screens | Product Team |

---

**Document End**

**Prepared by:** Product Team
**Approved by:** [Pending]
**Last Updated:** November 15, 2024
**Next Review:** February 15, 2025
