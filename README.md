# Personal Portfolio

A full-stack portfolio site where projects live in a database and are managed through Django's admin panel — add, edit, or remove a project and it appears on the public site immediately, no redeploy required.

- **Backend**: Django + Django REST Framework, SQLite locally (swap to Postgres via one env var for production)
- **Frontend**: React + Vite + TypeScript + Tailwind CSS, served by Django itself (same origin as the API — no CORS)

## Project layout

```
my_portfolio/
├── Dockerfile   # multi-stage: builds frontend/, then the Python image that serves it
├── backend/     # Django project + "projects" app (models, admin, API)
└── frontend/    # React + Vite site
```

## Architecture: one origin, no CORS

Django serves the built React app directly — there's no separate frontend deployment or CORS to configure:

- `frontend/` — the React app. `npm run build` outputs to `frontend/dist/`.
- Django's `STATICFILES_DIRS` picks up `frontend/dist` under the `react/` prefix, so the built JS/CSS is served at `/static/react/...` through Whitenoise (see `vite.config.ts`'s `base: '/static/react/'`).
- `backend/config/spa.py` serves `frontend/dist/index.html` for any URL that isn't `/api/`, `/admin/`, `/static/`, or `/media/` — that's the catch-all that lets React Router own client-side navigation (see `backend/config/urls.py`).
- The React app talks to Django exclusively through relative `/api/...` requests (see `frontend/src/api/projects.ts`) — same origin, so no CORS headers needed anywhere.

```
Browser
  │
  ├─ GET /                  → config/spa.py → frontend/dist/index.html
  ├─ GET /static/react/...  → Whitenoise (built JS/CSS)
  ├─ GET  /api/...          → projects/views.py (DRF)
  └─ GET  /admin/           → Django admin
```

## Local development

**Backend:**

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux

pip install -r requirements.txt

copy .env.example .env       # Windows: copy, macOS/Linux: cp
# edit .env if you want (defaults work out of the box for local dev)

python manage.py migrate
python manage.py createsuperuser   # set your own admin username/password
python manage.py runserver 8001
```

> **Note on the port**: the backend runs on **8001**, not Django's default 8000, in case something else on your machine is already using 8000. Change it freely (`runserver <port>`) — just update `frontend/vite.config.ts`'s dev-server proxy target to match.

**Frontend** (only needed if you're actively changing React code):

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` — Vite's dev server proxies `/api` and `/media` requests to `http://127.0.0.1:8001` (see the `proxy` block in `vite.config.ts`), so it behaves like one origin locally too, without needing an env var for the API URL.

If you're not actively changing frontend code, you don't need `npm run dev` at all — just `npm run build` once, then visit the backend directly at `http://127.0.0.1:8001/`; Django serves whatever's currently in `frontend/dist/`. The workflow there is edit → `npm run build` → refresh the browser (no hot reload).

### Environment variables (`backend/.env`)

| Variable | Purpose | Default |
|---|---|---|
| `SECRET_KEY` | Django secret key | dev-only placeholder — **change for production** |
| `DEBUG` | Debug mode | `True` |
| `ALLOWED_HOSTS` | Comma-separated hostnames | `localhost,127.0.0.1` |
| `DATABASE_URL` | Postgres connection string | unset → falls back to local SQLite |
| `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | Cloudinary credentials for storing uploads (project thumbnails, resume) | unset → falls back to local disk storage |

### API endpoints

| Method | Path | Auth | Notes |
|---|---|---|---|
| GET | `/api/projects/` | public | supports `?tag=<name>` and `?featured=true` |
| GET | `/api/projects/<slug>/` | public | increments the view counter |
| POST | `/api/projects/` | admin | staff user via `/admin/` session or HTTP Basic auth |
| PATCH/PUT | `/api/projects/<slug>/` | admin | |
| DELETE | `/api/projects/<slug>/` | admin | |
| GET | `/api/tags/` | public | used to populate the tag filter UI |
| GET | `/api/profile/` | public | returns `{ resume_url }` for the resume uploaded in `/admin/` |

Before shipping, personalize `frontend/src/config/site.ts` (name, bio, skills, email, phone, social links) and `frontend/public/profile.jpg` (your headshot).

## Adding a project (day-to-day workflow)

1. Log into `/admin/` with your superuser account.
2. Under **Projects**, click **Add Project**. Fill in title, description, tech stack, GitHub/demo links, tags, upload a **Thumbnail** image, and check **Featured** if it should appear on the homepage.
3. Save — it's live on the public site immediately, since the frontend fetches from the API at request time.

## File uploads (project thumbnails, resume) and Cloudinary

Both `Project.thumbnail` and `Profile.resume` are real file uploads (not paste-a-link fields) handled through `/admin/`. Where the files are stored depends on whether Cloudinary is configured:

- **`CLOUDINARY_CLOUD_NAME`/`CLOUDINARY_API_KEY`/`CLOUDINARY_API_SECRET` unset** (the default): uploads go to local disk (`backend/media/`). Fine for local dev, but on free-tier hosts with an ephemeral filesystem (Render, Railway) uploaded files are **wiped on every redeploy**.
- **All three set**: uploads go straight to Cloudinary instead, and survive redeploys since they're no longer on the app server's disk.

To enable Cloudinary: sign up at cloudinary.com (free tier), copy your **Cloud Name**, **API Key**, and **API Secret** from the dashboard into `backend/.env` (locally) or your host's env var settings (production). No code changes needed — it's picked up automatically at startup.

> **One-time Cloudinary dashboard setting for the resume PDF**: newer Cloudinary accounts block public delivery of PDF/ZIP files by default (anti-abuse measure) — you'll get a `401` / "deny or ACL failure" on the resume URL otherwise. Fix once in **console.cloudinary.com → Settings (gear icon) → Security → "Allow delivery of PDF and ZIP files"**. This is account-level and can't be set from code. Project thumbnails (images) aren't affected.

The resume upload only accepts PDFs (browsers can't render `.docx`/`.doc` inline, so the site's "View resume" button would silently fall back to a plain download for anything else). If no resume has been uploaded, the About page simply doesn't show a resume section.

## Known limitation: Open Graph previews

This frontend is a client-rendered SPA (React Router owns navigation once the page loads), so per-project Open Graph tags aren't visible to social-media crawlers that don't execute JavaScript — link previews when sharing a project URL won't show a custom image/description. Achieving that would require server-side rendering of the meta tags per route (e.g. moving to Next.js, or adding a prerendering step); out of scope here.

## Deployment (free tier)

**Database — Supabase or Neon (Postgres)**
1. Create a free Postgres project on Supabase or Neon.
2. Copy the connection string and set it as `DATABASE_URL` in your production environment.
3. If using Supabase and the direct `db.<ref>.supabase.co` connection string fails to resolve (some networks only get an IPv6 route to it), use the **connection pooler** string instead (Settings → Database → Connection Pooling) — it's IPv4-compatible.

**App — Render, Railway, or any Docker host**
1. Push this repo to GitHub.
2. Create a new Web Service from the repo, runtime **Docker** (it'll pick up the root `Dockerfile` automatically — no build/start command fields needed, they're baked into the image).
3. Set env vars: `SECRET_KEY`, `DEBUG=False`, `ALLOWED_HOSTS=<your-domain>`, `DATABASE_URL=<from Supabase/Neon>`, and `CLOUDINARY_CLOUD_NAME`/`CLOUDINARY_API_KEY`/`CLOUDINARY_API_SECRET` (strongly recommended — without them, uploaded thumbnails/resume are wiped on every redeploy).
4. Deploy. Migrations run automatically on container start (see the `Dockerfile`'s `CMD`); no manual migrate step needed.
5. After the first deploy, run `python manage.py createsuperuser` via the host's shell/console to create your production admin account.

That's the whole deployment — one service, one Dockerfile, no separate frontend host or CORS configuration to keep in sync.

**Custom domain**: optional, point it at the app host; update `ALLOWED_HOSTS` accordingly.

### This project's actual live deployment

- App: `https://my-portfolio-merged.onrender.com` (Render Web Service, Docker runtime — serves both the API and the built frontend from one origin)
- Database: Supabase Postgres (`aws-0-eu-central-1` pooler — the direct `db.*.supabase.co` host only resolves over IPv6 in some networks, so the pooler connection string is used instead)
- Media/uploads: Cloudinary
- Auto-deploys on push to `main`.

> This started as two separate services (a Render Static Site for the frontend + a Render Web Service for the API), which worked but left the site vulnerable to browser privacy features (e.g. Brave Shields) blocking the cross-origin API calls on some visitors' devices. Merging to one origin — matching the pattern this project's own portfolio entries (`expense-tracker`, `ref_project`) already used — removes that whole class of failure.
