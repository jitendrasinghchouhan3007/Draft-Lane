# Blog Management System

Full-stack blog management project built with React, Node.js, Express, and MongoDB.

## What is included

- Blog list page with pagination, title search, and tag filtering
- Blog details page with author details and recursive nested comments
- Blog create, edit, and delete flows with validation
- JWT authentication for protected actions
- Role-aware authorization where authors manage their own posts and admins can manage any post
- Like and unlike support for blogs
- Rich text blog editor with markdown toolbar and live preview
- Dark mode toggle with persisted theme preference
- Optional infinite-scroll browsing mode in addition to the required pagination flow
- Demo seed data with 7 direct-login accounts, nested comments, and 100 blogs

## Project structure

```text
.
├── db
├── backend
│   ├── scripts
│   └── src
└── frontend
    └── src
```

## Local setup

1. Make sure MongoDB is available.
    The backend uses `mongodb://127.0.0.1:27017/blog-management-system` by default. You can also point it to Atlas or another MongoDB instance with `MONGODB_URI` in `backend/.env`.
    MongoDB Compass is only a GUI client. The app does not fetch data from Compass directly; it connects to the MongoDB server or Atlas cluster using the same connection string.
    If you use Atlas, prefer the `mongodb+srv://...` URI, URL-encode special characters in the password, and make sure your IP is allowed in Atlas Network Access.

2. Install dependencies.

```bash
npm install
npm install --prefix backend
npm install --prefix frontend
```

You can also use the helper script:

```bash
npm run install:all
```

3. Optional: create env files.

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

The frontend works without a custom env file during local development because Vite proxies `/api` to the backend.

4. Optional: seed sample data.

```bash
npm run seed --prefix backend
```

Sample users after seeding:

- `maya@example.com` / `password123`
- `arjun@example.com` / `password123`
- `neha@example.com` / `password123`
- `rahul@example.com` / `password123`
- `sana@example.com` / `password123`
- `vikram@example.com` / `password123`
- `admin@example.com` / `password123`

For the full demo dataset and third-person handoff flow, use the `db` folder:

- [db/DEMO_ACCOUNTS.md](db/DEMO_ACCOUNTS.md)
- [db/HANDOFF_SETUP.md](db/HANDOFF_SETUP.md)
- [db/mongo-compose.yml](db/mongo-compose.yml)

## Demo bootstrap

If you want the easiest project setup with the 100-blog dataset, run:

```bash
npm run demo:bootstrap
```

That command:

- installs root, backend, and frontend dependencies
- creates local env files when they are missing
- seeds the database with 7 users, 100 blogs, and nested comments

If MongoDB is not installed locally, start it first with:

```bash
docker-compose -f db/mongo-compose.yml up -d
```

5. Start the app.

Run both apps together:

```bash
npm run dev
```

Or run them separately:

```bash
npm run dev --prefix backend
npm run dev --prefix frontend
```

Frontend: `http://localhost:5173`

Backend: `http://localhost:5000`

Health check: `http://localhost:5000/api/health`

## API overview

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/users/me`
- `GET /api/users/:id`
- `GET /api/blogs`
- `GET /api/blogs/:id`
- `POST /api/blogs`
- `PUT /api/blogs/:id`
- `DELETE /api/blogs/:id`
- `PATCH /api/blogs/:id/like`
- `GET /api/comments/blog/:blogId`
- `POST /api/comments`

## Validation already run

- Backend syntax and module load check
- Backend JWT smoke test with in-memory MongoDB
- Backend demo seed test with 7 users and 100 blogs in in-memory MongoDB
- Frontend lint
- Frontend production build

## Deploying to Vercel

Deploy the frontend and backend as two separate Vercel projects.
Do not deploy the repository root as a single Vercel project.
If you already created a failing repo-root project, either delete it or change its Root Directory before retrying.

### Backend project

1. In Vercel, create a new project from this repository.
2. Set the Root Directory to `backend`.
3. Use `Other` if Vercel asks for a framework preset.
4. In Build and Output Settings, use these values:

    - Install Command: `npm install`
    - Build Command: leave blank
    - Output Directory: leave blank
    - Node.js Version: `20.x` or newer

5. Add these environment variables:

    - `MONGODB_URI`: your MongoDB Atlas connection string
    - `JWT_SECRET`: a long random secret
    - `CLIENT_ORIGIN`: `https://your-frontend-project.vercel.app`

6. Deploy the project.

The backend Vercel entry now points at `backend/src/server.js`, which connects to MongoDB and exports the Express app in a Vercel-compatible shape.

After deployment, verify:

```text
https://your-backend-project.vercel.app/api/health
```

### Frontend project

1. Create a second Vercel project from the same repository.
2. Set the Root Directory to `frontend`.
3. Use the Vite framework preset.
4. In Build and Output Settings, use these values:

     - Install Command: `npm install`
     - Build Command: `npm run build`
     - Output Directory: `dist`
     - Node.js Version: `20.x` or newer

5. Add this environment variable:

    - `VITE_API_BASE_URL`: `https://your-backend-project.vercel.app/api`

6. Deploy the project.

The frontend `vercel.json` already rewrites all routes to `index.html`, so React Router deep links keep working in production.
The frontend build script also calls the Vite binary through `node`, which avoids the `Permission denied` failure you saw for `/node_modules/.bin/vite` on Vercel.

### Production checklist

- Use MongoDB Atlas for `MONGODB_URI`. Vercel cannot reach a local MongoDB running on your machine.
- In Atlas Network Access, allow the Vercel deployment to connect. For a quick setup, many demos use `0.0.0.0/0`; for stricter security, narrow this later.
- After the frontend finishes deploying, copy its production domain and update `CLIENT_ORIGIN` in the backend project if needed, then redeploy the backend.
- `CLIENT_ORIGIN` accepts a comma-separated list, so you can allow more than one frontend URL when needed.
- If you prefer the CLI, run `vercel` inside `backend` and `frontend` separately instead of from the repo root.

### Values to enter in Vercel

Backend project:

- Project Name: any unique name, for example `blog-management-backend`
- Framework Preset: `Other`
- Root Directory: `backend`
- Install Command: `npm install`
- Build Command: leave blank
- Output Directory: leave blank
- Environment Variables:
    - `MONGODB_URI=<your Atlas URI>`
    - `JWT_SECRET=<a long random secret>`
    - `CLIENT_ORIGIN=https://<your-frontend-domain>.vercel.app`

Frontend project:

- Project Name: any unique name, for example `blog-management-frontend`
- Framework Preset: `Vite`
- Root Directory: `frontend`
- Install Command: `npm install`
- Build Command: `npm run build`
- Output Directory: `dist`
- Environment Variables:
    - `VITE_API_BASE_URL=https://<your-backend-domain>.vercel.app/api`

## Notes

- Only authenticated users can create blogs or comments.
- Authors can edit or delete their own blogs, and admin users can manage any blog.
- Nested comments are stored with parent-child references and rendered recursively on the frontend.