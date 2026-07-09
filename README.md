# Tactica AI Frontend

An AI-powered academic planning platform that helps university students organize coursework, generate personalized study roadmaps, and plan their degree with Retrieval-Augmented Generation (RAG).

---

## Features

- 📅 AI Semester Roadmap
- 📚 Weekly Study Workspace
- 🤖 AI Study Coach
- 🎓 Degree Planning Advisor
- 👨‍🏫 Course & Professor Intelligence
- 📖 AI Resource Recommendation
- 📆 Google Calendar Integration
- 🔔 Smart Reminder & Notification System

---

## Tech Stack

| Layer | Technology |
|--------|------------|
| Frontend | Next.js, React, TypeScript, Tailwind CSS |
| Backend | FastAPI (Python) |
| Database | PostgreSQL + pgvector |
| AI / RAG | LangChain, LlamaIndex, Gemini / OpenAI |
| Document Processing | OCR + Hybrid Deterministic / LLM Extraction |
| Authentication | Clerk + Google OAuth |
| Background Jobs | Celery + Redis |
| File Storage | Cloudflare R2 |
| Notifications | Firebase Cloud Messaging + Resend |
| Deployment | Vercel (Frontend), Railway (Backend) |

---

## Project Structure

```
frontend/          Next.js application
backend/           FastAPI service
docs/              Project documentation
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
git clone git@github.com:<organization>/tactica_ai.git
cd tactica_ai
```

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

- Git Workflow
- Architecture
- API Documentation
- Product Requirements
- Tech Stack

All documentation is located in the `docs/` directory.

---

## License

TBD
