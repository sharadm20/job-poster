# Contributing to AI Job Applier

Thank you for your interest in contributing to the AI Job Applier project! This document outlines the process for contributing to this repository.

## Table of Contents
- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Pull Request Process](#pull-request-process)
- [Style Guides](#style-guides)
- [Testing](#testing)
- [Questions](#questions)

## Code of Conduct

This project and everyone participating in it is governed by the [AI Job Applier Code of Conduct](code-of-conduct.md). By participating, you are expected to uphold this code.

## Getting Started

### 1. Fork the Repository
Fork the repository on GitHub and clone your fork:

```bash
git clone https://github.com/YOUR-USERNAME/ai-job-applier.git
cd ai-job-applier
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Environment
Copy the `.env.example` file to `.env` and configure your environment variables:

```bash
cp .env.example .env
```

### 4. Run the Application
```bash
npm run dev
```

## Development Workflow

### 1. Find an Issue
- Check the [Issues](https://github.com/your-repo/ai-job-applier/issues) page for available tasks
- If you want to add a new feature, create an issue first to discuss it

### 2. Create a Branch
Use the following naming convention for your branch:
- `feature/your-feature-name` - for new features
- `bugfix/issue-description` - for bug fixes
- `docs/documentation-topic` - for documentation updates

```bash
git checkout -b feature/amazing-feature
```

### 3. Make Changes
- Follow the [style guides](#style-guides)
- Write tests for your changes
- Update documentation if necessary

### 4. Commit Changes
Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <short summary>
```

Common types:
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, missing semi colons, etc)
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `test`: Adding missing tests or correcting existing tests

Example:
```
feat(user-service): add user profile update endpoint
fix(auth): resolve token expiration issue
docs: update development guide
```

## Pull Request Process

### 1. Update Your Branch
Rebase your branch on the latest main branch:

```bash
git checkout main
git pull origin main
git checkout your-branch
git rebase main
```

### 2. Run Tests
Ensure all tests pass:

```bash
npm test
npm run build
```

### 3. Push Your Branch
```bash
git push origin your-branch
```

### 4. Create Pull Request
- Go to the repository on GitHub
- Click "Compare & pull request"
- Fill out the pull request template:
  - Brief summary of changes
  - Issue numbers that this PR addresses
  - Any relevant context

### 5. Address Feedback
- Respond to review comments
- Make requested changes
- Push updates to your branch (the PR will update automatically)

## Style Guides

### TypeScript
- Follow the [Google TypeScript Style Guide](https://google.github.io/styleguide/tsguide.html)
- Use meaningful variable and function names
- Keep functions small and focused
- Use interfaces for object shapes
- Prefer const over let when possible
- Use strict mode

### Git Commit Messages
- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Capitalize the first letter of the subject line
- Use the body to explain what and why vs. how

### File Naming
- Use kebab-case for file names: `user-service.ts`
- Use PascalCase for class names: `UserService.ts`
- Use camelCase for function and variable names: `createUser`

## Testing

### Test Structure
- Place tests next to their corresponding source files
- Use `.test.ts` extension for test files
- Follow the pattern: `src/some-feature.ts` → `src/some-feature.test.ts`

### Writing Tests
- Test all business logic thoroughly
- Use descriptive test names
- Follow the AAA pattern (Arrange, Act, Assert)
- Test both happy and unhappy paths
- Aim for 80%+ code coverage

### Running Tests
```bash
# Run all tests
npm test

# Run tests for a specific workspace
npm test --workspace=user-service

# Run tests with coverage
npm run test:coverage --workspace=user-service
```

## Documentation

### Code Documentation
- Document complex functions with JSDoc comments
- Explain the "why" not just the "what"
- Update documentation when changing functionality

### Project Documentation
- Update `README.md` for major changes
- Update `docs/` for user guides
- Keep API documentation up to date

## Questions

If you have any questions about the contribution process, feel free to:
- Open an issue
- Contact the maintainers
- Check the `docs/` directory for additional information

Thank you for contributing to AI Job Applier!