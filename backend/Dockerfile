FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
# Support for Debian, Ubuntu, and Alpine
RUN if [ -f /etc/debian_version ] || [ -f /etc/lsb-release ]; then \
        apt-get update && \
        apt-get install -y --no-install-recommends \
            postgresql-client \
            && rm -rf /var/lib/apt/lists/*; \
    elif [ -f /etc/alpine-release ]; then \
        apk add --no-cache postgresql-client; \
    fi

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Expose port
EXPOSE 8000

# Run migrations and start the application
CMD ["sh", "-c", "alembic upgrade head && uvicorn app.main:app --host 0.0.0.0 --port 8000"]

