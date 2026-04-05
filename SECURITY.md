# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in ExamPixl, please email security concerns to sameershukla590@gmail.com instead of using the issue tracker.

Please provide:
1. Description of the vulnerability
2. Steps to reproduce the issue
3. Potential impact
4. Suggested fix (if available)

## Security Best Practices

Since ExamPixl is a browser-based application that processes files locally:

### What We Do
- ✅ All file processing happens in your browser - no server uploads
- ✅ No personal data is collected or stored
- ✅ Code is open-source and auditable
- ✅ Dependencies are kept up-to-date
- ✅ Regular security audits of the codebase

### What You Should Do
- ✅ Keep your browser updated
- ✅ Don't share sensitive documents with untrusted tools
- ✅ Check browser console for any errors
- ✅ Clear browser cache after processing sensitive files
- ✅ Verify SSL certificate when using our hosted version

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | ✅ Yes             |
| < 1.0   | ❌ No              |

## Known Security Considerations

1. **Browser Memory**: Large files loaded into browser memory for processing
2. **Service Worker**: Caches assets on client - clear if privacy is critical
3. **Local Storage**: Recently used tools are stored locally (no sensitive data)
4. **Third-party Libraries**: We use audited packages - see package.json

## Disclosure Timeline

When we receive a vulnerability report:
1. We acknowledge receipt within 24 hours
2. We assess the vulnerability within 48 hours
3. We create a fix and release a patch
4. We credit the reporter (if desired)
5. We publish a security advisory

## Security Updates

Subscribe to GitHub releases for security patches: https://github.com/sam7041/exampixl/releases
