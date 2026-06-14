# Containerization instructions

This repository was prepared for containerization. Created artifacts:

- `backend/Dockerfile` — multi-stage build (Maven build stage, runtime stage with Eclipse Temurin JRE 25)
- `Dockerfile` — frontend build (Node 20 builder + nginx static server)
- `.dockerignore` (root) and `backend/.dockerignore`
- `.github/workflows/docker-build.yml` — CI workflow to build images (manual `workflow_dispatch`)

Local build instructions (PowerShell):

```powershell
# Build backend (from repo root)
Set-Location 'C:\Users\Admin\Downloads\CRM-main\CRM-main\backend'
docker build -t crm-backend:local -f Dockerfile .

# Build frontend (from repo root)
Set-Location 'C:\Users\Admin\Downloads\CRM-main\CRM-main'
docker build -t crm-frontend:local -f Dockerfile .
```

Local build instructions (Bash):

```bash
# Build backend
cd backend
docker build -t crm-backend:local -f Dockerfile .

# Build frontend
cd ..
docker build -t crm-frontend:local -f Dockerfile .
```

If `docker` is not installed on your machine, install Docker Desktop (Windows/macOS) or Docker Engine (Linux). After installation, re-run the commands above.

CI build (GitHub Actions): trigger the `Build Docker images` workflow in `.github/workflows/docker-build.yml` via the Actions UI or `workflow_dispatch` event.

Notes:

- If you want images pushed to a container registry, update the workflow with credentials and set `push: true` in the Docker build steps.
- If you prefer a different base image for runtime (e.g., distroless or Microsoft images), update the `backend/Dockerfile` accordingly.
