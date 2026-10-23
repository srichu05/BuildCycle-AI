# Security and Input Validation

## MVP security baseline
- Accept only JPEG/JPG and PNG.
- Enforce `MAX_UPLOAD_MB` (default 10 MB) while reading; do not trust `Content-Length` alone.
- Verify actual image decoding with Pillow/OpenCV; reject corrupt files.
- Limit image dimensions/pixel count to reduce decompression-bomb risk.
- Never use uploaded filename as a filesystem path. Sanitize to basename and store metadata only.
- Process images in memory; do not write user uploads to persistent paths by default.
- Do not log raw image bytes, base64 payloads, database URLs, or API keys.
- Return generic internal error messages; log sanitized exception details server-side.
- Configure CORS to the local Vite origin and exact production Vercel origin. Do not use wildcard origins with credentials.
- Keep `DATABASE_URL` and `GEMINI_API_KEY` on the backend only.
- Set `GEMINI_ENABLED=false` by default.
- Validate path IDs as UUIDs and validate pagination bounds.
- Use SQLAlchemy parameterized queries/ORM; never concatenate user input into SQL.
- CSV export should mitigate spreadsheet formula injection for untrusted text fields.

## Out of scope for unauthenticated hackathon MVP
No user accounts, admin controls, public image gallery, arbitrary URL fetching, or remote model loading from user-provided URLs. Since endpoints are public in deployment, keep strict upload size limits and avoid unnecessary expensive inference routes.

## Error responses
Do not return tracebacks, local file paths, environment values, or secrets.
