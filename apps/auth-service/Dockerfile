# Use the official Node.js 18 image
# https://hub.docker.com/_/node
FROM node:18-alpine

# Set the working directory
WORKDIR /usr/src/app

# Copy root package files
COPY package*.json ./
COPY apps/auth-service/package*.json ./apps/auth-service/
COPY packages/shared/package*.json ./packages/shared/
COPY packages/database/package*.json ./packages/database/
COPY packages/auth/package*.json ./packages/auth/
COPY packages/utils/package*.json ./packages/utils/
COPY packages/types/package*.json ./packages/types/

# Install all dependencies
RUN npm ci

# Copy the rest of the application
COPY . .

# Build the application
RUN npm run build --workspace=auth-service
RUN npm run build --workspace=packages/shared
RUN npm run build --workspace=packages/database
RUN npm run build --workspace=packages/auth
RUN npm run build --workspace=packages/utils
RUN npm run build --workspace=packages/types

# Expose the port the app runs on
EXPOSE 3000

# Run the application
CMD [ "node", "apps/auth-service/dist/index.js" ]