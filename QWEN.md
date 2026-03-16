# AI Job Applier - Project Context

## Project Overview

AI Job Applier is an AI-powered job application system built as a **TypeScript monorepo** with a **microservices architecture**. The system automates job discovery, application tracking, and user profile management.

### Architecture

**Monorepo Structure:**
- **apps/** - Individual microservices and frontend
  - `frontend/` - Next.js 16 web application (React 19, TailwindCSS 4, Jest)
  - `api-gateway/` - Express.js API gateway (port 8080)
  - `user-service/` - User management (port 3001, gRPC support)
  - `auth-service/` - Authentication & JWT (port 3002)
  - `job-discovery-service/` - Job scraping & discovery (port 3003)
- **packages/** - Shared libraries
  - `@ai-job-applier/shared` - Common utilities
  - `@ai-job-applier/database` - MongoDB connection & Mongoose models
  - `@ai-job-applier/auth` - Authentication utilities
  - `@ai-job-applier/utils` - General utilities
  - `@ai-job-applier/types` - Shared TypeScript types
- **docker/** - Containerization configuration
- **docs/** - Documentation
- **.github/workflows/** - CI/CD pipelines

### Technology Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 16, React 19, TailwindCSS 4, TypeScript, Jest, Testing Library |
| **Backend** | Node.js 18+, Express.js, TypeScript, gRPC |
| **Database** | MongoDB 6.0 (Mongoose ODM) |
| **Cache/Queue** | Redis 7 |
| **Auth** | JWT, bcryptjs, Joi validation |
| **Job Scraping** | Cheerio, Playwright |
| **Containerization** | Docker, Docker Compose |
| **CI/CD** | GitHub Actions (lint, test, build, security scans, Docker deploy) |
| **Monitoring** | OpenTelemetry (SDK Node, OTLP exporter) |

## Building and Running

### Prerequisites
- Node.js 18+
- Docker & Docker Compose (for containerized deployment)
- MongoDB (for local development without Docker)

### Installation
```bash
npm install
```

### Development Mode
```bash
# Run all services (frontend + backend microservices)
npm run dev

# Run backend services only
npm run dev:backend

# Run frontend only
npm run dev:frontend

# Run specific service
npm run dev --workspace=user-service
npm run dev --workspace=auth-service
npm run dev --workspace=job-discovery-service
npm run dev --workspace=api-gateway
npm run dev --workspace=frontend
```

### Testing
```bash
# Run all tests
npm test

# Run tests for specific workspace
npm test --workspace=user-service

# Frontend test commands (from apps/frontend/)
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report
```

### Building
```bash
# Build all workspaces
npm run build

# Lint all code
npm run lint
```

### Docker Deployment
```bash
# Build Docker images
npm run docker:build

# Start all containers
npm run docker:up

# Stop containers
npm run docker:down
```

### Service Ports

| Service | Port | Description |
|---------|------|-------------|
| Frontend | 3000 | Next.js web application |
| API Gateway | 8080 | Request routing & auth middleware |
| User Service | 3001 | User profile management |
| Auth Service | 3002 | JWT authentication |
| Job Discovery | 3003 | Job scraping & aggregation |
| MongoDB | 27017 | Database |
| Redis | 6379 | Caching/queues |

## Development Conventions

### Code Style
- **TypeScript** throughout all services and packages
- **ESLint** configuration: `@typescript-eslint/recommended`
- **Formatting**: 2-space indentation, single quotes, semicolons required
- **Path aliases**: Configured in root `tsconfig.json` for shared packages

### Testing Practices
- **Jest** for unit/integration testing
- **Testing Library** (React Testing Library, user-event) for frontend
- **supertest** for API endpoint testing
- **mongodb-memory-server** for isolated database tests
- TDD approach encouraged

### Frontend Architecture (Next.js)
```
apps/frontend/src/
├── app/          # Next.js 13+ App Router pages
├── entities/     # Domain entities/models
├── services/     # API service layer
├── shared/       # Shared utilities/components
├── ui/           # UI components
└── use-cases/    # Business logic/use cases
```

### Backend Architecture (Clean Architecture)
- **Controllers** - HTTP request handling
- **Services** - Business logic
- **Models** - Database schemas (Mongoose)
- **Routes** - Endpoint definitions
- **Middleware** - Auth, validation, error handling

### Security
- JWT authentication with refresh tokens
- Input validation with Joi
- Helmet for HTTP security headers
- CORS configuration
- Rate limiting at API gateway
- Password hashing with bcryptjs

### Environment Variables
Required `.env` configuration:
```env
JWT_SECRET=your-super-secret-jwt-key
MONGODB_URI=mongodb://admin:password@localhost:27017/ai-job-applier?authSource=admin
REDIS_URL=redis://localhost:6379
NODE_ENV=development
```

## CI/CD Pipeline

The GitHub Actions workflow (`.github/workflows/ci-cd.yml`) includes:
1. **Test Job** - Lint, test, build on Node 18.x & 20.x
2. **Security Job** - npm audit, Snyk, CodeQL, Trivy scans
3. **Docker Job** - Build and push images on main branch
4. **Docker Security** - Trivy scan of Docker images
5. **Compliance** - Semgrep secret detection

## Key Documentation

| Document | Location |
|----------|----------|
| Architecture | `docs/architecture.md` |
| Development Guide | `docs/development-guide.md` |
| API Documentation | `docs/api-documentation.md` |
| Deployment Guide | `docs/deployment-guide.md` |
| Contribution Guide | `docs/contribution-guide.md` |
| Git Flow Strategy | `docs/gitflow-strategy.md` |

## Git Workflow

- **main** - Production-ready code
- **develop** - Integration branch for features
- **feature/** - Feature branches
- Push to main triggers CI/CD pipeline

## Common Tasks

### Adding a new shared package
1. Create directory in `packages/`
2. Add to root `package.json` workspaces
3. Export public API in `src/index.ts`
4. Add path alias in root `tsconfig.json`

### Adding a new service
1. Create directory in `apps/`
2. Add to root `package.json` workspaces
3. Create Dockerfile
4. Add to `docker-compose.yml`

### Frontend component structure
Follow the `src/` layer architecture:
- UI components → `ui/`
- Business logic → `use-cases/`
- API calls → `services/`
- Types/models → `entities/`
