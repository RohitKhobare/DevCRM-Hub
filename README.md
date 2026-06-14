# DevCRM Hub

DevCRM Hub is a starter CRM + marketplace application combining a Spring Boot backend and a Vite + React + TypeScript frontend. This README documents the project's languages, tools, requirements, local execution, containerization, CI/CD workflows, and deployment steps.

---

## Project Overview

- Backend: Spring Boot (Java + Maven)
- Frontend: React + TypeScript, built with Vite
- Database: PostgreSQL (production); H2 in-memory for local development
- Purpose: provide a minimal CRM and marketplace scaffold with authentication, basic profile management, and payment webhook stubs

## Author

- **Name:** Rohit Manesh Khobare
- **Email:** rohitkhobare2005@gmail.com
- **GitHub:** https://github.com/RohitKhobare

---

## Languages, Runtimes & Key Versions

- Java: 21 (LTS recommended for this repo)
- Node.js: 20.x (recommended)
- NPM or PNPM: NPM recommended (bundled with Node.js)
- Maven: 3.x (for backend build)

## Tools & Libraries

- Backend
  - Spring Boot 3.2.x
  - Spring Data JPA, Spring Security
  - HikariCP, Hibernate ORM
  - Razorpay Java client (payment integration)
  - H2 (dev runtime)
- Frontend
  - React 18+, TypeScript
  - Vite (dev server & build)
  - Tailwind CSS
  - lucide-react (icons)

## System Requirements

- JDK 21 installed and `JAVA_HOME` set
- Node.js 20.x installed
- Maven installed (or use the Maven wrapper if added)
- Git CLI
- Docker Desktop / Docker Engine (if running local image builds)

---

## Local Development (Windows PowerShell examples)

1. Start the backend locally (H2 in-memory for quick runs):

```powershell
cd backend
# build
mvn -DskipTests clean package

# run with H2 (development)
$env:SPRING_DATASOURCE_URL='jdbc:h2:mem:testdb'
$env:SPRING_DATASOURCE_USERNAME='sa'
$env:SPRING_DATASOURCE_PASSWORD=''
$env:SPRING_JPA_DATABASE_PLATFORM='org.hibernate.dialect.H2Dialect'
java -jar target/backend-0.0.1-SNAPSHOT.jar
# backend listens on port 8081 by default (see application.properties)
```

2. Run the frontend dev server (from repo root):

```powershell
npm ci
npm run dev
# open http://localhost:5173
```

3. API Endpoints

- Auth: `/api/auth/*`
- Profile: `/api/profile/*`
- Payments/webhooks: `/api/payment` and `/api/webhook`

Refer to the controller classes under `backend/src/main/java/com/devcrm/controller` for the exact routes and request/response shapes.

---

## Build (Production)

1. Backend (create executable JAR):

```powershell
cd backend
mvn -DskipTests clean package
# artifact: target/backend-0.0.1-SNAPSHOT.jar
```

2. Frontend (static build):

```powershell
npm ci
npm run build
# output located in ./dist
```

---

## Containerization (Docker)

This repository includes Dockerfiles and a helper script `scripts/build-and-push.ps1` for local builds and pushes. The CI workflow builds images remotely into the GitHub Container Registry (GHCR).

Local build (requires Docker):

```powershell
Set-Location .\scripts
.\build-and-push.ps1 -BuildOnly
# or run the top-level script from repo root: .\scripts\build-and-push.ps1
```

Image names and tags are configured in the script and CI. If you don't have Docker installed locally, the GitHub Actions workflow will build and push images for you.

---

## CI / CD (GitHub Actions)

- `/.github/workflows/docker-build.yml` — builds the backend JAR, builds frontend, builds Docker images, and pushes to `ghcr.io` (GitHub Container Registry). Triggers: pushes to `ci`, `main`, and PRs targeting `main`.
- `/.github/workflows/pages.yml` — (added) builds the frontend and publishes it to GitHub Pages.

What CI produces:

- GHCR images for backend and frontend (container images).
- A static frontend site deployed to GitHub Pages (URL shown in GitHub Pages settings after first successful deployment).

How to monitor CI:

1. Go to your repository on GitHub → Actions.
2. Inspect the workflow run for `docker-build.yml` or `pages.yml`.
3. When `docker-build.yml` succeeds, images will be pushed to `ghcr.io/<owner>/<repo>/<image>:<tag>` as configured in the workflow.

---

## GitHub Pages deployment (frontend)

The repository contains a workflow to build and deploy the frontend to GitHub Pages automatically on pushes to `ci` and `main`. After the workflow runs, the Pages URL will be available in the repository `Settings → Pages` or in the Action run summary.

---

## Accessing built container images (GHCR)

Once the CI workflow completes successfully, the images will be available under the GitHub Container Registry for this repository. Example image URL (replace owner/repo as appropriate):

```
ghcr.io/RohitKhobare/DevCRM-Hub/backend:ci
ghcr.io/RohitKhobare/DevCRM-Hub/frontend:ci
```

Use `docker pull <image>` with an authenticated registry session if the images are private.

---

## Deployment Options for the Backend

The CI builds and publishes a container image. To run the backend in production you can:

- Deploy to a container host (AKS, GKE, ECS, Azure Container Instances, DigitalOcean App Platform).
- Use a managed app service that supports containers (Azure App Service for Containers, AWS Elastic Beanstalk with Docker, Heroku container registry).

Example (running locally from GHCR):

```powershell
docker login ghcr.io -u <username> -p <personal-access-token>
docker pull ghcr.io/RohitKhobare/DevCRM-Hub/backend:ci
docker run -e SPRING_DATASOURCE_URL='jdbc:postgresql://<db-host>/<db>' -e SPRING_DATASOURCE_USERNAME=<user> -e SPRING_DATASOURCE_PASSWORD=<pw> -p 8081:8081 ghcr.io/RohitKhobare/DevCRM-Hub/backend:ci
```

---

## Project Workflow (developer perspective)

1. Create a feature branch from `main` (or `ci` for testing).
2. Implement backend or frontend changes.
3. Run backend locally with H2 and frontend with Vite for fast feedback.
4. Commit & push. Open a pull request targeting `main`.
5. CI runs tests/builds; merge after review.
6. `main` triggers the CI workflows which produce container images and deploy the frontend to Pages.

## Output Workflow (what gets produced)

- `target/backend-0.0.1-SNAPSHOT.jar` (backend executable jar)
- `dist/` (frontend static build)
- Docker images pushed to GHCR when CI succeeds
- GitHub Pages URL for frontend deployment

---

## Troubleshooting & Notes

- If you see class version issues, ensure `JAVA_HOME` points to JDK 21 and the `maven-compiler-plugin` is configured to use `21` in `backend/pom.xml`.
- If local Docker builds fail, install Docker Desktop (Windows) or Docker Engine and re-run `scripts/build-and-push.ps1`.
- The project includes H2 for development ease — switch to PostgreSQL in `application.properties` and environment variables for production.

---

## Next Steps I can perform for you

1. Trigger CI runs and monitor for success, then collect GHCR image URLs.
2. Provide the GitHub Pages site URL after deployment.
3. Help you deploy the backend image to a cloud provider (I can prepare an IaC plan or sample commands).

If you want me to proceed with CI monitoring and collecting the deployed links, confirm and I will watch the Actions runs and return the URLs.
