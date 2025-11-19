# GitFlow Branching Strategy

This document outlines the GitFlow branching strategy to be used for all development in the AI Job Applier project.

## Branch Structure

### Main Branches
- `main` - Production-ready code (protected branch)
- `develop` - Integration branch for features (protected branch)

### Supporting Branches
- `feature/*` - Feature development branches (e.g., `feature/graphql-api`, `feature/oauth-integration`)
- `release/*` - Release preparation branches (e.g., `release/v1.2.0`)
- `hotfix/*` - Urgent production fixes (e.g., `hotfix/security-patch`)

## Development Workflow

### 1. Starting New Feature Development
```bash
# Create feature branch from develop
git checkout develop
git pull origin develop
git checkout -b feature/your-feature-name
```

### 2. Working on Feature Branch
- Make commits to your feature branch
- Follow conventional commit messages:
  - `feat:` for new features
  - `fix:` for bug fixes
  - `docs:` for documentation
  - `style:` for code style changes
  - `refactor:` for refactoring
  - `test:` for tests
  - `chore:` for maintenance tasks

### 3. Completing Feature Development
```bash
# Rebase feature branch on latest develop
git checkout develop
git pull origin develop
git checkout feature/your-feature-name
git rebase develop

# Push feature branch
git push origin feature/your-feature-name

# Create pull request from feature branch to develop
# Title: "feat: Add new feature" or "fix: Resolve specific issue"
# Description: Include issue numbers and context
```

### 4. Release Process
```bash
# Create release branch from develop
git checkout develop
git pull origin develop
git checkout -b release/vX.Y.Z

# Update version numbers and finalize release
# Make final changes if needed

# Merge release into main
git checkout main
git pull origin main
git merge --no-ff release/vX.Y.Z
git push origin main

# Create Git tag
git tag -a vX.Y.Z -m "Release version X.Y.Z"
git push origin vX.Y.Z

# Merge release back into develop
git checkout develop
git merge --no-ff release/vX.Y.Z
git push origin develop

# Delete release branch
git branch -d release/vX.Y.Z
```

### 5. Hotfix Process
```bash
# Create hotfix branch from main
git checkout main
git pull origin main
git checkout -b hotfix/issue-description

# Apply fix and update version (patch version)

# Merge to main
git checkout main
git merge --no-ff hotfix/issue-description
git tag -a vX.Y.Z -m "Hotfix: description"
git push origin main

# Merge back to develop
git checkout develop
git merge --no-ff hotfix/issue-description
git push origin develop

# Delete hotfix branch
git branch -d hotfix/issue-description
```

## Pull Request Guidelines

### Before Creating PR
- Ensure your branch is up to date with the target branch
- Run all tests (`npm test`)
- Run linting (`npm run lint`)
- Run build (`npm run build`)

### PR Creation
- Target branch should be `develop` for features, `main` for releases
- Include issue numbers in description
- Follow the PR template if available
- Assign reviewers
- Add appropriate labels (feature, bug fix, enhancement, etc.)

### PR Review Process
- At least one team member must approve
- Check for proper tests
- Verify code follows established patterns
- Ensure backward compatibility is maintained
- Confirm documentation is updated if needed

## Best Practices

1. **Small Focused Commits** - Each commit should address a single concern
2. **Descriptive Messages** - Use clear, imperative commit messages
3. **Regular Syncing** - Rebase frequently on the target branch to minimize conflicts
4. **Working Code** - Ensure each commit on a branch passes tests
5. **Documentation** - Update documentation when making changes to public APIs
6. **Testing** - Add appropriate tests for new functionality

## Conventional Commits Format

```
<type>(<scope>): <short summary>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

Types:
- `feat`: New feature for the user
- `fix`: Bug fix for the user
- `docs`: Documentation changes
- `style`: Code style changes (formatting, missing semicolons, etc)
- `refactor`: Code changes that neither fix a bug nor add a feature
- `test`: Adding tests or refactoring tests
- `chore`: Build process, auxiliary tools, etc

This GitFlow strategy ensures stable releases while allowing active development on new features.