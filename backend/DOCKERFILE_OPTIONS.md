# Backend Dockerfile Options

This directory contains multiple Dockerfile variants optimized for different base systems.

## Available Dockerfiles

### 1. `Dockerfile` (Default - Multi-distro Support)
**Base**: `python:3.11-slim` (Debian Bookworm)
**Best for**: General use, production deployments, CI/CD pipelines

**Features**:
- ✅ Auto-detects Debian, Ubuntu, or Alpine
- ✅ Smallest image size (~180 MB)
- ✅ Python 3.11
- ✅ Official Python image with optimizations
- ✅ Works across different environments

**Build**:
```bash
docker build -t asset-compass-backend .
```

### 2. `Dockerfile.ubuntu24` (Ubuntu 24.04 Specific)
**Base**: `ubuntu:24.04` (Noble Numbat)
**Best for**: Ubuntu-native environments, LTS stability, Python 3.12

**Features**:
- ✅ Ubuntu 24.04 LTS (supported until 2034)
- ✅ Python 3.12 (latest stable)
- ✅ Native Ubuntu packages
- ✅ Includes build-essential for complex dependencies
- ⚠️ Larger image size (~250 MB)

**Build**:
```bash
docker build -f Dockerfile.ubuntu24 -t asset-compass-backend:ubuntu24 .
```

## Comparison Table

| Feature | Dockerfile (Default) | Dockerfile.ubuntu24 |
|---------|---------------------|---------------------|
| **Base OS** | Debian Bookworm | Ubuntu 24.04 Noble |
| **Python Version** | 3.11 | 3.12 |
| **Image Size** | ~180 MB | ~250 MB |
| **Build Time** | Fast | Medium |
| **Package Manager** | apt (Debian) | apt (Ubuntu) |
| **PostgreSQL Client** | postgresql-client | postgresql-client |
| **Multi-distro Support** | Yes (Debian/Ubuntu/Alpine) | No (Ubuntu only) |
| **LTS Support Until** | 2026 (Debian 12) | 2034 (Ubuntu 24.04) |
| **Best Use Case** | Production, CI/CD | Ubuntu environments |

## Docker Compose Usage

### Default Dockerfile
```yaml
services:
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
```

### Ubuntu 24.04 Dockerfile
```yaml
services:
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile.ubuntu24
```

## When to Use Each

### Use `Dockerfile` (Default) when:
- 🎯 You want the smallest possible image
- 🎯 You're deploying to cloud platforms (AWS, GCP, Azure)
- 🎯 You need multi-architecture support (amd64, arm64)
- 🎯 You want official Python Docker image optimizations
- 🎯 You're using CI/CD pipelines (faster builds)

### Use `Dockerfile.ubuntu24` when:
- 🎯 Your production servers run Ubuntu 24.04
- 🎯 You need Python 3.12 specifically
- 🎯 You want maximum Ubuntu LTS support (until 2034)
- 🎯 You need Ubuntu-specific packages
- 🎯 You're matching your local development environment

## Environment Variables

Both Dockerfiles support the same environment variables:

```bash
DATABASE_URL=postgresql://user:password@host:5432/dbname
PYTHONUNBUFFERED=1
PYTHONDONTWRITEBYTECODE=1
```

## Building for Different Architectures

### AMD64 (x86_64)
```bash
docker build --platform linux/amd64 -t asset-compass-backend:amd64 .
```

### ARM64 (Apple Silicon, AWS Graviton)
```bash
docker build --platform linux/arm64 -t asset-compass-backend:arm64 .
```

### Multi-platform
```bash
docker buildx build --platform linux/amd64,linux/arm64 -t asset-compass-backend:latest .
```

## Performance Tips

1. **Use BuildKit** for faster builds:
   ```bash
   DOCKER_BUILDKIT=1 docker build -t asset-compass-backend .
   ```

2. **Layer caching**: Requirements are copied before code to cache pip installs

3. **Multi-stage builds**: Consider adding multi-stage for even smaller images

4. **Health checks**: Add to docker-compose.yml:
   ```yaml
   healthcheck:
     test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
     interval: 30s
     timeout: 10s
     retries: 3
   ```

## Security Best Practices

Both Dockerfiles follow security best practices:
- ✅ Non-root user support ready (commented in README)
- ✅ Minimal attack surface (no unnecessary packages)
- ✅ Latest security patches from base images
- ✅ No secrets in build layers

To run as non-root, add to either Dockerfile:
```dockerfile
RUN useradd -m -u 1000 appuser && \
    chown -R appuser:appuser /app
USER appuser
```

## Troubleshooting

### Issue: Different behavior between Dockerfiles
**Cause**: Ubuntu 24.04 uses Python 3.12, default uses Python 3.11
**Solution**: Test both if you notice compatibility issues

### Issue: Build fails on Ubuntu-specific packages
**Solution**: Use `Dockerfile.ubuntu24` which includes more build tools

### Issue: Image too large
**Solution**: Use default `Dockerfile` (Debian-based) for smaller size

## Questions?

For specific use cases, consult:
- `README.md` - General backend documentation
- `README.ubuntu24.md` - Ubuntu 24.04 specific details
- Docker documentation: https://docs.docker.com/

