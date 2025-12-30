FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
# Support for Debian, Ubuntu, and Alpine
RUN --mount=type=cache,target=/var/cache/apt,sharing=locked,id=apt \
    apt-get update && \
    apt-get install --no-install-recommends -y libpq-dev curl gnupg2 lsb-release apt-transport-https ca-certificates && \
    rm -rf /var/lib/apt/lists/*

# Add the PGDG apt repo
RUN echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list

# Trust the PGDG gpg key
RUN curl -fsSL https://www.postgresql.org/media/keys/ACCC4CF8.asc| gpg --dearmor -o /etc/apt/trusted.gpg.d/postgresql.gpg

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        postgresql-client \
        && rm -rf /var/lib/apt/lists/*; 

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Expose port
EXPOSE 8000

# Run migrations and start the application
CMD ["sh", "-c", "alembic upgrade head && uvicorn app.main:app --host 0.0.0.0 --port 8000"]

