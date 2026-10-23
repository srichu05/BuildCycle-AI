# Backend Architecture

## Runtime flow
1. React frontend sends `multipart/form-data` to `POST /api/v1/analyses`.
2. FastAPI validates content type, extension, file size, and decodability.
3. Image is decoded in memory and dimensions are read.
4. Inference service uses the configured YOLO weights loaded once per process.
5. Image processor draws boxes/labels using model output.
6. Composition service calculates counts and bounding-box coverage.
7. Recovery service maps recognized classes to static, reviewed recommendations.
8. Repository persists analysis metadata and detection rows in Neon.
9. API returns structured JSON and annotated image data.
10. Frontend renders results; CSV endpoint exports saved data.

## Module responsibilities
- `app/main.py`: FastAPI app, middleware, router registration, startup/lifespan.
- `app/core/config.py`: environment settings and validation.
- `app/api/v1/health.py`: liveness/readiness.
- `app/api/v1/model.py`: model status.
- `app/api/v1/analyses.py`: upload, list and retrieve analyses.
- `app/api/v1/reports.py`: CSV export.
- `app/schemas/`: Pydantic request/response schemas.
- `app/services/detector.py`: load model once, run inference, normalize output.
- `app/services/image_processor.py`: decode image, annotate, encode response image.
- `app/services/composition.py`: count classes and compute bbox coverage.
- `app/services/recovery.py`: deterministic material guidance.
- `app/db/session.py`: SQLAlchemy engine/session.
- `app/db/models.py`: ORM tables.
- `app/db/repositories.py`: simple persistence queries.

## Design rules
- Keep synchronous inference for MVP; return result in the upload request.
- Do not load weights per request.
- Do not persist raw images or annotated images in the database.
- Use a single source of truth for class mapping from the loaded model's metadata.
- Keep model inference behind a small service interface so weights can be changed without rewriting routes.
- Use PostgreSQL-compatible SQLAlchemy models and Alembic migrations.
- Avoid overengineering: no queue, microservices, repository framework, dependency injection container, or caching layer for MVP.
- Use `Annotated`/Pydantic types where useful, but prioritize clarity.
- If inference runs synchronously and blocks the event loop, execute it in a threadpool or a normal synchronous route; do not pretend `async def` makes CPU-bound inference asynchronous.

## Deployment topology
- Frontend: Vercel static Vite build.
- Backend: Render Python web service.
- Database: Neon PostgreSQL.
- Optional later: object storage for persistent images; Gemini for language explanations.
