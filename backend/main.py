"""
ReviewPulse API (v2)
====================
FastAPI backend with 2-phase orchestration:
  Phase 1: Research (all tools, single run)
  Phase 2: Synthesis (structured JSON output)
"""

import os
import json
import asyncio
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from dotenv import load_dotenv
from concurrent.futures import ThreadPoolExecutor

from orchestrator import analyze_product, _run_subconscious, _build_task

load_dotenv()

app = FastAPI(
    title="ReviewPulse API",
    description="AI-powered product review analyzer using Subconscious multi-agent orchestration",
    version="2.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

executor = ThreadPoolExecutor(max_workers=4)


class AnalyzeRequest(BaseModel):
    product: str


class CompareRequest(BaseModel):
    product_a: str
    product_b: str


@app.get("/health")
async def health():
    return {"status": "ok", "service": "reviewpulse"}


# ---------------------------------------------------------------------------
# Single product analysis (blocking)
# ---------------------------------------------------------------------------

@app.post("/api/analyze")
async def analyze(req: AnalyzeRequest):
    if not req.product.strip():
        raise HTTPException(status_code=400, detail="Product name is required")
    result = await analyze_product(req.product.strip())
    return result


# ---------------------------------------------------------------------------
# Streaming analysis with SSE
# ---------------------------------------------------------------------------

@app.post("/api/analyze/stream")
async def analyze_stream(req: AnalyzeRequest):
    if not req.product.strip():
        raise HTTPException(status_code=400, detail="Product name is required")

    product = req.product.strip()

    async def event_generator():
        loop = asyncio.get_event_loop()

        yield f"data: {json.dumps({'stage': 'started', 'product': product})}\n\n"
        yield f"data: {json.dumps({'stage': 'researching', 'message': 'Searching across all sources...'})}\n\n"

        task = _build_task(product)
        raw_result = await loop.run_in_executor(executor, _run_subconscious, task)

        yield f"data: {json.dumps({'stage': 'synthesizing', 'message': 'Building report...'})}\n\n"

        try:
            report = json.loads(raw_result)
        except (json.JSONDecodeError, TypeError):
            from orchestrator import _try_extract_json
            report = _try_extract_json(raw_result)

        final = {
            "stage": "complete",
            "product": product,
            "report": report,
            "rawData": raw_result[:3000] if raw_result else "",
        }
        yield f"data: {json.dumps(final)}\n\n"

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "Connection": "keep-alive"},
    )


# ---------------------------------------------------------------------------
# Compare two products
# ---------------------------------------------------------------------------

@app.post("/api/compare")
async def compare(req: CompareRequest):
    if not req.product_a.strip() or not req.product_b.strip():
        raise HTTPException(status_code=400, detail="Both product names are required")

    result_a, result_b = await asyncio.gather(
        analyze_product(req.product_a.strip()),
        analyze_product(req.product_b.strip()),
    )
    return {"product_a": result_a, "product_b": result_b}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
