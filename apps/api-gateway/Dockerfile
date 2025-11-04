# Use the official Node.js 18 image
# https://hub.docker.com/_/node
FROM node:18-alpine

# Set the working directory
WORKDIR /usr/src/app

# Copy root package files
COPY package*.json ./
COPY apps/api-gateway/package*.json ./apps/api-gateway/
COPY packages/shared/package*.json ./packages/shared/
COPY packages/auth/package*.json ./packages/auth/
COPY packages/types/package*.json ./packages/types/

# Install all dependencies
RUN npm ci

# Copy the rest of the application
COPY . .

# Build the application
RUN npm run build --workspace=api-gateway
RUN npm run build --workspace=packages/shared
RUN npm run build --workspace=packages/auth
RUN npm run build --workspace=packages/types

# Expose the port the app runs on
EXPOSE 8080

# Run the application
CMD [ "node", "apps/api-gateway/dist/index.js" ]