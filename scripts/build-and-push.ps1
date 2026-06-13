param(
    [string]$BackendTag = "crm-backend:local",
    [string]$FrontendTag = "crm-frontend:local",
    [switch]$Push
)

function Check-Docker {
    $docker = Get-Command docker -ErrorAction SilentlyContinue
    if (-not $docker) {
        Write-Error "Docker CLI not found. Please install Docker Desktop or Docker Engine and retry."
        exit 1
    }
}

Check-Docker

Write-Host "Building backend image..."
Push-Location backend
docker build -t $BackendTag -f Dockerfile .
Pop-Location

Write-Host "Building frontend image..."
docker build -t $FrontendTag -f Dockerfile .

if ($Push) {
    if (-not $env:DOCKER_USERNAME -or -not $env:DOCKER_PASSWORD) {
        Write-Error "Set DOCKER_USERNAME and DOCKER_PASSWORD environment variables before using -Push."
        exit 1
    }
    docker login -u $env:DOCKER_USERNAME -p $env:DOCKER_PASSWORD
    docker push $BackendTag
    docker push $FrontendTag
}

Write-Host "Done."
