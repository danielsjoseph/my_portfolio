# Personal Portfolio

A full-stack portfolio site where projects live in a database and are managed through Django's admin panel — add, edit, or remove a project and it appears on the public site immediately, no redeploy required.

- **Backend**: Django + Django REST Framework, SQLite locally (swap to Postgres via one env var for production)
- **Frontend**: React + Vite + TypeScript + Tailwind CSS

## Project layout

```
my_portfolio/
├── backend/    # Django project + "projects" app (models, admin, API)
└── frontend/   # React + Vite site
```

## Backend setup

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

The API is now at `http://127.0.0.1:8001/api/` and the admin at `http://127.0.0.1:8001/admin/`.

> **Note on the port**: the backend runs on **8001**, not Django's default 8000, in case something else on your machine is already using 8000. Change it freely (`runserver <port>`) as long as you also update `frontend/.env.local`'s `VITE_API_URL` and `backend/.env`'s `CORS_ALLOWED_ORIGINS` to match.

### Environment variables (`backend/.env`)

| Variable | Purpose | Default |
|---|---|---|
| `SECRET_KEY` | Django secret key | dev-only placeholder — **change for production** |
| `DEBUG` | Debug mode | `True` |
| `ALLOWED_HOSTS` | Comma-separated hostnames | `localhost,127.0.0.1` |
| `DATABASE_URL` | Postgres connection string | unset → falls back to local SQLite |
| `CORS_ALLOWED_ORIGINS` | Comma-separated frontend origins allowed to call the API | `http://localhost:5173,http://127.0.0.1:5173` |
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

## Frontend setup

```bash
cd frontend
npm install
copy .env.example .env.local   # Windows: copy, macOS/Linux: cp
npm run dev
```

Open `http://localhost:5173`. `VITE_API_URL` in `.env.local` controls which backend it talks to (defaults to `http://localhost:8001/api`).

Before shipping, personalize `frontend/src/config/site.ts` (name, bio, skills, email, social links) and `frontend/public/profile.jpg` (your headshot).

## Adding a project (day-to-day workflow)

1. Log into `http://127.0.0.1:8001/admin/` (or your deployed backend's `/admin/`) with your superuser account.
2. Under **Projects**, click **Add Project**. Fill in title, description, tech stack, GitHub/demo links, tags, upload a **Thumbnail** image, and check **Featured** if it should appear on the homepage.
3. Save — it's live on the public site immediately, since the frontend fetches from the API at request time.

## File uploads (project thumbnails, resume) and Cloudinary

Both `Project.thumbnail` and `Profile.resume` are real file uploads (not paste-a-link fields) handled through `/admin/`. Where the files are stored depends on whether Cloudinary is configured:

- **`CLOUDINARY_CLOUD_NAME`/`CLOUDINARY_API_KEY`/`CLOUDINARY_API_SECRET` unset** (the default): uploads go to local disk (`backend/media/`). Fine for local dev, but on free-tier hosts with an ephemeral filesystem (Render, Railway) uploaded files are **wiped on every redeploy**.
- **All three set**: uploads go straight to Cloudinary instead, and survive redeploys since they're no longer on the app server's disk.

To enable Cloudinary: sign up at cloudinary.com (free tier), copy your **Cloud Name**, **API Key**, and **API Secret** from the dashboard into `backend/.env` (locally) or your host's env var settings (production). No code changes needed — it's picked up automatically at startup.

> **One-time Cloudinary dashboard setting for the resume PDF**: newer Cloudinary accounts block public delivery of PDF/ZIP files by default (anti-abuse measure) — you'll get a `401` / "deny or ACL failure" on the resume URL otherwise. Fix once in **console.cloudinary.com → Settings (gear icon) → Security → "Allow delivery of PDF and ZIP files"**. This is account-level and can't be set from code. Project thumbnails (images) aren't affected.

The resume upload only accepts PDFs (browsers can't render `.docx`/`.doc` inline, so the site's "View resume" button would silently fall back to a plain download for anything else). If no resume has been uploaded, the About page falls back to `frontend/public/resume.pdf` if you've placed one there.

## Known limitation: Open Graph previews

This frontend is a client-rendered SPA (not server-rendered), so per-project Open Graph tags aren't visible to social-media crawlers that don't execute JavaScript — link previews when sharing a project URL won't show a custom image/description. Achieving that would require moving to a server-rendered framework (e.g. Next.js) or adding a prerendering step; out of scope here.

## Deployment (free tier)

**Database — Supabase or Neon (Postgres)**
1. Create a free Postgres project on Supabase or Neon.
2. Copy the connection string and set it as `DATABASE_URL` in your backend's production environment.

**Backend — Render or Railway**
1. Push this repo to GitHub.
2. Create a new Web Service pointed at `backend/`, with:
   - Build command: `pip install -r requirements.txt && python manage.py collectstatic --noinput --upload-unhashed-files && python manage.py migrate`
     (the `--upload-unhashed-files` flag is required because `django-cloudinary-storage`'s `collectstatic` override otherwise skips copying static files when Cloudinary isn't also your static-file backend, which is the case here — Cloudinary is only used for media uploads)
   - Start command: `gunicorn config.wsgi`
3. Set env vars: `SECRET_KEY`, `DEBUG=False`, `ALLOWED_HOSTS=<your-backend-domain>`, `DATABASE_URL=<from Supabase/Neon>`, `CORS_ALLOWED_ORIGINS=<your-frontend-domain>`, and `CLOUDINARY_CLOUD_NAME`/`CLOUDINARY_API_KEY`/`CLOUDINARY_API_SECRET` (strongly recommended here — without them, uploaded thumbnails/resume are wiped on every redeploy).
4. After the first deploy, run `python manage.py createsuperuser` via the host's shell/console to create your production admin account.

**Frontend — Netlify or Vercel**
1. Create a new site pointed at `frontend/`, build command `npm run build`, publish directory `dist`.
2. Set env var `VITE_API_URL=https://<your-backend-domain>/api`.

**Custom domain**: optional, point it at the frontend host; update `ALLOWED_HOSTS` and `CORS_ALLOWED_ORIGINS` on the backend accordingly.
