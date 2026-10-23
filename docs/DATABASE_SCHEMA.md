# Database Schema — Neon PostgreSQL

## Technology
Neon PostgreSQL + SQLAlchemy 2.x + Alembic. `DATABASE_URL` is required for persistence. Do not use a file called `neon.db`; Neon is a hosted PostgreSQL service.

## Table: `analyses`
- `id`: UUID primary key
- `created_at`: timezone-aware timestamp, server default now
- `original_filename`: varchar(255), sanitized basename only
- `image_sha256`: nullable varchar(64); optional fingerprint, not a storage mechanism
- `image_width`: integer, positive
- `image_height`: integer, positive
- `model_name`: varchar(100)
- `model_version`: nullable varchar(100)
- `model_task`: varchar(30), e.g. `detect` or `segment`
- `inference_time_ms`: nullable integer
- `total_detections`: integer, default 0
- `composition_json`: JSONB, contains calculation method and coverage summary
- `recommendations_json`: JSONB, snapshot of rules used for this analysis

## Table: `detections`
- `id`: UUID primary key
- `analysis_id`: UUID foreign key to `analyses.id` with ON DELETE CASCADE
- `class_name`: varchar(100), canonical normalized class identifier
- `confidence`: double precision, constrained 0..1
- `x1`, `y1`, `x2`, `y2`: numeric or double precision pixel coordinates
- `bbox_area_percent`: double precision, nullable
- Optional `created_at` is unnecessary unless required.

## Indexes
- `analyses.created_at DESC`
- `detections.analysis_id`
- Optional `analyses.model_name`

## Relationship
One analysis has many detections. Persist the analysis and all detections in a single transaction.

## Migration
Use Alembic. The agent must create an initial migration and document:
`alembic upgrade head`
Do not rely only on `Base.metadata.create_all()` in deployed production. It can be used for a local smoke test only if clearly separated from the migration workflow.

## Connection configuration
- Read `DATABASE_URL` from environment.
- Normalize provider-specific URL schemes if needed (e.g. `postgres://` to `postgresql://`, and choose the installed psycopg driver consistently).
- Use SQLAlchemy connection pooling appropriate for Render free service and Neon; avoid too many connections.
- Use TLS as required by Neon connection string.
- Do not print the connection string.
- Readiness endpoint should test DB connection with a lightweight query.
- Keep Neon credentials out of frontend configuration.

## Data retention
MVP stores metadata and detections only. Do not store raw image bytes or base64 annotations in PostgreSQL.
