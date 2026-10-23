# Focused Test Plan

## Testing philosophy
The deadline is short. Test critical paths only. Do not spend time on exhaustive coverage, benchmarks, large dataset evaluation, or tests unrelated to the demo.

## Required focused checks
1. App imports and starts.
2. `GET /api/v1/health/live` returns 200.
3. `GET /api/v1/model/status` reports actual loaded status and class names.
4. Valid image smoke test returns at least a structurally valid response; actual detections may be zero.
5. Invalid/corrupt image returns documented 4xx response.
6. Oversized image is rejected.
7. Composition math is correct for a simple known bounding box.
8. DB repository creates an analysis and detections and can retrieve them.
9. CSV export returns a valid header and rows.
10. Frontend-origin CORS works for configured origins.

## Test strategy
- Unit-test pure composition and recovery mapping without loading YOLO.
- Use a small fixture image.
- Real model smoke test can be marked opt-in if weights are large or unavailable in CI.
- Use a test database or isolated Neon branch for integration tests; never run destructive tests against production data.
- If database credentials are unavailable, report DB integration test as blocked rather than pretending it passed.

## Acceptance threshold
The MVP is acceptable when all critical paths above are implemented and the locally available checks pass. Report exactly which tests were run and skipped.
