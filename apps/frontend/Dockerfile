# Use the official Node.js 20 image
# https://hub.docker.com/_/node
FROM node:20-alpine

# Install bash shell (needed for some operations)
RUN apk add --no-cache bash

# Set the working directory
WORKDIR /usr/src/app

# Copy all package.json files from the monorepo
COPY package*.json ./
COPY apps/frontend/package*.json ./apps/frontend/
COPY packages/*/package*.json ./packages/

# Install all dependencies for the monorepo
RUN npm install --legacy-peer-deps

# Copy the rest of the source code
COPY . .

# Set working directory to frontend
WORKDIR /usr/src/app/apps/frontend

# Expose the port the app runs on
EXPOSE 3000

# Run the Next.js development server
CMD [ "npm", "run", "dev" ]