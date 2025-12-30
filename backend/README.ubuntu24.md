# Ubuntu 24.04 Backend Dockerfile

This Dockerfile is specifically designed for building the backend on Ubuntu 24.04 (Noble Numbat).

## Features

- **Base Image**: Ubuntu 24.04 LTS
- **Python Version**: 3.12 (default in Ubuntu 24.04)
- **PostgreSQL Client**: Native Ubuntu 24.04 packages
- **Optimized**: Minimal image size with only necessary dependencies

## Building

### Build the image:
```bash
docker build -f Dockerfile.ubuntu24 -t asset-compass-backend:ubuntu24 .
```

### Run the container:
```bash
docker run -p 8000:8000 \
  -e DATABASE_URL=postgresql://user:password@postgres:5432/cmdb \
  asset-compass-backend:ubuntu24
```

## Using with Docker Compose

To use this Dockerfile with docker-compose, modify your `docker-compose.yml`:

```yaml
services:
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile.ubuntu24
    ports:
      - "8000:8000"
    environment:
      DATABASE_URL: postgresql://cmdb_user:cmdb_password@postgres:5432/cmdb
    depends_on:
      - postgres
```

## Differences from Standard Dockerfile

| Feature | Standard (python:3.11-slim) | Ubuntu 24.04 |
|---------|----------------------------|--------------|
| Base OS | Debian Bookworm | Ubuntu 24.04 Noble |
| Python Version | 3.11 | 3.12 |
| Image Size | ~180 MB | ~250 MB |
| PostgreSQL Client | From Debian repos | From Ubuntu repos |
| Build Tools | Minimal | Includes build-essential |

## Python Version Compatibility

Ubuntu 24.04 ships with Python 3.12 by default. If you need Python 3.11, you can:

1. Install from deadsnakes PPA:
```dockerfile
RUN apt-get update && \
    apt-get install -y software-properties-common && \
    add-apt-repository ppa:deadsnakes/ppa && \
    apt-get update && \
    apt-get install -y python3.11 python3.11-venv python3.11-dev
```

2. Or modify the Dockerfile to use `python:3.11-slim` instead of `ubuntu:24.04`

## Troubleshooting

### Issue: pip not found
**Solution**: The Dockerfile creates symbolic links for `python` and `pip`. If issues persist, use `python3.12 -m pip` instead.

### Issue: PostgreSQL connection errors
**Solution**: Ensure the `DATABASE_URL` environment variable is correctly set and the PostgreSQL service is running.

### Issue: Build fails on dependencies
**Solution**: The `build-essential` package includes compilers needed for some Python packages. If specific dependencies fail, install additional dev packages:
```dockerfile
RUN apt-get install -y libssl-dev libffi-dev python3.12-dev
```

## Security Considerations

- Ubuntu 24.04 LTS receives security updates until 2029 (standard support) and 2034 (extended security maintenance)
- The DEBIAN_FRONTEND is reset after apt operations
- No unnecessary packages are installed (--no-install-recommends)
- Build cache is cleaned to reduce image size

## Performance

For production deployments, consider:
1. Using multi-stage builds to reduce final image size
2. Running as non-root user
3. Using health checks
4. Setting resource limits

Example with non-root user:
```dockerfile
# Add before CMD
RUN useradd -m -u 1000 appuser && \
    chown -R appuser:appuser /app
USER appuser
```

