# Implementation Plan — Two Phases

## Overall execution rule
Implement the shortest path to a working demo. Work in the existing backend directory if one exists. Inspect only the files needed to understand the current state, then implement. Do not create multiple competing architectures or spend time on nonessential tests. Keep code straightforward and readable.

## Phase 1 — Build the end-to-end backend MVP
### Goal
A user can upload a construction waste image and receive actual model detections, annotated image, material counts, coverage estimates, recommendations, and a saved analysis record.

### Tasks (execute in this order)
1. Scaffold the FastAPI app and configuration.
2. Add model-loading/inference service behind one clear interface.
3. Add upload validation for JPG/JPEG/PNG and a reasonable maximum size (default 10 MB).
4. Implement `POST /api/v1/analyses` with synchronous inference.
5. Return original image dimensions, model metadata, detections, counts, bounding-box coverage, recommendations, annotated image as base64 data URL or base64 string, and inference duration.
6. Add Neon SQLAlchemy models and create migration(s) with Alembic.
7. Persist analysis metadata and each detection. If DB configuration is absent locally, fail clearly at startup or return a clear configuration error; do not silently switch production to SQLite.
8. Implement list/get analysis endpoints and CSV export.
9. Add health and model-status endpoints.
10. Provide `requirements.txt`, `.env.example`, README setup instructions.

### Phase 1 acceptance criteria
- `uvicorn app.main:app --reload` starts locally when configuration/dependencies are present.
- `/api/v1/health/live` responds successfully.
- `/api/v1/model/status` reports the configured model and class names.
- A valid image gets real inference, an annotated result and a structured response.
- A valid analysis and its detections persist to Neon.
- A stored analysis can be retrieved and exported to CSV.
- No model output is hardcoded or fabricated.

### Phase 1 non-goals
- Authentication/user accounts
- Async task queues or job polling
- Admin panel
- Persistent image storage
- Fine-tuning/training during app startup
- Complex service abstractions
- Gemini integration unless core MVP is complete
- PDF reports
- Multi-tenant access controls

## Phase 2 — Make the MVP demo/deployment-ready
### Tasks
1. Add consistent error responses and safe validation for invalid/corrupt/oversized uploads.
2. Add focused tests only: health, one valid inference smoke test (can be opt-in if model is large), invalid upload, composition calculation, database persistence/retrieval, CSV export.
3. Configure CORS for local Vite and deployed Vercel origin.
4. Configure Render start command and health-check path.
5. Configure Neon connection settings and SQLAlchemy pooling suitable for a small service.
6. Ensure model weights are loaded once per process, not per request.
7. Ensure no secrets or image bytes are logged.
8. Test one end-to-end request locally and one deployed request if deployment credentials/access are available.
9. Update README and deployment docs with exact tested commands and known limitations.

### Phase 2 acceptance criteria
- Invalid uploads return documented 4xx errors.
- CORS allows only configured origins.
- Model loads once per worker process.
- Health check succeeds on Render.
- Database schema can be applied with Alembic.
- Critical paths have a small set of passing tests.
- Deployment instructions reflect what was actually tested.

## Agent operating instructions
- Do not ask the user questions unless a missing detail blocks implementation.
- Use the model/dataset files already downloaded when accessible; otherwise implement configurable paths and tell the user exactly where to put the files.
- Do not spend time running the entire dataset through the model or training a model unless explicitly requested.
- Do not add optional AI APIs before the core flow works.
- Prefer direct, simple code over generic frameworks and abstractions.
- Avoid repeated dependency installation, repeated repository scans, cosmetic refactors, and tests unrelated to acceptance criteria.
- At the end of each phase, report files created/changed, exact run commands, tests actually run, and any remaining blockers. Never claim a test passed if it was not run.
