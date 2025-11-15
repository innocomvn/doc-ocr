# Contributing to Vietnamese OCR API

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to this project.

## 🌟 Ways to Contribute

- 🐛 Report bugs
- 💡 Suggest new features
- 📝 Improve documentation
- 🔧 Submit bug fixes
- ✨ Add new features
- 🧪 Write tests
- 🎨 Improve UI/UX

## 🚀 Getting Started

### 1. Fork and Clone

```bash
# Fork the repository on GitHub
# Then clone your fork
git clone https://github.com/YOUR_USERNAME/doc-ocr.git
cd doc-ocr
```

### 2. Set Up Development Environment

```bash
# Install dependencies
npm install
pip install -r requirement.txt

# Copy environment config
cp .env.example .env

# Run development server
npm run dev
```

### 3. Create a Branch

```bash
# Create a new branch for your feature/fix
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

## 📋 Development Guidelines

### Code Style

#### TypeScript/JavaScript
- Use TypeScript for new code
- Follow existing code style
- Use meaningful variable names
- Add JSDoc comments for functions
- Use async/await over callbacks

```typescript
/**
 * Process an image for OCR
 * @param imagePath Path to the image file
 * @param options Processing options
 * @returns OCR result with texts and bounding boxes
 */
async function processImage(
  imagePath: string,
  options?: ProcessingOptions
): Promise<OCRResult> {
  // Implementation
}
```

#### Python
- Follow PEP 8 style guide
- Use type hints where possible
- Add docstrings for functions
- Keep functions focused and small

```python
def predict(recognitor, detector, img_path: str, padding: int = 4) -> tuple:
    """
    Perform OCR on an image.

    Args:
        recognitor: VietOCR predictor
        detector: PaddleOCR detector
        img_path: Path to input image
        padding: Padding around detected boxes

    Returns:
        Tuple of (boxes, texts)
    """
    # Implementation
```

### Commit Messages

Follow conventional commits format:

```
type(scope): subject

body (optional)

footer (optional)
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

**Examples:**
```bash
feat(api): add batch processing endpoint
fix(ocr): handle empty image error
docs(readme): update installation instructions
refactor(services): extract image preprocessing logic
```

### Testing

Before submitting a PR:

```bash
# Test API endpoints
./examples/api-examples.sh

# Test with sample images
python examples/api-examples.py

# Build TypeScript
npm run build

# Check for TypeScript errors
npx tsc --noEmit

# Test Docker build
docker build -t test-build .
```

## 🔍 Pull Request Process

### 1. Before Submitting

- [ ] Code follows project style guidelines
- [ ] Tests pass (if applicable)
- [ ] Documentation updated (if needed)
- [ ] Commit messages are clear and descriptive
- [ ] Branch is up to date with main

### 2. Submit PR

```bash
# Push your changes
git push origin feature/your-feature-name

# Create pull request on GitHub
```

### 3. PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
How to test these changes

## Screenshots (if applicable)
Add screenshots here

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No new warnings
```

### 4. Review Process

- Maintainers will review your PR
- Address any requested changes
- Once approved, PR will be merged

## 🐛 Reporting Bugs

### Before Reporting

1. Check existing issues
2. Try latest version
3. Verify it's reproducible

### Bug Report Template

```markdown
**Describe the bug**
Clear description of what the bug is

**To Reproduce**
Steps to reproduce:
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What you expected to happen

**Screenshots**
If applicable, add screenshots

**Environment:**
- OS: [e.g. Ubuntu 22.04]
- Node.js version: [e.g. 18.0.0]
- Python version: [e.g. 3.9.0]
- Browser: [e.g. Chrome 120]

**Additional context**
Any other information
```

## 💡 Suggesting Features

### Feature Request Template

```markdown
**Is your feature related to a problem?**
Clear description of the problem

**Describe the solution you'd like**
Clear description of what you want

**Describe alternatives you've considered**
Other solutions you've thought about

**Additional context**
Any other information
```

## 📝 Documentation

### Updating Documentation

- Keep README.md concise
- Add detailed guides to docs/
- Update CHANGELOG.md for changes
- Include code examples
- Add screenshots for UI changes

### Documentation Structure

```
docs/
├── DOCKER.md         # Docker deployment
├── ONNX_MODELS.md    # ONNX setup
└── API.md            # API reference (if needed)
```

## 🧪 Adding Tests

We welcome test contributions!

### Test Structure

```
tests/
├── unit/             # Unit tests
├── integration/      # Integration tests
└── e2e/              # End-to-end tests
```

### Running Tests

```bash
# Unit tests (when implemented)
npm test

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e
```

## 🏗️ Project Structure

```
doc-ocr/
├── src/              # TypeScript source
│   ├── server.ts    # Main server
│   ├── services/    # OCR services
│   ├── types/       # Type definitions
│   └── utils/       # Utilities
├── public/           # Frontend
├── docs/             # Documentation
├── examples/         # Examples
├── scripts/          # Utility scripts
└── tests/            # Tests (to be added)
```

## 🎯 Priority Areas

We especially welcome contributions in:

1. **Testing**
   - Unit tests for services
   - Integration tests for API
   - E2E tests for UI

2. **ONNX Implementation**
   - Complete post-processing
   - CTC decoder
   - Vietnamese character dictionary

3. **Performance**
   - Model optimization
   - Caching strategies
   - Request batching

4. **Documentation**
   - More examples
   - Video tutorials
   - API reference

5. **Features**
   - Batch processing
   - PDF support
   - Multiple languages

## 💬 Getting Help

- 📧 Email: [your-email]
- 💬 Discord: [discord-link]
- 📖 Documentation: [docs-link]
- 🐛 Issues: [github-issues]

## 📜 Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inspiring community for all.

### Our Standards

**Positive behavior:**
- Using welcoming and inclusive language
- Being respectful of differing viewpoints
- Gracefully accepting constructive criticism
- Focusing on what is best for the community

**Unacceptable behavior:**
- Trolling, insulting/derogatory comments
- Public or private harassment
- Publishing others' private information
- Other unethical or unprofessional conduct

### Enforcement

Instances of abusive, harassing, or otherwise unacceptable behavior may be reported to the project maintainers.

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

## 🙏 Thank You!

Your contributions make this project better for everyone. We appreciate your time and effort!

**Questions?** Feel free to ask in issues or discussions.

Happy coding! 🚀
