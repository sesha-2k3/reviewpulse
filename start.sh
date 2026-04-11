#!/bin/bash
# ReviewPulse — Quick Start
# -------------------------
# Launches both backend (FastAPI) and frontend (Vite React) concurrently.
#
# Prerequisites:
#   1. Set your Subconscious API key:
#        export SUBCONSCIOUS_API_KEY="your-key-here"
#      Or create backend/.env with:
#        SUBCONSCIOUS_API_KEY=your-key-here
#
#   2. Install dependencies:
#        cd backend && pip install -r requirements.txt
#        cd frontend && npm install

set -e

echo "============================================"
echo "  ReviewPulse — AI Product Review Analyzer"
echo "============================================"
echo ""

# Check API key
if [ -z "$SUBCONSCIOUS_API_KEY" ] && [ ! -f "backend/.env" ]; then
    echo "WARNING: No SUBCONSCIOUS_API_KEY found."
    echo "Set it via: export SUBCONSCIOUS_API_KEY='your-key'"
    echo "Or create backend/.env with SUBCONSCIOUS_API_KEY=your-key"
    echo ""
fi

# Start backend
echo "[1/2] Starting FastAPI backend on :8000..."
cd backend
uvicorn main:app --reload --port 8000 &
BACKEND_PID=$!
cd ..

# Start frontend
echo "[2/2] Starting React frontend on :3000..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "Backend:  http://localhost:8000"
echo "Frontend: http://localhost:3000"
echo "API docs: http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop both servers."

# Trap Ctrl+C to kill both processes
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit 0" INT TERM
wait
