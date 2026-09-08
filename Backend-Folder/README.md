# NIRIKSHAN AI — Application Core Directory

This directory contains the main application components for NIRIKSHAN AI:

- `src/`: React 19 + TypeScript + Vite 6 Frontend Application
- `server/`: Express Server Routes & In-Memory DB Controller
- `backend/`: Python FastAPI Backend Application (`app/`), Pytest Suite (`tests/`), and Alembic Migrations (`alembic/`)

## Quick Commands

- **Start Frontend & Express Server**: `npm run dev`
- **Build Frontend**: `npm run build`
- **TypeScript Check**: `npm run lint`
- **Run FastAPI Backend**: `cd backend && uvicorn app.main:app --port 8000`
- **Run FastAPI Tests**: `cd backend && pytest`
