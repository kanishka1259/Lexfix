# 05 – Analytics Engine

> **Epic 5 · LinguaAccess** — Real-time collaboration and ML-powered language analytics for the LinguaAccess learning platform.

## Architecture

```
05-analytics-engine/
├── src/
│   ├── collaboration-service/   # Node.js / Socket.io real-time service
│   │   ├── server.ts            # Entry point, Redis adapter setup
│   │   └── src/
│   │       ├── handlers/        # chat, presence, room, whiteboard
│   │       ├── middleware/      # auth, rate-limit
│   │       └── utils/           # helpers
│   └── ml-service/              # Python / FastAPI ML service
│       ├── app/
│       │   ├── main.py          # FastAPI app, CORS, lifespan
│       │   ├── routes/          # pronunciation, text_analysis, recommendations, tts, health
│       │   └── services/        # business logic & model wrappers
│       ├── Dockerfile
│       └── requirements.txt
└── CONTRIBUTING.md
```

## Services

| Service | Port | Tech |
|---------|------|------|
| Collaboration | 3002 | Node.js, Socket.io, Redis |
| ML / NLP | 8000 | Python, FastAPI, Transformers |

## Quick Start

```bash
# Collaboration service
cd src/collaboration-service
npm install
npm run dev

# ML service
cd src/ml-service
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/ml/pronunciation/evaluate` | Evaluate pronunciation from audio |
| POST | `/api/ml/text/analyze` | Analyse learner text |
| POST | `/api/ml/recommend-lessons` | AI lesson recommendations |
| POST | `/api/ml/tts/speak` | Text-to-speech synthesis |
| GET  | `/api/ml/health` | Health check |

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for the micro-commit workflow and branching conventions.
