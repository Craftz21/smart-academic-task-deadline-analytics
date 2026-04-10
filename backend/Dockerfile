# ── Backend Dockerfile ────────────────────────────────────────────────────────
# Python 3.12 slim — lightweight base image
FROM python:3.12-slim

# Metadata
LABEL maintainer="AcademiQ Team"
LABEL description="AcademiQ Flask Backend API"

# Set working directory inside container
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
 && rm -rf /var/lib/apt/lists/*

# Copy requirements first (Docker layer cache optimisation)
COPY requirements.txt .

# Install Python dependencies (no cache to keep image small)
RUN pip install --no-cache-dir -r requirements.txt

# Copy application source code
COPY . .

# Create a volume mount point for persistent SQLite DB
VOLUME ["/app/data"]

# Expose Flask port
EXPOSE 5000

# Health check — Docker will monitor this
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:5000/ || exit 1

# Environment variables
ENV FLASK_ENV=development
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Run Flask
CMD ["python3", "app.py"]
