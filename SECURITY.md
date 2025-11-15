# Security Policy

## Supported Versions

We provide security updates for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 2.x.x   | :white_check_mark: |
| 1.x.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take the security of Vietnamese OCR API seriously. If you have discovered a security vulnerability, please report it to us privately.

### How to Report

**DO NOT** create a public GitHub issue for security vulnerabilities.

Instead, please report security vulnerabilities by:

1. **Email**: Send details to [your-security-email@example.com]
2. **Subject**: "SECURITY: Vietnamese OCR API - [Brief Description]"
3. **Include**:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)
   - Your contact information

### What to Expect

- **Initial Response**: Within 48 hours
- **Status Update**: Within 7 days
- **Fix Timeline**: Depends on severity
  - Critical: 1-7 days
  - High: 7-14 days
  - Medium: 14-30 days
  - Low: 30-60 days

### Disclosure Policy

- We will acknowledge receipt of your report
- We will confirm the vulnerability and determine its impact
- We will release a fix as soon as possible
- We will publicly disclose the vulnerability after the fix is released
- We will credit you for the discovery (unless you prefer to remain anonymous)

## Security Best Practices

### For Users

#### 1. Keep Dependencies Updated

```bash
# Check for outdated packages
npm audit

# Update dependencies
npm update

# Update Python packages
pip list --outdated
pip install --upgrade -r requirement.txt
```

#### 2. Use Environment Variables

Never commit sensitive data to git:

```bash
# Use .env file (never commit)
cp .env.example .env

# Add secrets
echo "API_KEY=your_secret_key" >> .env
```

#### 3. Docker Security

```bash
# Run as non-root user
# Use specific image versions
# Scan images for vulnerabilities
docker scan vietnamese-ocr-api:latest
```

#### 4. Network Security

```bash
# Use HTTPS in production
# Enable CORS only for trusted origins
# Implement rate limiting
```

### For Developers

#### 1. Code Review

- All PRs require review
- Security-sensitive changes require 2+ reviews
- Use automated security scanning (GitHub Actions)

#### 2. Dependencies

- Pin dependency versions in package.json
- Run `npm audit` before releases
- Use Dependabot for automated updates
- Review dependencies before adding

#### 3. Input Validation

```typescript
// Validate all user inputs
if (!isValidImageFormat(file.mimetype)) {
  throw new Error('Invalid file type');
}

// Sanitize file paths
const safePath = path.normalize(userInput).replace(/^(\.\.[\/\\])+/, '');
```

#### 4. Authentication (Future)

When adding authentication:
- Use industry-standard libraries
- Implement rate limiting
- Use secure session management
- Hash passwords with bcrypt/argon2

## Known Security Considerations

### Current Implementation

#### 1. File Upload

**Risk**: Malicious file uploads
**Mitigation**:
- File type validation
- Size limits (10MB)
- Sandboxed processing

**Recommendations**:
- Add virus scanning
- Implement file content inspection
- Use separate upload directory with no execution permissions

#### 2. Python Subprocess

**Risk**: Command injection via Python subprocess
**Mitigation**:
- No user input passed to subprocess
- Fixed Python script path
- Input validation before processing

**Recommendations**:
- Use ONNX mode to avoid subprocess
- Add input sanitization
- Implement timeout protection

#### 3. CORS

**Risk**: Unrestricted cross-origin access
**Current**: CORS enabled for all origins
**Mitigation**: Configure allowed origins in production

```typescript
// In production, configure specific origins
app.use(cors({
  origin: ['https://yourdomain.com']
}));
```

#### 4. API Rate Limiting

**Risk**: DoS attacks via excessive requests
**Current**: No rate limiting
**Mitigation**: Implement rate limiting

```typescript
// Example rate limiting
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

## Security Checklist

### Before Deployment

- [ ] Update all dependencies
- [ ] Run security audit (`npm audit`)
- [ ] Enable HTTPS
- [ ] Configure CORS properly
- [ ] Set up rate limiting
- [ ] Review environment variables
- [ ] Enable logging and monitoring
- [ ] Set up backup and recovery
- [ ] Implement access controls
- [ ] Configure firewall rules

### Regular Maintenance

- [ ] Weekly: Check for security updates
- [ ] Monthly: Run vulnerability scans
- [ ] Quarterly: Security audit
- [ ] Yearly: Penetration testing (if applicable)

## Security Features

### Current

✅ Input validation for file uploads
✅ File type restrictions
✅ File size limits
✅ Docker containerization
✅ Automated dependency scanning (CI/CD)
✅ Security scan in GitHub Actions

### Planned

- [ ] Rate limiting middleware
- [ ] Authentication/Authorization
- [ ] API key management
- [ ] Request logging and monitoring
- [ ] Intrusion detection
- [ ] WAF integration

## Compliance

### GDPR Considerations

If processing personal data:
- Implement data retention policies
- Provide data deletion endpoints
- Document data processing
- Obtain user consent

### Data Privacy

**Image Processing**:
- Images are processed locally
- No data sent to external services (except model downloads)
- Uploads are stored temporarily
- Implement automatic cleanup

```bash
# Clean up old uploads (add to cron)
find uploads/ -type f -mtime +7 -delete
```

## Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [Docker Security](https://docs.docker.com/engine/security/)
- [npm Security](https://docs.npmjs.com/about-security-audits)

## Updates

This security policy is reviewed and updated quarterly.

**Last Updated**: 2024-11-15
**Next Review**: 2025-02-15

## Contact

For security-related questions or concerns:
- Security Email: [your-security-email@example.com]
- Project Maintainers: See CONTRIBUTING.md

---

**Thank you for helping keep Vietnamese OCR API and our users safe!** 🔒
