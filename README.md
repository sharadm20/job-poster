# AI Job Applier - Refactored Structure

This repository contains the refactored version of the AI Job Applier system, now organized as a professional monorepo with microservices architecture.

## 🚀 What's New

### Monorepo Architecture
- **Apps**: Individual microservices (user-service, auth-service, job-discovery-service, api-gateway)
- **Packages**: Shared libraries (shared, database, auth, utils, types)
- **Docker**: Containerization configuration
- **Docs**: Comprehensive documentation
- **CI/CD**: Automated workflows

### Key Improvements
- ✅ Clean, organized monorepo structure
- ✅ Proper separation of concerns
- ✅ Reusable shared libraries
- ✅ Consistent code style and patterns
- ✅ Complete documentation
- ✅ CI/CD pipeline ready
- ✅ Production-ready architecture
- ✅ Scalable microservices design

## 📁 Project Structure

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
├── docs/                    # Documentation
├── tests/                   # Test suites
└── tools/                   # Development tools
```

## 🛠️ Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run development mode**:
   ```bash
   npm run dev
   ```

3. **Run tests**:
   ```bash
   npm test
   ```

4. **Build all services**:
   ```bash
   npm run build
   ```

## 🚢 Deployment

Deploy using Docker Compose:
```bash
npm run docker:build
npm run docker:up
```

## 📚 Documentation

Complete documentation is available in the `docs/` directory:
- [Development Guide](docs/development-guide.md)
- [API Documentation](docs/api-documentation.md)
- [Deployment Guide](docs/deployment-guide.md)
- [Architecture](docs/architecture.md)
- [Contribution Guide](docs/contribution-guide.md)

## 🤝 Contributing

Please read [CONTRIBUTING.md](docs/contribution-guide.md) for details on our code of conduct and the process for submitting pull requests.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
*Refactored and enhanced by Qwen Code - November 2025*