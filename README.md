# BuildCycle AI Backend — Phase 1 MVP

AI-powered construction waste intelligence and recovery system backend built with FastAPI, Ultralytics YOLO, OpenCV, SQLAlchemy 2.x, Alembic, and Neon PostgreSQL.

---

## 1. Project Overview & Architecture

The BuildCycle AI backend provides real-time detection, material count calculations, estimated bounding-box coverage, deterministic circular economy recovery recommendations, and metadata/detection persistence for construction and demolition (C&D) waste.

```
                    ┌────────────────────────┐
                    │  React + Vite Frontend │
                    └───────────┬────────────┘
                                │ multipart/form-data (image)
                                ▼
                    ┌────────────────────────┐
                    │  FastAPI Backend /v1   │
                    └─────┬────────────┬─────┘
                          │            │
            ┌─────────────┴──────┐     │ Persist metadata & detections
            │ Ultralytics YOLO   │     ▼
            │ Detection Model    │  ┌────────────────────────┐
            └────────────────────┘  │ Neon PostgreSQL +      │
                                    │ SQLAlchemy 2.x         │
                                    └────────────────────────┘
```

---

## 2. Dataset Inspection & Findings

- **Location**: `data/`
- **Splits & Counts**:
  - `training`: 1,984 JPG images, 1,984 XML annotations
  - `validation`: 570 JPG images, 570 XML annotations
  - `testing`: 573 JPG images, 573 XML annotations
  - **Total**: 3,127 images & XML annotations
- **Annotation Format**: Pascal VOC XML format (`<annotation>`, `<size>`, `<object>` with `<name>`, `<bndbox>` coordinates `[xmin, ymin, xmax, ymax]`, and `<polygon>` vertex coordinates). Source database: DEFEAT / CODD dataset family.
- **Dataset Categories Found (10 classes)**:
  `brick`, `concrete`, `foam`, `general_w`, `gypsum_board`, `pipes`, `plastic`, `stone`, `tile`, `wood`
- **Model Weights in Dataset Archive**: None included in the raw image archive.

---

## 3. Model Weights & Loaded Metadata

- **Pretrained Weights**: Verified construction-waste YOLOv8l weights from the published C&D waste research dataset (Zenodo record 17447590, CC-BY 4.0).
- **Location**: `models/best.pt` (Configurable via `MODEL_PATH`).
- **Model Task**: `detect`
- **Classes Loaded Directly from Model Metadata**:
  1. `brick`
  2. `concrete`
  3. `plastic` (from `PlasticBottle`)
  4. `reinforcement_steel` (from `Reinforcement`)
  5. `timber` (from `Timber`)
- **Loaded Once Per Process**: Managed via `DetectorService` in the FastAPI `lifespan` context manager, not reloaded on every request.

---

## 4. Environment Configuration

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Key environment variables:

| Variable | Default | Description |
| :--- | :--- | :--- |
| `APP_ENV` | `development` | Runtime environment |
| `DATABASE_URL` | *(required for persistence)* | Neon PostgreSQL connection string |
| `CORS_ORIGINS` | `http://localhost:5173` | Allowed CORS origins for Vite frontend |
| `MODEL_PATH` | `models/best.pt` | Path to YOLO weights |
| `MODEL_NAME` | `construction-waste-yolo` | Identifier returned in metadata |
| `MODEL_CONFIDENCE_THRESHOLD` | `0.25` | Minimum detection confidence |
| `MODEL_IOU_THRESHOLD` | `0.45` | NMS IoU threshold |
| `MAX_UPLOAD_MB` | `10` | Maximum upload size in megabytes |
| `GEMINI_ENABLED` | `false` | Optional Gemini integration flag |

---

## 5. Setup & Run Commands

### Install Dependencies
```bash
pip install -r requirements.txt
```

### Apply Database Migrations (Neon PostgreSQL)
```bash
python -m alembic upgrade head
```

### Start Development Server
```bash
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

Interactive OpenAPI docs are available at `http://127.0.0.1:8000/docs`.

---

## 6. API Endpoints (`/api/v1`)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/health/live` | Process liveness probe (`{"status":"ok"}`) |
| `GET` | `/health/ready` | Runtime readiness probe (checks DB & model) |
| `GET` | `/model/status` | Model status, task type, and supported class list |
| `POST` | `/analyses` | Upload image, execute inference, compute coverage & recommendations, persist to Neon |
| `GET` | `/analyses` | List stored analyses with pagination (`limit`, `offset`) |
| `GET` | `/analyses/{id}` | Retrieve stored analysis metadata and detections |
| `GET` | `/analyses/{id}/report.csv` | Export analysis and detection rows as CSV |

---

## 7. Test Suite

Run focused unit and integration tests:

```bash
python -m pytest -v
```

**Results**: 18 passed in 44 seconds.
- Repository persistence & single-transaction detection storage
- End-to-end API analysis workflow
- Invalid file extension rejection (415)
- Corrupt image rejection (400)
- Missing analysis 404 handling
- Composition & bounding-box area percentage calculation
- Health & model status endpoints
- Image decoding and OpenCV annotation
- Deterministic recovery recommendations & unknown class fallback
- CSV formula injection sanitization
