# NIRIKSHAN AI — Ground Reality Verification Platform

NIRIKSHAN AI is a state-level institutional monitoring and ground reality verification platform designed for government PMUs (Project Management Units) to cross-verify self-reported data against physical ground inspections using AI discrepancy detection.

---

## 🏗️ Architecture Overview

NIRIKSHAN AI features a consolidated FastAPI + SQLAlchemy backend layer:

```text
[ Frontend: React 19 + TypeScript + Vite 6 ]
                       │
              HTTP /api/* Calls
                       │
                       ▼
    [ Primary Backend: Python FastAPI ] ───► [ Gemini AI Discrepancy Engine ]
       • Port: 8000 (or $PORT)
       • SQLAlchemy 2.0 ORM + Alembic Migrations
       • SQLite (Development) / PostgreSQL (Production)
       • JWT Authentication & Bcrypt Hashing
       • Pytest Suite (30 Tests Passing)
```

1. **Frontend**: Single-Page React Application with simulated roles (PMU Director, Field Inspector, Institution Admin).
2. **FastAPI Backend**: Serves `/api/*` and `/api/v1/*` endpoints for Institutions, Inspections, Telemetry, Alerts, Analytics, Audit Ledger, and AI Discrepancy Analysis.
3. **Database Layer**: SQLite (`nirikshan.db`) via SQLAlchemy ORM (PostgreSQL ready) managed by Alembic migrations.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript ~5.8, Vite 6, Tailwind CSS v4 (`@tailwindcss/vite`), Lucide Icons, Motion.
- **Backend**: Python 3.14 / 3.11, FastAPI 0.110+, Uvicorn, Pydantic v2, Passlib (bcrypt), PyJWT (jose), Alembic.
- **Database**: SQLite (`nirikshan.db`) local dev / PostgreSQL ready via `DATABASE_URL`.
- **AI Discrepancy Engine**: Google GenAI SDK (`google-generativeai`) using `gemini-1.5-flash` with a deterministic rule-engine fallback.

---

## 🚀 Quick Commands

### 1. Running the FastAPI Backend
```bash
cd Backend-Folder/backend
venv/bin/uvicorn app.main:app --port 8000
```
API Documentation: `http://localhost:8000/docs`

### 2. Running Backend Tests
```bash
cd Backend-Folder/backend
venv/bin/pytest -v
```

### 3. Building the Frontend
```bash
cd Backend-Folder
npm run build
```

---

## 📊 Status Summary

- ✅ **Phase 1**: Technical Audit
- ✅ **Phase 2**: Directory Cleanup
- ✅ **Phase 3**: Frontend Stability & Vite 6 Build
- ✅ **Phase 4**: FastAPI Core Stabilization & JWT Auth
- ✅ **Phase 5**: Backend Consolidation (Express → FastAPI Migration)
- ✅ **Phase 6**: Database Architecture, SQLAlchemy Models & Alembic Migrations
- ✅ **Phase 7**: Local Production Validation (Build & Health Checks Passing)
