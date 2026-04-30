# Handoff Setup

This is the quickest way to hand the project to someone else.

## Option 1: They already have MongoDB running locally

From the project root, copy-paste:

```bash
npm run demo:bootstrap
npm run dev
```

## Option 2: They do not have MongoDB installed

From the project root, copy-paste:

```bash
docker-compose -f db/mongo-compose.yml up -d
npm run demo:bootstrap
npm run dev
```

## What the bootstrap command does

- installs root, backend, and frontend dependencies
- creates `backend/.env` if it does not exist yet
- creates `frontend/.env` if it does not exist yet
- seeds the database with demo users, comments, and 100 blogs

## URLs

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`
- Health check: `http://localhost:5000/api/health`

## Demo logins

See `db/DEMO_ACCOUNTS.md`.