# Security Checklist

Before deployment, verify:
- [ ] `.env` and secret files are ignored by Git.
- [ ] Neon URL is backend-only.
- [ ] Gemini key is backend-only and integration is disabled by default.
- [ ] Upload format, decode validity, size and pixel count are checked.
- [ ] Filenames are sanitized and never used as paths.
- [ ] CORS uses explicit allowed origins.
- [ ] Errors do not expose tracebacks, credentials or local paths.
- [ ] No raw image/base64 or secrets in logs.
- [ ] Model path is server-controlled, not user-controlled.
- [ ] CSV output mitigates formula injection.
- [ ] No destructive DB tests run against production.
