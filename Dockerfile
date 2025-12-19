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
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies (setuptools needed for node-gyp with Python 3.12+)
RUN pip3 install \
    setuptools \
    Pillow \
    spidev \
    RPi.GPIO \
    gpiozero

# Set working directory
WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install Node.js dependencies
RUN npm ci

# Copy source code
COPY . .

# Build NestJS application
RUN npm run build

RUN cd angular-frontend

RUN npm ci

RUN npm run build

COPY /app /var/disney-frontend

WORKDIR /var/disney-frontend

# Set PYTHONPATH so Python can find the waveshare library
ENV PYTHONPATH="/app/python/lib:${PYTHONPATH}"

# Expose port
EXPOSE 3000

# Start the Node.js application
CMD ["node", "dist/main"]