# Architecture Decision Records (MVP)

## D-001: Separate frontend and backend
Decision: React + TypeScript + Vite frontend is developed separately from the FastAPI backend.
Reason: independent workstreams and explicit API contract.

## D-002: Backend framework
Decision: FastAPI.
Reason: Python AI ecosystem, Pydantic schemas, built-in OpenAPI docs.

## D-003: Database
Decision: Neon PostgreSQL; SQLAlchemy 2.x and Alembic.
Clarification: Neon is a hosted PostgreSQL service, not a local `neon.db` file.

## D-004: Inference mode
Decision: synchronous upload → inference → result response for MVP.
Reason: fewer moving parts and fastest implementation. If Render timeouts prove problematic, asynchronous jobs are a later enhancement.

## D-005: Image persistence
Decision: no image persistence in MVP. Images processed in memory; annotated image returned in response. Store analysis metadata and detections only.
Reason: avoids object storage setup and Render ephemeral filesystem risks.

## D-006: Model strategy
Decision: use a verified construction-waste model and configurable model path. CODD is a dataset, not automatically a trained model.
Reason: avoid assuming class mappings/weights. Start with existing compatible weights and add fine-tuning later.

## D-007: Composition
Decision: calculate bounding-box coverage only for detection model.
Reason: true visible material area requires segmentation masks. Bounding boxes overlap and may include background.

## D-008: Recommendations
Decision: deterministic rule-based recommendations first; optional Gemini explanations later.
Reason: reliable, low-cost, no API key dependency.

## D-009: Authentication
Decision: no login in MVP.
Reason: reduce implementation time. Public deployed endpoints still require strict upload limits and basic abuse protection.

## D-010: Scope discipline
Decision: prioritize end-to-end demo over polish. No queues, auth, PDF reports, complex abstractions, CI/CD, training pipeline, or exhaustive tests unless requested.
