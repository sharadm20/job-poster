# System Architecture

## Overview

The AI Job Applier system is built as a microservices architecture using Node.js, TypeScript, and modern cloud-native technologies. The system is designed to be scalable, maintainable, and secure.

## Architecture Diagram

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   User Client   │────│  API Gateway     │────│  Load Balancer  │
│  (Web/Mobile)   │    │ (Authentication, │    │ (Production)    │
└─────────────────┘    │ Routing, CORS)   │    └─────────────────┘
                       └──────────────────┘              │
                              │                          │
              ┌───────────────┼──────────────────────────┘
              │               │
         ┌────▼────┐    ┌─────▼─────┐
         │  Auth   │    │  User     │
         │ Service │    │ Service   │
         │(JWT,    │    │(User      │
         │OAuth)   │    │Profiles)  │
         └─────────┘    └───────────┘
              │               │
              │               │
    ┌─────────▼───────────────▼──────────┐
    │            MongoDB Cluster         │
    │        (User Data, Jobs)           │
    └────────────────────────────────────┘
              │               │
              │               │
         ┌────▼────┐    ┌─────▼─────┐
         │ Job     │    │   Redis   │
         │Discovery│    │(Caching,  │
         │Service  │    │Queues)    │
         │(Scraping│    └───────────┘
         │Jobs)    │
         └─────────┘
              │
    ┌─────────▼─────────┐
    │   External Job    │
    │   Boards APIs     │
    │(LinkedIn, Indeed, │
    │ Glassdoor, etc.) │
    └───────────────────┘
```

## Services

### API Gateway
- **Purpose**: Routes requests to appropriate services, handles cross-cutting concerns
- **Technology**: Node.js, Express, http-proxy-middleware
- **Responsibilities**:
  - Request routing
  - Authentication middleware
  - CORS handling
  - Request/response logging
  - Rate limiting

### Auth Service
- **Purpose**: Handles authentication and authorization
- **Technology**: Node.js, Express, JSON Web Tokens
- **Responsibilities**:
  - User registration and login
  - JWT token generation and validation
  - Password hashing
  - OAuth integration (planned)

### User Service
- **Purpose**: Manages user profiles and preferences
- **Technology**: Node.js, Express, Mongoose
- **Responsibilities**:
  - User profile management
  - Job preferences
  - Personal information storage
  - Resume/CV management

### Job Discovery Service
- **Purpose**: Discovers and scrapes job listings
- **Technology**: Node.js, Express, Cheerio, Playwright
- **Responsibilities**:
  - Job board scraping
  - Job data normalization
  - Job filtering and matching
  - Scheduling periodic scraping

## Data Flow

1. **User Registration/Login**:
   - User sends credentials to Auth Service
   - Auth Service validates credentials and creates JWT
   - Token returned to client

2. **Job Discovery**:
   - User requests job search to API Gateway
   - API Gateway authenticates token
   - Request forwarded to Job Discovery Service
   - Service scrapes job boards and returns results

3. **Profile Management**:
   - User sends profile update to API Gateway
   - Request forwarded to User Service
   - Data stored in MongoDB

## Technology Stack

### Backend
- **Runtime**: Node.js 18+
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: MongoDB
- **Caching**: Redis
- **Message Queue**: Redis (planned: Apache Kafka/RabbitMQ)

### Infrastructure
- **Containerization**: Docker
- **Orchestration**: Docker Compose, Kubernetes
- **CI/CD**: GitHub Actions
- **Monitoring**: Prometheus/Grafana (planned)

### Security
- **Authentication**: JWT with refresh tokens
- **Password Hashing**: bcrypt
- **Input Validation**: Joi
- **API Security**: Helmet, CORS, rate limiting

## Scalability Considerations

### Horizontal Scaling
- Statelessness: Services don't maintain session state
- Database Sharding: MongoDB sharding for large datasets
- Load Balancing: Distribute requests across service instances

### Caching
- Redis for session storage and frequently accessed data
- API response caching
- Database query result caching

### Asynchronous Processing
- Background job processing for scraping
- Message queues for decoupling services
- Event-driven architecture patterns

## Security Features

### Authentication & Authorization
- JWT-based authentication
- Role-based access control
- Secure token storage
- Regular token rotation

### Data Protection
- Encrypted database connections
- Password hashing at rest
- Input sanitization
- SQL injection prevention

### API Security
- Rate limiting
- CORS configuration
- Input validation
- Authentication middleware