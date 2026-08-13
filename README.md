# Tactica AI Frontend

An AI-powered academic planning platform that helps university students organize coursework, upload and extract deadlines from syllabi, and generate a deterministic-first semester roadmap. This repo is the Next.js frontend; the API it talks to lives in the separate [tactica_ai_backend](https://github.com/Bootcamp2OlaClass/tactica_ai_backend) repo — see that repo's `docs/ARCHITECTURE.md` for the full system design and `docs/SECURITY.md`/`docs/DEPLOYMENT.md` for current verified status.

---

## Features (shipped, not aspirational — see the backend's `PROJECT_STATUS.md`-tracked verification status for exactly what's real-provider-verified vs. not)

- 🔐 Auth — register/login/refresh/logout/password reset/email verification/account deletion
- 📚 Semester/Course/Task/Document CRUD
- 📄 Document upload + processing + LLM structured extraction (review-gated — nothing auto-commits)
- 🤖 AI Study Coach chat (retrieval-augmented, grounded, citation-verified)
- 📅 AI-assisted, deterministic-first semester roadmap (editable, never silently overwrites manual edits)
- 🧭 Smart recovery planning (deterministic priority ordering, AI explanation only)
- 🎓 Degree advisor architecture (built and tested against a synthetic catalog — real course-catalog data not yet sourced)
- 📆 Google Calendar sync
- 🔔 Email notification preferences

---

## Tech Stack

| Layer | Technology |
|--------|------------|
| Frontend | Next.js (App Router), React, TypeScript, Tailwind CSS |
| Backend | FastAPI (Python), separate repo |
| Database | PostgreSQL + pgvector |
| AI / RAG | Hand-rolled retrieval directly against pgvector — no LangChain/LlamaIndex |
| Document Processing | Native PDF extraction (pdfplumber) + LLM structured extraction; OCR-required detection implemented, OCR execution not yet available |
| Authentication | Custom hardened JWT (refresh rotation, lockout, password reset, email verification) — not Clerk |
| Background Jobs | Celery + Redis |
| File Storage | `StorageProvider` abstraction — local disk (dev) or Cloudflare R2 |
| Notifications | Resend (email); FCM push not yet implemented |
| Deployment | Not yet decided/deployed — local `docker compose` only today |

This table intentionally does not match this project's original planning documents in every row — several of those choices were revisited with reasoning during implementation (see the backend repo's `docs/ARCHITECTURE.md` "Where this diverges from the originally-documented target architecture").

---

## Project Structure

```
frontend/          Next.js application (see frontend/README.md)
docs/              Project documentation (git workflow)
.github/           GitHub workflows & templates
```

---

## Git Workflow

This project follows a Git Flow workflow.

```
main
│
└── develop
      ├── feature/*
      └── bugfix/*
```

- `main` — Production
- `develop` — Integration / Staging
- `feature/*` — New features
- `bugfix/*` — Bug fixes

See:

```
docs/git-workflow.md
```

for the complete workflow.

---

## Commit Convention

```
feat: new feature  
fix: bug fix  
refactor: code restructuring without behavior change  
docs: documentation changes  
test: adding or updating tests  
chore: maintenance tasks  
```

Example:

---

## Getting Started

### Clone repository

```bash
git clone git@github.com:Bootcamp2OlaClass/tactica_ai_frontend.git
cd tactica_ai_frontend/frontend
```

See `frontend/README.md` for the actual run/build/test steps — the app itself lives in that subdirectory, not the repo root.

### Create a feature branch

```bash
git checkout develop
git pull origin develop
git checkout -b feature/your-feature
```

### Open a Pull Request

Create a Pull Request from

```
feature/* → develop
```

Production releases are merged from

```
develop → main
```

---

## Documentation

- `docs/git-workflow.md` — this repo's branching/PR conventions.
- `frontend/README.md` — how to run this app locally (env vars, scripts).
- System architecture, API reference, database schema, RAG design, document pipeline, deployment, and security documentation all live in the [backend repo](https://github.com/Bootcamp2OlaClass/tactica_ai_backend)'s `docs/` directory — not duplicated here, to avoid two copies drifting out of sync.

---

## License

TBD
