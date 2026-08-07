# --- Frontend build stage ---
FROM node:20-slim AS frontend-builder
WORKDIR /frontend
COPY frontend/package.json frontend/package-lock.json* ./
RUN npm install
COPY frontend/ .
RUN npm run build

# --- Django app ---
FROM python:3.12-slim

WORKDIR /app

EXPOSE 8000

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        build-essential \
        python3-dev && \
    rm -rf /var/lib/apt/lists/*

COPY backend/requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ /app/

# Bring in the built React app (config/settings.py expects it at ../frontend/dist)
COPY --from=frontend-builder /frontend/dist /frontend/dist

RUN python manage.py collectstatic --noinput --upload-unhashed-files

# Migrations run against whatever DATABASE_URL is provided at container start,
# not at build time (the image doesn't know the runtime database yet).
CMD ["sh", "-c", "python manage.py migrate --noinput && gunicorn config.wsgi:application --bind 0.0.0.0:8000"]
