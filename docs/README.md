# BuildCycle AI — Backend Documentation Pack

## Purpose
This pack is the implementation source of truth for the BuildCycle AI backend. Read these documents before coding. The backend is developed separately from the React + TypeScript + Vite frontend.

## Locked stack
- Python 3.11 (use the version supported by the selected model and Render runtime)
- FastAPI + Uvicorn
- SQLAlchemy 2.x + Alembic
- Neon PostgreSQL
- Ultralytics YOLO + OpenCV
- Pydantic settings
- Pytest for focused tests
- Render for backend deployment
- Optional Gemini API integration, disabled by default

## MVP objective
Accept a construction-waste image, run the selected construction-waste model, return detections and an annotated image, calculate detection counts and approximate bounding-box coverage, return rule-based recovery guidance, and persist analysis metadata/detections in Neon.

## Two implementation phases
1. **Phase 1 — Working core:** setup, model integration, image upload, inference, results, recommendations, persistence, CSV export, minimal UI-facing API contract.
2. **Phase 2 — Hackathon hardening/deployment:** validation and error handling, focused tests, Render/Neon configuration, documentation updates, smoke test and frontend integration verification.

## Read first
1. `IMPLEMENTATION_PLAN.md`
2. `API_CONTRACT.md`
3. `MODEL_SPECIFICATION.md`
4. `DATABASE_SCHEMA.md`
5. `ARCHITECTURE.md`
6. `SECURITY.md`
7. `DEPLOYMENT.md`
8. `TEST_PLAN.md`
9. `DECISIONS.md`

## Time-saving instruction for coding agent
Prioritize a working end-to-end MVP. Do not spend time on broad research, elaborate abstractions, unnecessary refactoring, exhaustive tests, benchmarks, authentication, queues, Docker, CI/CD, or extra features unless specifically requested. Run only focused smoke tests that prove critical paths. If a detail is uncertain, inspect the provided dataset/model files and document the assumption; do not block progress on noncritical uncertainty. Never fake model output or claim a feature works without a smoke test.

## Dataset/model note
The user is downloading the second dataset: CODD (Construction and Demolition Waste Object Detection) from Mendeley Data. CODD is a dataset, not automatically a pretrained model. Verify its available files and annotations. The initially proposed five-class pretrained model from Zenodo is a separate candidate. Do not assume CODD labels match that model's classes or that CODD includes pretrained weights. Use whichever model weights are actually available and verified. If only CODD annotations are available, implement the app around a configurable model path and support a temporary compatible pretrained model for MVP; clearly report model classes and limitations.

## Image storage
Do not persist original images in Neon or Render's local filesystem. Process in memory, return the annotated image in the analysis response, and persist metadata and detections only. The frontend should download or display the returned image. Persistent image storage is out of scope for the MVP.

## Database
Use Neon PostgreSQL. `DATABASE_URL` is a PostgreSQL connection string. No local `neon.db` file and no SQLite fallback in production. Local development may use a separate PostgreSQL database if configured, but keep the schema PostgreSQL-compatible.

## Frontend integration
Frontend base URL comes from `VITE_API_BASE_URL`, and requests use `/api/v1/...`. Backend CORS origins are configured via `CORS_ORIGINS`. Never expose Neon or Gemini secrets in frontend environment variables.
