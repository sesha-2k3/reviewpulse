# ReviewPulse — AI-Powered Product Review Analyzer

An autonomous agent orchestrator that fans out across Twitter, news, web forums, and fresh content to deliver comprehensive product sentiment analysis. Built on the Subconscious platform with multi-tool orchestration and intelligent engine routing.

## Architecture

```
User Input ("AirPods Pro 3")
        │
        ▼
┌──────────────────────┐
│   FastAPI Backend     │
│   (Orchestrator)      │
└──────┬───────────────┘
       │ Fires 4 parallel Subconscious runs
       ▼
┌──────────┬──────────┬──────────┬──────────┐
│ Twitter  │  News    │   Web    │ Synthesis│
│ $0.10    │  $0.10   │  $0.10   │  $0.50   │
│tweet_srch│news_srch │web_search│ GPT-Heavy│
└──────────┴──────────┴──────────┴──────────┘
       │ All results merged
       ▼
┌──────────────────────┐
│  Sentiment Dashboard  │
│  React Frontend       │
└──────────────────────┘
```

## Quick Start

### Backend
```bash
cd backend
pip install -r requirements.txt
export SUBCONSCIOUS_API_KEY="your-api-key"
uvicorn main:app --reload --port 8000
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Cost Per Analysis
- 3 search runs × $0.10 = $0.30
- 1 full synthesis run × $0.50 = $0.50
- **Total: $0.80 per product analysis**

## Tech Stack
- **Backend**: FastAPI, Subconscious Python SDK, asyncio
- **Frontend**: React, Vite, Tailwind-free (custom CSS)
- **AI Platform**: Subconscious (tim-claude engine)
- **Tools**: tweet_search, news_search, web_search, fresh_search
