// API Configuration
const API_BASE_URL = window.location.origin;

// State
let currentImage = null;
let currentResult = null;

// DOM Elements
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const previewSection = document.getElementById('previewSection');
const previewImage = document.getElementById('previewImage');
const overlayCanvas = document.getElementById('overlayCanvas');
const processBtn = document.getElementById('processBtn');
const processText = document.getElementById('processText');
const processLoader = document.getElementById('processLoader');
const clearBtn = document.getElementById('clearBtn');
const resultsSection = document.getElementById('resultsSection');
const textCount = document.getElementById('textCount');
const statusText = document.getElementById('statusText');
const recognizedText = document.getElementById('recognizedText');
const copyBtn = document.getElementById('copyBtn');
const downloadBtn = document.getElementById('downloadBtn');
const toast = document.getElementById('toast');

// Event Listeners
uploadArea.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', handleFileSelect);
uploadArea.addEventListener('dragover', handleDragOver);
uploadArea.addEventListener('dragleave', handleDragLeave);
uploadArea.addEventListener('drop', handleDrop);
processBtn.addEventListener('click', processImage);
clearBtn.addEventListener('click', clearAll);
copyBtn.addEventListener('click', copyText);
downloadBtn.addEventListener('click', downloadJSON);

// File Handling
function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
        loadImage(file);
    }
}

function handleDragOver(event) {
    event.preventDefault();
    uploadArea.classList.add('dragover');
}

function handleDragLeave() {
    uploadArea.classList.remove('dragover');
}

function handleDrop(event) {
    event.preventDefault();
    uploadArea.classList.remove('dragover');

    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
        loadImage(file);
    } else {
        showToast('Vui lòng chọn file hình ảnh!', 'error');
    }
}

function loadImage(file) {
    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
        showToast('File quá lớn! Vui lòng chọn file nhỏ hơn 10MB.', 'error');
        return;
    }

    currentImage = file;

    const reader = new FileReader();
    reader.onload = (e) => {
        previewImage.src = e.target.result;
        previewImage.onload = () => {
            previewSection.style.display = 'block';
            resultsSection.style.display = 'none';

            // Setup canvas
            overlayCanvas.width = previewImage.width;
            overlayCanvas.height = previewImage.height;
        };
    };
    reader.readAsDataURL(file);
}

// OCR Processing
async function processImage() {
    if (!currentImage) {
        showToast('Vui lòng chọn hình ảnh!', 'error');
        return;
    }

    // Get selected device
    const device = document.querySelector('input[name="device"]:checked').value;

    // Show loading state
    processBtn.disabled = true;
    processText.style.display = 'none';
    processLoader.style.display = 'inline-block';

    try {
        // Prepare form data
        const formData = new FormData();
        formData.append('image', currentImage);
        formData.append('device', device);

        // Send request
        const response = await fetch(`${API_BASE_URL}/api/ocr`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.success) {
            currentResult = result;
            displayResults(result);
            showToast('OCR thành công!', 'success');
        } else {
            throw new Error(result.error || 'OCR failed');
        }

    } catch (error) {
        console.error('OCR Error:', error);
        showToast(`Lỗi xử lý: ${error.message}`, 'error');
    } finally {
        // Reset loading state
        processBtn.disabled = false;
        processText.style.display = 'inline';
        processLoader.style.display = 'none';
    }
}

// Display Results
function displayResults(result) {
    resultsSection.style.display = 'block';

    // Update stats
    textCount.textContent = result.count || 0;
    statusText.textContent = result.success ? 'Thành công' : 'Thất bại';
    statusText.className = result.success ? 'stat-value success' : 'stat-value error';

    // Display recognized text
    if (result.texts && result.texts.length > 0) {
        recognizedText.innerHTML = '';
        result.texts.forEach((text, index) => {
            const lineDiv = document.createElement('div');
            lineDiv.className = 'text-line';
            lineDiv.textContent = `${index + 1}. ${text}`;
            recognizedText.appendChild(lineDiv);
        });
    } else {
        recognizedText.innerHTML = '<p style="color: var(--text-secondary);">Không tìm thấy văn bản nào.</p>';
    }

    // Draw bounding boxes on canvas
    if (result.boxes && result.boxes.length > 0) {
        drawBoundingBoxes(result.boxes);
    }

    // Scroll to results
    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function drawBoundingBoxes(boxes) {
    const canvas = overlayCanvas;
    const ctx = canvas.getContext('2d');
    const img = previewImage;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Calculate scale factor
    const scaleX = canvas.width / img.naturalWidth;
    const scaleY = canvas.height / img.naturalHeight;

    // Draw boxes
    ctx.strokeStyle = '#4f46e5';
    ctx.lineWidth = 2;
    ctx.font = '14px Arial';
    ctx.fillStyle = '#4f46e5';

    boxes.forEach((box, index) => {
        const x1 = box[0][0] * scaleX;
        const y1 = box[0][1] * scaleY;
        const x2 = box[1][0] * scaleX;
        const y2 = box[1][1] * scaleY;

        // Draw rectangle
        ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);

        // Draw label
        ctx.fillText(`${index + 1}`, x1 + 5, y1 + 15);
    });
}

// Copy Text
function copyText() {
    if (!currentResult || !currentResult.texts) {
        showToast('Không có văn bản để sao chép!', 'error');
        return;
    }

    const text = currentResult.texts.join('\n');

    navigator.clipboard.writeText(text).then(() => {
        showToast('Đã sao chép văn bản!', 'success');
    }).catch(err => {
        console.error('Copy failed:', err);
        showToast('Không thể sao chép văn bản!', 'error');
    });
}

// Download JSON
function downloadJSON() {
    if (!currentResult) {
        showToast('Không có kết quả để tải xuống!', 'error');
        return;
    }

    const dataStr = JSON.stringify(currentResult, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `ocr_result_${Date.now()}.json`;
    link.click();

    URL.revokeObjectURL(url);
    showToast('Đã tải xuống kết quả!', 'success');
}

// Clear All
function clearAll() {
    currentImage = null;
    currentResult = null;
    fileInput.value = '';
    previewSection.style.display = 'none';
    resultsSection.style.display = 'none';

    // Clear canvas
    const ctx = overlayCanvas.getContext('2d');
    ctx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
}

// Toast Notification
function showToast(message, type = 'info') {
    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Check API Health on Load
window.addEventListener('load', async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/health`);
        const data = await response.json();
        console.log('API Status:', data);
    } catch (error) {
        console.error('API connection failed:', error);
        showToast('Không thể kết nối đến API server!', 'error');
    }
});
