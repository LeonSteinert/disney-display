# Multi-stage build for Disney Raspberry Pi Display

# Stage 1: Build dependencies
FROM node:22-bookworm-slim AS base

# Install Python 3, build tools and required system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    git \
    python3-pip \
    python3-dev \
    python3-venv \
    build-essential \
    gcc \
    libopenjp2-7 \
    libtiff6 \
    libatlas-base-dev \
    && rm -rf /var/lib/apt/lists/* \

# Install Python dependencies
RUN pip3 install \
    Pillow \
    spidev \
    RPi.GPIO \
    gpiozero

# Set PYTHONPATH so Python can find the waveshare library
ENV PYTHONPATH="/app/python/lib:${PYTHONPATH}"

# Expose port (adjust if your NestJS app uses a different port)
EXPOSE 3000

# Start the Node.js application
CMD ["sh", "-c", "cd /var/disney-display && git pull && cd /var/disney-display/angular-frontend && npm i && npm run build && cd /var/disney-display && npm i && npm run build && npm run start:prod"]