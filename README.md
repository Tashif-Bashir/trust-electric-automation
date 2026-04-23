# Trust Electric Heating — AI-Powered Lead Generation & Business Automation

> A complete automation suite for Trust Electric Heating Ltd, makers of the NEOS electric radiator.  
> Built as a proof-of-capability demo by Bash (CS graduate, Leeds).

---

## What This Does

Six automations working together to capture leads, nurture them, and give the business a real-time view of operations:

| # | Automation | Description |
|---|-----------|-------------|
| 1 | **Landing Page** | Public-facing lead capture site for the NEOS radiator. Mobile-first, SEO-optimised, with savings calculator. |
| 2 | **Lead Notifications** | Every new lead triggers an SMS + email to the sales team within 60 seconds, plus a confirmation to the customer. |
| 3 | **Follow-Up Sequences** | Automated 4-step email sequence over 10 days. Respects lead status — never emails converted or lost leads. |
| 4 | **Lead Dashboard** | React dashboard for managing leads: filter, search, update status, add notes, view activity timeline. |
| 5 | **AI Content Generator** | Claude-powered tool to generate Instagram posts, emails, blog outlines, Google ads, and more — all on-brand. |
| 6 | **Business Overview** | Unified dashboard pulling live data from Xero (invoices/revenue) and Unleashed (stock/orders). |

---

## Tech Stack

```
Frontend (Landing Page): Next.js 14 · TypeScript · Tailwind CSS · framer-motion
Frontend (Dashboard):    React 18 · Vite · TanStack Query · Recharts
Backend:                 FastAPI · PostgreSQL 16 · Redis 7 · SQLAlchemy
Notifications:           Twilio (SMS) · Resend (Email)
AI:                      Anthropic Claude API
Integrations:            Xero OAuth 2.0 · Unleashed HMAC-SHA256
Deployment:              Vercel (frontends) · Railway (backend)
```

---

## Architecture

```
                         ┌─────────────────────────────┐
                         │       Internet / Users       │
                         └──────────────┬──────────────┘
                                        │
                    ┌───────────────────┼───────────────────┐
                    │                   │                   │
             ┌──────▼──────┐    ┌───────▼──────┐   ┌───────▼──────┐
             │ Landing Page│    │  Dashboard   │   │  AI Content  │
             │  (Next.js)  │    │  (React/Vite)│   │  Generator   │
             │  Vercel     │    │  Vercel      │   │  (Vite)      │
             └──────┬──────┘    └───────┬──────┘   └───────┬──────┘
                    │                   │                   │
                    └───────────────────┼───────────────────┘
                                        │ HTTP/REST
                                ┌───────▼──────┐
                                │   FastAPI    │
                                │   Backend    │
                                │  (Railway)   │
                                └──┬───────┬───┘
                                   │       │
                         ┌─────────┘       └─────────┐
                    ┌────▼─────┐               ┌─────▼────┐
                    │PostgreSQL│               │  Redis   │
                    │  (leads, │               │ (cache,  │
                    │  emails) │               │  rate    │
                    └─────▲────┘               │  limit)  │
                          │                   └──────────┘
                    ┌─────┴──────┐
                    │ Automations│
                    │ (scheduler)│
                    │ (Railway)  │
                    └─────┬──────┘
                          │
              ┌───────────┼───────────┐
         ┌────▼────┐ ┌────▼────┐ ┌───▼──────┐
         │ Twilio  │ │ Resend  │ │  Claude  │
         │  (SMS)  │ │ (Email) │ │   API    │
         └─────────┘ └─────────┘ └──────────┘
```

---

## Quick Start

### Prerequisites

- Docker Desktop
- Node.js 18+
- Python 3.12+
- npm or pnpm

### 1. Clone and configure

```bash
git clone https://github.com/Tashif-Bashir/trust-electric-automation.git
cd trust-electric-automation
cp .env.example .env
# Edit .env with your credentials (see Environment Variables section below)
```

### 2. Start the database services

```bash
docker-compose up -d postgres redis
# Wait for health checks to pass (~10s)
docker-compose ps   # both should show "healthy"
```

### 3. Start the backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
alembic upgrade head         # run database migrations
uvicorn main:app --reload    # starts on http://localhost:8000
```

### 4. Start the landing page

```bash
cd landing-page
npm install
npm run dev   # starts on http://localhost:3000
```

### 5. Start the dashboard

```bash
cd dashboard
npm install
npm run dev   # starts on http://localhost:5173
```

Or use the convenience script (starts everything):

```bash
bash scripts/dev.sh
```

---

## Project Structure

```
trust-electric-automation/
├── CLAUDE.md               Project context for Claude Code
├── docker-compose.yml      PostgreSQL + Redis local dev
├── .env.example            Environment variable template
├── package.json            npm workspace root
├── pyproject.toml          Python shared config
│
├── landing-page/           Automation 1 — Next.js 14 lead capture
├── backend/                Automations 2, 6 — FastAPI + DB
├── dashboard/              Automation 4 — React lead management
├── ai-content/             Automation 5 — AI content generator UI
├── automations/            Automation 3 — Python follow-up scheduler
├── shared/                 TypeScript types shared across frontends
├── scripts/                dev.sh, stop.sh convenience scripts
└── docs/                   Prompt pack, testing guide, demo script
```

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `REDIS_URL` | Yes | Redis connection string |
| `TWILIO_ACCOUNT_SID` | For SMS | Twilio console |
| `TWILIO_AUTH_TOKEN` | For SMS | Twilio console |
| `TWILIO_PHONE_NUMBER` | For SMS | Your Twilio number |
| `RESEND_API_KEY` | For email | resend.com dashboard |
| `OWNER_PHONE` | For SMS | Sales team phone |
| `OWNER_EMAIL` | For email | Sales team email |
| `ANTHROPIC_API_KEY` | For AI | console.anthropic.com |
| `XERO_CLIENT_ID` | For Xero | developer.xero.com |
| `XERO_CLIENT_SECRET` | For Xero | developer.xero.com |
| `UNLEASHED_API_ID` | For Unleashed | Unleashed > Integrations |
| `UNLEASHED_API_KEY` | For Unleashed | Unleashed > Integrations |
| `USE_MOCK_DATA` | No | `true` to skip real integrations |

---

## Deployment

### Landing Page → Vercel

```bash
cd landing-page
npx vercel --prod
# Set NEXT_PUBLIC_API_URL to your Railway backend URL
```

### Backend + Scheduler → Railway

```bash
npm i -g @railway/cli
cd backend
railway init
railway add postgresql
railway add redis
railway up
railway run alembic upgrade head
```

### Dashboard → Vercel

```bash
cd dashboard
npx vercel --prod
# Set VITE_API_URL to your Railway backend URL
```

---

## Running Tests

```bash
# Backend
cd backend
pytest

# Follow-up scheduler
cd automations
pytest

# Landing page
cd landing-page
npm run lint && npm run build
```

---

## License

Private — built for demo purposes for Trust Electric Heating Ltd.
