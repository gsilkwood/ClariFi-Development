# Contributing to ClariFi

Thank you for your interest in contributing to ClariFi! This document provides guidelines and instructions for contributing to the project.

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on code quality and functionality
- Respect intellectual property and privacy

## Getting Started

### 1. Fork and Clone

```bash
git clone <your-fork-url>
cd clarifi
git remote add upstream <original-url>
```

### 2. Create Feature Branch

```bash
git checkout -b feature/your-feature-name
```

Use descriptive branch names:
- `feature/`: for new features
- `fix/`: for bug fixes
- `docs/`: for documentation
- `refactor/`: for code improvements

### 3. Set Up Development Environment

Follow the setup instructions in [DEPLOYMENT_GUIDE.md](docs/DEPLOYMENT_GUIDE.md)

## Development Workflow

### Code Style

#### TypeScript
- Use strict mode
- Add type annotations
- Use interfaces for complex objects
- Avoid `any` types

```typescript
// Good
interface UserCreateRequest {
  email: string;
  username: string;
  password: string;
}

// Bad
function createUser(data: any) { }
```

#### Backend (Express/Node.js)
- Follow layered architecture: Routes → Controllers → Services
- Use async/await consistently
- Implement error handling
- Add JSDoc comments to services
- Use dependency injection

```typescript
/**
 * Create a new user
 * @param data - User registration data
 * @returns Promise containing created user
 * @throws ValidationError if data is invalid
 * @throws ConflictError if user already exists
 */
static async createUser(data: UserCreateRequest): Promise<User>
```

#### Frontend (React/Next.js)
- Use functional components
- Follow React hooks patterns
- Implement proper error boundaries
- Use server components where appropriate
- Keep components focused and testable

### Linting and Formatting

```bash
# Backend
cd backend
npm run lint
npm run format

# Frontend
cd frontend
npm run lint
npm run format
```

### Testing

Write tests for:
- Business logic
- API endpoints
- User interactions
- Error cases

```bash
# Backend tests
cd backend
npm test
npm run test:coverage

# Frontend tests
cd frontend
npm test
npm run test:coverage
```

Target: Maintain **70%+ code coverage**

## Commit Guidelines

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding/updating tests
- `chore`: Build, dependencies, etc.

### Examples

```
feat(auth): implement JWT refresh token rotation

- Add refresh token endpoint
- Update token refresh logic in auth client
- Add httpOnly cookie support

Closes #123
```

```
fix(loans): resolve pagination bug in loan listing

- Fix off-by-one error in skip calculation
- Add validation for page and limit parameters
- Add tests for pagination edge cases

Closes #456
```

## Pull Request Process

### 1. Prepare PR

```bash
# Update from main
git fetch upstream
git rebase upstream/main

# Push to your fork
git push origin feature/your-feature-name
```

### 2. Create Pull Request

**PR Title:** Clear, concise description
**PR Description:** Include:
- What changes were made
- Why changes were necessary
- How to test the changes
- Relevant issue numbers

### 3. PR Checklist

- [ ] Code follows style guidelines
- [ ] Tests added/updated
- [ ] All tests pass
- [ ] Documentation updated
- [ ] No console errors/warnings
- [ ] No debugging code left in
- [ ] Commits are well-organized

### 4. Code Review

- Address reviewer feedback promptly
- Request changes if disagreed with
- Be open to suggestions
- Re-request review after updates

## File Structure

```
clarifi/
├── backend/
│   ├── src/
│   │   ├── controllers/      # Request handlers
│   │   ├── services/         # Business logic
│   │   ├── routes/           # API routes
│   │   ├── middleware/       # Express middleware
│   │   ├── lib/              # Utilities
│   │   ├── types/            # TypeScript types
│   │   ├── utils/            # Helper functions
│   │   ├── constants/        # Constants
│   │   └── __tests__/        # Tests
│   ├── prisma/
│   │   ├── schema.prisma     # Database schema
│   │   └── migrations/       # Database migrations
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── app/              # App Router pages
│   │   ├── components/       # React components
│   │   ├── lib/              # Utilities
│   │   ├── stores/           # Zustand stores
│   │   ├── types/            # TypeScript types
│   │   └── __tests__/        # Tests
│   └── package.json
├── docs/                      # Documentation
└── README.md
```

## Performance Considerations

### Backend
- Use pagination for large datasets
- Implement database indexing
- Cache frequently accessed data
- Optimize database queries
- Use connection pooling

### Frontend
- Code splitting for routes
- Image optimization
- Lazy loading components
- Minimize bundle size
- Implement caching

## Security Guidelines

- Never commit secrets/credentials
- Validate all inputs
- Sanitize data before storage
- Use HTTPS in production
- Keep dependencies updated
- Report security issues privately

## Documentation Standards

- Update README.md for major changes
- Add API documentation for new endpoints
- Include JSDoc comments in services
- Document complex business logic
- Keep CHANGELOG updated

## Common Tasks

### Adding a New API Endpoint

1. Create controller method
2. Add route handler
3. Add validation schemas
4. Write tests
5. Add to Swagger docs
6. Update API documentation

### Adding a New Database Model

1. Update `prisma/schema.prisma`
2. Create migration: `npx prisma migrate dev --name <name>`
3. Create service class
4. Add controller methods
5. Create routes
6. Write tests

### Creating a New Component

1. Create component file
2. Add TypeScript types
3. Include error boundary if needed
4. Write tests
5. Add Storybook story (if applicable)
6. Document in component README

## Questions or Issues?

- Check existing issues/PRs
- Ask in discussions
- Create issue with detailed description
- Contact maintainers

## Recognition

Contributors will be recognized in:
- Project README
- Contribution statistics
- Release notes
- Community forums

## License

By contributing, you agree your work will be licensed under the project's license.

Thank you for contributing to ClariFi!
