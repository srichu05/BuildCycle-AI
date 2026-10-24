# BuildCycle AI — Full Stack Construction Waste Intelligence

BuildCycle AI is an AI-powered construction and demolition (C&D) waste intelligence platform. It combines a **FastAPI backend** running an **Ultralytics YOLO** computer vision model with **OpenCV image annotation**, **Neon PostgreSQL** relational persistence, and an interactive **React + TypeScript + Vite frontend**.

---

## 1. System Architecture

```
┌────────────────────────────────────────────────────────┐
│               React + Vite Frontend                    │
│            (Deployed on Vercel Edge / SPA)             │
└──────────────────────────┬─────────────────────────────┘
                           │ HTTPS REST (multipart/form-data)
                           ▼
┌────────────────────────────────────────────────────────┐
│                 FastAPI Backend                        │
│            (Deployed on Render Free Web Service)       │
└──────────────┬──────────────────────────┬──────────────┘
               │                          │
┌──────────────┴──────────┐   ┌───────────┴──────────────┐
│  Ultralytics YOLO       │   │  Neon Serverless         │
│  Detection (models/)    │   │  PostgreSQL (Alembic)    │
└─────────────────────────┘   └──────────────────────────┘
```

---

## 2. Quick Local Development

### Prerequisites
- Python 3.10+ (tested on Python 3.11 & 3.13)
- Node.js 18+ & npm

### Backend Setup
```bash
# 1. Install Python dependencies
pip install -r requirements.txt

# 2. Configure environment
cp .env.example .env
# Edit .env with your Neon DATABASE_URL

# 3. Apply database migrations
python -m alembic upgrade head

# 4. Start FastAPI server (http://localhost:8000)
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

### Frontend Setup
```bash
# 1. Enter frontend directory
cd frontend

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
# Default VITE_API_BASE_URL is http://localhost:8000

# 4. Start Vite dev server (http://localhost:5173)
npm run dev
```

---

## 3. Production Deployment Guide

### A. Neon Serverless PostgreSQL
1. Create a free project at [Neon.tech](https://neon.tech).
2. Create a database named `neondb`.
3. Copy the pooled connection string:
   ```
   postgresql://<user>:<password>@<ep-pooler-id>.c-6.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```
4. Note: Alembic migrations will run automatically on Render startup via `alembic upgrade head`.

### B. Backend on Render Free (Web Service)
You can deploy using either the included `render.yaml` Blueprint or manually in the Render dashboard:

#### Manual Dashboard Setup
1. In [Render Dashboard](https://dashboard.render.com), click **New +** → **Web Service**.
2. Connect your GitHub repository (`https://github.com/srichu05/BuildCycle-AI`).
3. Set configuration parameters:
   - **Name**: `buildcycle-ai-backend`
   - **Region**: Ohio (US East) or Frankfurt (match your Neon region for low latency)
   - **Branch**: `main`
   - **Root Directory**: Leave blank (uses repo root)
   - **Runtime**: `Python 3`
   - **Build Command**:
     ```bash
     pip install --upgrade pip && pip install --extra-index-url https://download.pytorch.org/whl/cpu -r requirements.txt
     ```
   - **Start Command**:
     ```bash
     alembic upgrade head && uvicorn app.main:app --host 0.0.0.0 --port $PORT
     ```
   - **Instance Type**: `Free`
4. Add **Environment Variables**:
   | Key | Value | Notes |
   | :--- | :--- | :--- |
   | `APP_ENV` | `production` | Production mode |
   | `DATABASE_URL` | `<your-neon-connection-string>` | Must include `?sslmode=require` |
   | `CORS_ORIGINS` | `http://localhost:5173,https://*.vercel.app` | Allows local & all Vercel domains |
   | `MODEL_PATH` | `models/best.pt` | Pre-trained YOLO weights in repository |
   | `MODEL_NAME` | `construction-waste-yolo` | Identifier |
   | `MODEL_CONFIDENCE_THRESHOLD` | `0.25` | Minimum confidence |
   | `MODEL_IOU_THRESHOLD` | `0.45` | NMS IoU threshold |
   | `MAX_UPLOAD_MB` | `10` | 10 MB payload limit |
5. Add **Health Check Path**: `/api/v1/health/live`.
6. Click **Create Web Service**.
7. Note your public URL: `https://<service-name>.onrender.com`.

### C. Frontend on Vercel
1. In [Vercel Dashboard](https://vercel.com/new), import your GitHub repository.
2. In Project Settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click "Edit" and choose `frontend`.
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. In **Environment Variables**:
   | Name | Value |
   | :--- | :--- |
   | `VITE_API_BASE_URL` | `https://<your-render-service>.onrender.com` |
4. Click **Deploy**.
5. Once deployed, Vercel gives you a URL like `https://buildcycle-ai.vercel.app`.

---

## 4. Render Free Limitations & Optimizations

| Limitation | Impact | BuildCycle AI Optimization Implemented |
| :--- | :--- | :--- |
| **512 MB RAM Cap** | YOLOv8 inference can trigger OOM kills (`Exit 137`) if tensors unconstrained | `DetectorService` uses `torch.inference_mode()`, caps inference input to `imgsz=640`, and restricts CPU thread count to 2. |
| **No CUDA / GPU** | GPU libraries waste ~2 GB of disk/cache during build | Build command uses `--extra-index-url https://download.pytorch.org/whl/cpu` to install the ~180MB CPU wheel instead of 2.2GB CUDA wheel. |
| **Cold Starts (Spin Down)** | Render Free instances sleep after 15 min of inactivity; wakeups take 50–70s | Frontend client timeout is configured to 75 seconds with descriptive waking-state messages instead of failing immediately. |
| **Shared vCPU** | CPU compute is throttled | OpenCV image preprocessing decodes directly to contiguous numpy arrays; predictions execute in ~400–900ms on CPU. |

---

## 5. API Contract Reference (`/api/v1`)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | Root service health & metadata |
| `GET` | `/api/v1/health/live` | Process liveness probe (`{"status":"ok"}`) |
| `GET` | `/api/v1/health/ready` | Readiness probe (verifies Neon DB and YOLO weights) |
| `GET` | `/api/v1/model/status` | Model status, task type, and class list |
| `POST` | `/api/v1/analyses` | Upload image (`file`), execute YOLO inference, annotate, & persist |
| `GET` | `/api/v1/analyses` | Paginated analysis history (`limit`, `offset`) |
| `GET` | `/api/v1/analyses/{id}` | Retrieve single analysis with bounding boxes & recommendations |
| `GET` | `/api/v1/analyses/{id}/report.csv` | Download CSV audit report |

---

## 6. Automated Testing

Run the full pytest suite:
```bash
python -m pytest -v
```
All 18 unit and integration tests verify persistence, OpenCV processing, YOLO inference, and API endpoints against live PostgreSQL.
