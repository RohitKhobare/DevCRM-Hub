# DevCRM Hub

DevCRM Hub is a lightweight CRM, marketplace and SaaS starter built with Spring Boot (backend) and Vite + React + TypeScript (frontend).

## Author

- **Name:** Rohit Manesh Khobare
- **Email:** rohitkhobare2005@gmail.com
- **GitHub:** https://github.com/RohitKhobare

## Quickstart (local)

1. Backend: ensure JDK 21 is installed, then:

```powershell
cd backend
mvn -DskipTests clean package
$env:SPRING_DATASOURCE_URL='jdbc:h2:mem:testdb'
$env:SPRING_DATASOURCE_USERNAME='sa'
$env:SPRING_DATASOURCE_PASSWORD=''
$env:SPRING_JPA_DATABASE_PLATFORM='org.hibernate.dialect.H2Dialect'
java -jar target/backend-0.0.1-SNAPSHOT.jar
```

2. Frontend: from repo root:

```powershell
npm ci
npm run dev
# open http://localhost:5173
```

## Containerization

Dockerfiles and CI workflow are provided to build and push images to GitHub Container Registry. See `.github/workflows/docker-build.yml` and `scripts/build-and-push.ps1`.

