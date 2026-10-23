# Deployment — Vercel + Render + Neon

## Services
- Frontend: Vercel static React/Vite app (separate workstream).
- Backend: Render Python web service.
- Database: Neon PostgreSQL.
- Optional explanations: Gemini API, backend only.

## Render service
- Root directory: `backend` if the repository is a monorepo and Render supports that setting.
- Build command: `pip install -r requirements.txt`
- Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- Health check path: `/api/v1/health/live`
- Python version: select a supported version compatible with the chosen Ultralytics/PyTorch dependencies; pin it in the repository if supported by Render.
- Set all secrets/configuration through Render environment variables.
- Free instances may spin down and have limited RAM/CPU. Test cold start, memory and inference time with the actual weights. Do not promise performance before testing.

## Required environment variables
- `DATABASE_URL`: Neon PostgreSQL connection string.
- `CORS_ORIGINS`: comma-separated allowed origins, e.g. `http://localhost:5173,https://your-app.vercel.app`.
- `MODEL_PATH`: path to weights in runtime or a trusted download destination.
- `MODEL_NAME`
- `MODEL_CONFIDENCE_THRESHOLD`
- `MODEL_IOU_THRESHOLD`
- `MAX_UPLOAD_MB`
- `GEMINI_ENABLED`
- `GEMINI_API_KEY` only if enabled.

## Model weights
Do not commit large weights to Git if avoidable. For the fastest initial deployment, the weights can be included only if repository and platform limits permit. Otherwise download from a trusted, pinned artifact URL during build/startup and verify checksum. Do not accept a model URL from the user. Ensure the license permits the intended deployment.

## Neon
- Use the pooled connection string for normal web traffic when appropriate.
- Keep connection limits low.
- Use a direct connection for Alembic migrations if needed by provider requirements.
- Run `alembic upgrade head` as a release/deploy step or manually before enabling API writes.
- Do not put `DATABASE_URL` in Vercel frontend variables.

## CORS
Set `CORS_ORIGINS` to exact origins, no trailing path. Include local dev origin and deployed Vercel origin. Do not enable all origins in production.

## Smoke test after deployment
1. GET `/api/v1/health/live`
2. GET `/api/v1/health/ready`
3. GET `/api/v1/model/status`
4. POST one valid image to `/api/v1/analyses`
5. GET the returned analysis ID
6. Download its CSV report

## Limitations to disclose
- Render free services can cold-start after inactivity.
- Ephemeral local storage is not persistent.
- Model startup and inference can be slow or exceed free-tier memory for large weights.
- Do not promise production-grade uptime or latency on free-tier infrastructure.
