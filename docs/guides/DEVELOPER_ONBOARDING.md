# Developer Onboarding Guide

Welcome to the ClariFi development team! This guide will get you set up and ready to contribute to the project.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Local Development Setup](#local-development-setup)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Common Tasks](#common-tasks)
- [Testing](#testing)
- [Debugging](#debugging)
- [Getting Help](#getting-help)

---

## Prerequisites

Before you start, ensure you have the following installed:

### Required
- **Node.js** v18+ (use `nvm` for version management)
- **npm** v9+ (comes with Node.js)
- **Git** v2.30+ (for version control)
- **Docker** (for containerized development)
- **PostgreSQL** 15+ (local dev database)

### Recommended
- **VS Code** with TypeScript extension
- **Thunder Client** or **Postman** for API testing
- **TablePlus** or **pgAdmin** for database browsing

### Accounts/Access
- GitHub access to `clarifi/clarifi-development`
- GCP account (for Phase 1+ infrastructure)
- API keys: Gemini, SendGrid, AWS SNS

---

## Local Development Setup

### Step 1: Clone Repository

```bash
git clone https://github.com/clarifi/clarifi-development.git
cd clarifi-development
```

### Step 2: Install Dependencies

```bash
# Frontend dependencies
cd frontend
npm install
cd ..

# Backend dependencies  
cd backend
npm install
npx prisma generate
cd ..
```

### Step 3: Configure Environment

Copy the example environment file and add your credentials:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your values:

```env
# Frontend
NEXT_PUBLIC_API_URL=http://localhost:4000/v1

# Backend
DATABASE_URL=postgresql://user:password@localhost:5432/clarifi_dev
JWT_SECRET=your-super-secret-jwt-key-change-this
NODE_ENV=development

# External Services (get from team lead)
SENTRY_DSN=https://your-sentry-key@sentry.io/project
SENDGRID_API_KEY=SG.xxxxxxx
GEMINI_API_KEY=AIza...
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
```

### Step 4: Set Up Database

```bash
cd backend

# Create dev database
createdb clarifi_dev

# Run migrations
npx prisma migrate dev

# Seed with sample data (optional)
npx prisma db seed

cd ..
```

### Step 5: Start Services

**Terminal 1 - Backend API:**
```bash
cd backend
npm run dev
# API running at http://localhost:4000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# App running at http://localhost:3000
```

**Optional - Database GUI:**
```bash
cd backend
npx prisma studio
# Opens at http://localhost:5555
```

### Step 6: Verify Setup

1. Open http://localhost:3000 in your browser
2. You should see the ClariFi login page
3. Create a test account or login with seed data
4. Check Network tab if not loading

---

## Project Structure

```
clarifi-development/
├── frontend/                      # Next.js 14 application
│   ├── src/
│   │   ├── app/                  # App Router pages
│   │   ├── components/           # Reusable React components
│   │   ├── hooks/                # Custom React hooks
│   │   ├── lib/                  # Utilities and API client
│   │   ├── stores/               # Zustand state management
│   │   ├── types/                # TypeScript interfaces
│   │   └── styles/               # Global styles
│   ├── package.json
│   └── tsconfig.json
│
├── backend/                       # Express.js API
│   ├── src/
│   │   ├── index.ts              # Entry point
│   │   ├── controllers/          # HTTP handlers
│   │   ├── services/             # Business logic
│   │   ├── routes/               # API endpoints
│   │   ├── middleware/           # Auth, validation, etc
│   │   ├── integrations/         # Third-party APIs
│   │   ├── jobs/                 # Background tasks
│   │   ├── types/                # TypeScript interfaces
│   │   └── utils/                # Helpers
│   ├── prisma/
│   │   ├── schema.prisma         # Database schema
│   │   ├── migrations/           # Auto-generated migrations
│   │   └── seeds/                # Initial data
│   ├── __tests__/                # Test suites
│   ├── package.json
│   └── tsconfig.json
│
├── database/                      # Database documentation
│   ├── migrations/               # Migration docs
│   └── WARP.md                  # Database dev guide
│
├── docs/                         # Documentation (you are here)
│   ├── api/
│   ├── guides/
│   ├── development/
│   ├── architecture/
│   └── README.md
│
├── infrastructure/               # Deployment configs
│   ├── terraform/               # IaC
│   └── github/                  # Actions workflows
│
├── .agent-context/              # Multi-agent coordination
│   ├── task-board-sprint.md
│   ├── blockers.md
│   ├── status/
│   └── ...
│
├── .env.example                 # Environment template
├── docker-compose.yml           # Local dev stack
├── README.md                    # Project README
└── WARP.md                      # Main dev guide
```

### Key Files to Understand

1. **`frontend/src/lib/api-client.ts`** - HTTP client for backend communication
2. **`backend/src/index.ts`** - Express app setup and middleware
3. **`backend/prisma/schema.prisma`** - Complete database schema
4. **`docs/README.md`** - Documentation index (start here)

---

## Development Workflow

### Working on a Feature

#### 1. Create Feature Branch

```bash
git checkout -b feature/your-feature-name

# Branch naming convention:
# feature/short-description    - New feature
# fix/issue-description         - Bug fix
# docs/what-you-documented      - Documentation
# refactor/area-of-refactor     - Refactoring
```

#### 2. Make Changes

```bash
# Frontend
cd frontend
npm run dev

# Backend
cd backend
npm run dev

# Database schema changes
cd backend
npx prisma migrate dev --name migration_description
```

#### 3. Keep Code Quality High

```bash
# Format code
npm run lint -- --fix

# Run tests
npm test

# Check TypeScript
npm run typecheck

# Review changes
git diff
```

#### 4. Commit with Clear Messages

```bash
git add .
git commit -m "feat: Add loan status updates

- Implement status update endpoint
- Add workflow state validation
- Add email notification trigger
- Add tests for status transitions"
```

#### 5. Push and Create Pull Request

```bash
git push origin feature/your-feature-name
# Go to GitHub and create PR with description
```

#### 6. Code Review & Merge

- Address reviewer feedback
- All tests must pass
- One approval required before merge
- Merge to main branch only

---

## Common Tasks

### Adding a New API Endpoint

1. **Create route** in `backend/src/routes/`
2. **Create controller** in `backend/src/controllers/`
3. **Create service** in `backend/src/services/`
4. **Write tests** in `backend/__tests__/`
5. **Update API docs** in `docs/api/`

Example:
```typescript path=null start=null
// routes/applications.ts
router.post('/applications', authMiddleware, createApplication);

// controllers/applications.ts
export const createApplication = async (req, res) => {
  const { loanProgram, propertyAddress } = req.body;
  const app = await createApplicationService(req.user, loanProgram, propertyAddress);
  res.json({ success: true, data: app });
};

// services/applications.ts
export const createApplicationService = async (user, program, address) => {
  // Business logic here
  return prisma.application.create({...});
};
```

### Adding a New Component

1. **Create component** in `frontend/src/components/`
2. **Create tests** in same directory
3. **Export from index** if it's a major component
4. **Update style imports**

```typescript path=null start=null
// components/ApplicationForm.tsx
export const ApplicationForm = ({ onSubmit }: Props) => {
  return <form onSubmit={onSubmit}>...</form>;
};

// components/ApplicationForm.test.tsx
describe('ApplicationForm', () => {
  it('submits form data', () => {
    // Test implementation
  });
});
```

### Database Migration

```bash
cd backend

# Create migration
npx prisma migrate dev --name add_new_field

# This will:
# 1. Create migration file
# 2. Apply to local database
# 3. Generate new Prisma types

# Review generated migration in prisma/migrations/
# Commit both schema.prisma and migration file
```

### Running Tests

```bash
# Backend tests (Jest)
cd backend
npm test              # Run all tests
npm test -- auth      # Run auth tests only
npm test:coverage     # Generate coverage report

# Frontend tests (Vitest)
cd frontend
npm test              # Run all tests
npm test:watch        # Watch mode
npm test:coverage     # Coverage report
```

### Debugging

#### Backend
```bash
cd backend
# Add debugger breakpoint in code
debugger;

# Run with debugger
node --inspect-brk node_modules/.bin/jest --runInBand
# Open chrome://inspect in Chrome
```

#### Frontend
```bash
cd frontend
# React DevTools browser extension
# Next.js devtools: http://localhost:3000/__nextjs_original-stack-frame
```

---

## Testing

### Testing Philosophy

Follow the **test pyramid**:
- 60% Unit tests (fast, focused)
- 30% Integration tests (realistic scenarios)
- 10% E2E tests (complete flows)

Target: **>80% code coverage**

### Backend Testing

```typescript path=null start=null
// __tests__/services/authentication.test.ts
import { loginUser } from '../../src/services/authentication';

describe('Authentication Service', () => {
  it('should login user with valid credentials', async () => {
    const user = await loginUser('test@example.com', 'password123');
    expect(user.email).toBe('test@example.com');
    expect(user.token).toBeDefined();
  });

  it('should throw on invalid credentials', async () => {
    await expect(loginUser('test@example.com', 'wrong')).rejects.toThrow(
      'Invalid credentials'
    );
  });
});
```

### Frontend Testing

```typescript path=null start=null
// components/LoginForm.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { LoginForm } from './LoginForm';

describe('LoginForm', () => {
  it('submits form with email and password', async () => {
    const onSubmit = vi.fn();
    render(<LoginForm onSubmit={onSubmit} />);
    
    fireEvent.change(screen.getByLabel(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabel(/password/i), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    
    expect(onSubmit).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });
  });
});
```

---

## Debugging

### Common Issues

#### "Cannot find module" Error
```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install
npx prisma generate
```

#### Database Connection Error
```bash
# Check PostgreSQL is running
brew services list  # macOS
psql postgres       # Try to connect

# Check DATABASE_URL in .env.local
# Reset database if needed
dropdb clarifi_dev
createdb clarifi_dev
npx prisma migrate dev
```

#### Port Already in Use
```bash
# Find process using port
lsof -i :3000  # Frontend
lsof -i :4000  # Backend

# Kill process
kill -9 <PID>
```

#### TypeScript Errors
```bash
# Check TypeScript config
npm run typecheck

# May need to restart LSP in editor
# Or: npm install (reinstall types)
```

---

## Code Standards

### TypeScript
- Use strict mode (strict: true in tsconfig.json)
- Define all types explicitly
- No `any` types without comment
- Use interfaces for contracts, types for unions

### API Design
- RESTful endpoints following conventions
- Consistent error responses
- Pagination for list endpoints
- Versioning in URL (/v1/)

### Error Handling
- Never console.log in production code
- Use proper logging (Sentry, Winston)
- Catch and handle all async errors
- Return meaningful error messages

### Testing
- Test behavior, not implementation
- Use descriptive test names
- Mock external dependencies
- Aim for >80% coverage

---

## Version Control

### Commit Guidelines

```bash
# Format: <type>(<scope>): <message>
# Types: feat, fix, docs, style, refactor, perf, test, chore

git commit -m "feat(auth): Add JWT token refresh endpoint

- Implement refresh token endpoint
- Add refresh token rotation
- Add tests for token refresh flow
- Update API documentation

Closes #123"
```

### Branch Protection

- Main branch requires:
  - Pull request review
  - All tests passing
  - No conflicts with main

---

## Performance Tips

### Frontend
- Use `React.memo()` for expensive components
- Lazy load routes with `dynamic()`
- Optimize images (use Next.js Image)
- Check Lighthouse score (>90)

### Backend
- Index frequently queried columns
- Use connection pooling
- Cache read-only data
- Profile slow endpoints

---

## Getting Help

### Resources
1. **Documentation**: Start with `/docs/README.md`
2. **Code Examples**: Look at similar features in codebase
3. **Team**: Ask in project chat/Discord
4. **Google**: Stack Overflow, GitHub issues, documentation

### Documentation to Read
- [Architecture Overview](../architecture/ARCHITECTURE.md)
- [API Reference](../api/API_REFERENCE.md)
- [Backend Guide](../development/BACKEND.md)
- [Frontend Guide](../development/FRONTEND.md)
- [Testing Guide](../development/TESTING.md)

### Quick Commands Reference

```bash
# Development
npm run dev              # Start dev server
npm test                # Run tests
npm run lint            # Check code style
npm run typecheck       # Check TypeScript

# Database
npx prisma studio      # Open GUI
npx prisma migrate dev --name <name>  # Create migration
npx prisma db seed     # Seed data

# Git
git status              # Check changes
git log --oneline       # View commit history
git diff                # See differences
```

---

## Next Steps

1. ✅ Complete local setup
2. ✅ Run `npm test` to verify everything works
3. ✅ Read the [Architecture Overview](../architecture/ARCHITECTURE.md)
4. ✅ Pick a small task from the task board
5. ✅ Make your first commit!

---

**Welcome to the team!** 🚀

If you get stuck, ask questions - we're here to help!

**Last Updated**: 2025-11-08  
**Status**: Phase 1 Documentation  
**Maintained By**: 📚 Documentation Agent
