# NIRIKSHAN AI — Ground Reality Verification Platform

NIRIKSHAN AI is a state-level institutional monitoring and ground reality verification platform designed for government PMUs (Project Management Units) to cross-verify self-reported data against physical ground inspections using AI discrepancy detection.

---

## 🏗️ Current Architecture

NIRIKSHAN AI currently utilizes a **dual-backend setup** during the baseline transition phase:

```
[ Frontend: React 19 + TypeScript + Vite 6 ]
                       │
             HTTP /api/* Calls
                       │
                       ▼
    [ Active Backend: Express/Node Server ] ───► [ Gemini 3.8 Flash AI Engine ]
                       │
             In-Memory TS Controller
                       
    ─────────────────────────────────────────
    [ Standalone Backend: Python FastAPI ]
      • Port: 8000
      • SQLAlchemy ORM + SQLite (nirikshan.db)
      • JWT Authentication & Bcrypt Hashing
      • Pytest Suite (20 Tests)
```

1. **Frontend**: Single-Page React Application with simulated roles (PMU Director, Field Inspector).
2. **Active Backend (Express/Node)**: Serves `/api/*` endpoints for institutions, inspections, telemetry, audit logs, and Gemini AI discrepancy analysis.
3. **Target Backend (Python/FastAPI)**: Independent backend service providing full JWT authentication, RBAC, SQLAlchemy ORM persistence, and automated test coverage.

---

## 🛠️ Technology Stack

- **Frontend Technology**: React 19, TypeScript ~5.8, Vite 6, Tailwind CSS v4 (`@tailwindcss/vite`), Lucide Icons, Motion.
- **Active Node Backend**: Express.js 4.21, `tsx`, `esbuild`, `dotenv`.
- **Target Python Backend**: Python 3.14 / 3.11, FastAPI 0.110, Uvicorn, Pydantic v2, Passlib (bcrypt), PyJWT (jose), Alembic.
- **Database Layer**:
  - Express: In-Memory Data Structure Controller (`server/db.ts`).
  - FastAPI: SQLite (`nirikshan.db`) via SQLAlchemy ORM (PostgreSQL ready).
- **AI Discrepancy Engine**: Google GenAI SDK (`@google/genai`) using `gemini-3.8-flash` with a deterministic rule-engine fallback.

---

## 🚀 Getting Started

### 1. Environment Setup
Copy the placeholder environment file to create `.env`:
```bash
cp .env.example .env
```

Configure your environment variables in `.env`:
```env
GEMINI_API_KEY=your_gemini_api_key_here
SECRET_KEY=your_jwt_secret_key_here
DATABASE_URL=sqlite:///./nirikshan.db
```

### 2. Running the Frontend & Active Express Backend
From the root or `Backend-Folder` directory:
```bash
cd Backend-Folder
npm install
npm run dev
```
The application will start on `http://localhost:3000`.

### 3. Running the Python/FastAPI Backend
```bash
cd Backend-Folder/backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
API Documentation will be available at `http://localhost:8000/docs`.

### 4. Running Backend Tests
```bash
cd Backend-Folder/backend
pytest
```

---

## 📊 Development Status

### ✅ Implemented
- [x] Ground Reality Monitoring Dashboard & 12 Interactive Views
- [x] Surprise Inspection Dispatch & Checklists
- [x] Field Inspector Mobile Simulator UI
- [x] Real-time Telemetry & Haversine Geofencing Algorithm
- [x] Cryptographic SHA-256 Audit Trail Hashing
- [x] Google Gemini 3.8 Flash AI Discrepancy Analysis Engine
- [x] Rule-Engine Fallback for Offline/Unkeyed AI Execution
- [x] FastAPI JWT Authentication, Roles, SQLAlchemy ORM, and Pytest Suite

### 🚧 In Progress
- [ ] Backend Unification: Porting Express endpoints (Inspections, Telemetry, AI) to FastAPI
- [ ] Connecting React Frontend API client directly to FastAPI `/api/v1/*`

### 🔮 Planned
- [ ] HTML5 `navigator.geolocation` Browser API Hardware Geofence Locking
- [ ] Real Multipart Binary Camera Evidence Photo Uploads & Storage
- [ ] Production PostgreSQL Deployment & Migration Execution
