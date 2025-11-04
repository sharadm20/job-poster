# Development Guide for AI Job Applier

This guide explains how to set up, develop, and contribute to the AI Job Applier project.

## Project Structure

```
ai-job-applier/
├── apps/                    # Application services
│   ├── user-service/        # User management service
│   ├── auth-service/        # Authentication service  
│   ├── job-discovery-service/ # Job discovery & scraping
│   └── api-gateway/         # API Gateway & routing
├── packages/                # Shared packages
│   ├── shared/              # Common utilities
│   ├── database/            # Database connection & models
│   ├── auth/                # Authentication utilities
│   ├── utils/               # General utilities
│   └── types/               # Shared type definitions
├── docker/                  # Docker configuration
│   └── compose/             # Docker compose files
├── docs/                    # Documentation
├── scripts/                 # Build & deployment scripts
├── tests/                   # Test suites
│   └── integration/         # Integration tests
└── tools/                   # Development tools
```

## Prerequisites

- Node.js 18+
- Docker & Docker Compose
- MongoDB (or Docker for local development)

## Getting Started

### 1. Installation

First, clone the repository and install dependencies:

```bash
git clone <repository-url>
cd ai-job-applier
npm install
```

### 2. Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# JWT Secret for authentication
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/ai-job-applier

# Redis Connection (optional, for caching/queues in production)
REDIS_URL=redis://localhost:6379

# Node Environment
NODE_ENV=development
```

### 3. Running in Development Mode

To run all services in development mode with hot reloading:

```bash
npm run dev
```

To run a specific service:

```bash
npm run dev --workspace=user-service
npm run dev --workspace=auth-service
npm run dev --workspace=job-discovery-service
npm run dev --workspace=api-gateway
```

## Architecture

### Services

#### User Service
- **Port**: 3001
- **Purpose**: Manages user profiles, personal information, and job preferences
- **Endpoints**:
  - `POST /api/users/register` - Register a new user
  - `GET /api/users/:id` - Get user by ID
  - `GET /api/users/email/:email` - Get user by email
  - `PUT /api/users/:id` - Update user information
  - `DELETE /api/users/:id` - Delete user

#### Auth Service
- **Port**: 3002
- **Purpose**: Handles authentication and JWT token management
- **Endpoints**:
  - `POST /api/auth/register` - Register new user and get JWT token
  - `POST /api/auth/login` - Login and get JWT token
  - `GET /api/auth/verify` - Verify JWT token

#### Job Discovery Service
- **Port**: 3003
- **Purpose**: Discovers and scrapes job listings from various sources
- **Endpoints**:
  - `GET /api/jobs` - Get all jobs
  - `GET /api/jobs/user` - Get jobs for authenticated user
  - `GET /api/jobs/:id` - Get specific job by ID
  - `POST /api/jobs/scrape` - Start job scraping process

#### API Gateway
- **Port**: 8080
- **Purpose**: Routes requests to appropriate services, handles authentication
- **Endpoints**: Proxies to other services

### Shared Packages

#### @ai-job-applier/shared
Contains common utilities, constants, and functions used across services.

#### @ai-job-applier/types
Contains shared TypeScript type definitions.

#### @ai-job-applier/utils
Contains general utility functions for validation, hashing, etc.

#### @ai-job-applier/database
Contains database connection logic and Mongoose models.

#### @ai-job-applier/auth
Contains authentication utilities for JWT handling.

## Development Best Practices

### 1. Code Style
- Follow TypeScript best practices
- Use meaningful variable and function names
- Maintain consistent formatting
- Use ESLint for linting: `npm run lint`

### 2. Testing
- Write unit tests for all business logic
- Follow Test-Driven Development (TDD) where possible
- Maintain high test coverage
- Run tests with: `npm test`

### 3. API Design
- Follow RESTful API principles
- Use consistent error response format
- Validate input data
- Use appropriate HTTP status codes

### 4. Security
- Sanitize all user inputs
- Use environment variables for secrets
- Implement proper authentication
- Follow OWASP security guidelines

## Adding New Features

### 1. Creating a New Service
1. Create a new workspace in `apps/`
2. Add it to the root `package.json` workspaces
3. Follow the same structure as existing services
4. Use shared packages where appropriate

### 2. Creating a New Shared Package
1. Create a new package in `packages/`
2. Add it to the root `package.json` workspaces if needed
3. Follow the same structure as existing packages
4. Export public APIs in `src/index.ts`

### 3. Adding New API Endpoints
1. Define the endpoint in the appropriate service
2. Create controller function
3. Create service function for business logic
4. Add route definition
5. Write tests
6. Update documentation

## Building and Deployment

### Local Build
```bash
npm run build
```

### Docker Build
```bash
npm run docker:build
```

### Run with Docker Compose
```bash
npm run docker:up
```

## Testing

### Run All Tests
```bash
npm test
```

### Run Tests for Specific Service
```bash
npm test --workspace=user-service
```

### Run Tests with Coverage
```bash
npm run test:coverage --workspace=user-service
```

## Troubleshooting

### Common Issues

1. **Port Already in Use**
   - Check if services are already running
   - Kill processes using the port: `lsof -ti:3001 | xargs kill`

2. **MongoDB Connection Issues**
   - Ensure MongoDB is running locally or Docker containers are up
   - Check connection string in `.env` file

3. **NPM Workspace Issues**
   - Run `npm install` in the root directory
   - Check that all workspaces are correctly defined in root `package.json`

For additional help, check the documentation in the `docs/` directory or create an issue in the repository.