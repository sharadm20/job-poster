# Use the official Node.js 18 image
# https://hub.docker.com/_/node
FROM node:18-alpine AS builder

# Set the working directory
WORKDIR /usr/src/app

# Install build dependencies
RUN apk add --no-cache python3 make g++

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./
COPY apps/job-discovery-service/package*.json ./apps/job-discovery-service/
COPY packages/auth/package*.json ./packages/auth/
COPY packages/database/package*.json ./packages/database/
COPY packages/shared/package*.json ./packages/shared/
COPY packages/types/package*.json ./packages/types/
COPY packages/utils/package*.json ./packages/utils/

# Install all dependencies
RUN npm ci --legacy-peer-deps

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./
COPY apps/job-discovery-service/package*.json ./apps/job-discovery-service/
COPY packages/auth/package*.json ./packages/auth/
COPY packages/database/package*.json ./packages/database/
COPY packages/shared/package*.json ./packages/shared/
COPY packages/types/package*.json ./packages/types/
COPY packages/utils/package*.json ./packages/utils/

# Install only production dependencies
RUN npm ci --legacy-peer-deps --only=production

# Copy built application from the builder stage
COPY --from=builder /usr/src/app/apps ./apps
COPY --from=builder /usr/src/app/packages ./packages

# Expose the port the app runs on
EXPOSE 3000

# Run the application
CMD [ "node", "apps/job-discovery-service/dist/index.js" ]