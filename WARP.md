# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

# ClariFi Multi-Agent Development Environment

**Project**: ClariFi Loan Origination System  
**Version**: 2.0  
**Environment**: Warp IDE Agentic Development

---

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 19, TypeScript, Tailwind CSS, shadcn/ui, Zustand, Vitest
- **Backend**: Express.js, TypeScript, Prisma, Jest, supertest
- **Database**: PostgreSQL 15+ with Prisma ORM
- **Infrastructure**: Vercel (frontend), GCP Cloud Run (backend), Cloud SQL
- **AI Integration**: Gemini 2.5 Pro, OpenAI (fallback)

## Development Commands

### Frontend
```bash
cd frontend
npm install           # Install dependencies
npm run dev          # Start dev server (http://localhost:3000)
npm run build        # Build for production
npm run lint         # Run ESLint
npm test             # Run tests (Vitest)
npm test:coverage    # Generate coverage report
```

### Backend
```bash
cd backend
npm install           # Install dependencies
npm run dev          # Start dev server (http://localhost:4000)
npm run build        # Compile TypeScript to dist/
npm run start        # Run compiled code
npm test             # Run Jest tests
npm test:coverage    # Generate coverage report
npm run prisma:generate  # Regenerate Prisma client
npm run prisma:migrate   # Create and run migrations
```

### Database
```bash
cd backend
npx prisma studio              # Open Prisma Studio GUI
npx prisma db seed             # Seed database with initial data
npx prisma migrate dev --name  # Create new migration
npx prisma migrate reset       # Reset database (dev only)
```

## Architecture Overview

### Monorepo Structure
```
clarifi-development/
├── frontend/                 # Next.js 14 application
│   ├── src/
│   │   ├── app/             # Next.js App Router pages & layouts
│   │   ├── components/      # Reusable React components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── lib/             # Utilities, API clients
│   │   ├── stores/          # Zustand state management
│   │   ├── types/           # TypeScript type definitions
│   │   └── styles/          # Global styles, Tailwind config
│   └── package.json
├── backend/                  # Express.js REST API
│   ├── src/
│   │   ├── index.ts         # Express app setup
│   │   ├── controllers/     # HTTP request handlers
│   │   ├── services/        # Business logic layer
│   │   ├── routes/          # API endpoint definitions
│   │   ├── middleware/      # Express middleware (auth, errors, etc.)
│   │   ├── integrations/    # Third-party service integrations
│   │   ├── jobs/            # Background jobs, schedulers
│   │   ├── types/           # TypeScript interfaces
│   │   └── utils/           # Helper functions
│   ├── prisma/
│   │   ├── schema.prisma    # Database schema definition
│   │   ├── migrations/      # Auto-generated migration files
│   │   └── seeds/           # Seed scripts for dev data
│   └── package.json
├── database/                 # Database documentation & schemas
│   ├── migrations/          # Additional migration docs
│   └── scripts/             # Database utility scripts
├── docs/                    # Project documentation
│   ├── api/                 # API endpoint documentation
│   ├── architecture/        # System design docs
│   └── guides/              # Development guides
├── infrastructure/          # DevOps & deployment configs
├── .agent-context/          # Multi-agent coordination
│   ├── task-board.md        # Central task list
│   └── status/              # Per-agent status files
└── tests/                   # Integration & e2e tests (if applicable)
```

### Request Flow
1. **Frontend** (Next.js): User interactions → Zustand store → API calls via axios
2. **Backend** (Express): HTTP request → middleware → routes → controllers → services → database
3. **Database** (Prisma): ORM abstraction over PostgreSQL with type-safe queries

### Data Access Patterns
- Services contain business logic and database queries via Prisma
- Controllers handle HTTP request/response formatting
- Middleware handles authentication (JWT), validation, error handling
- Routes define endpoints and attach controllers

### State Management
- **Frontend**: Zustand for client-side state (authentication, UI state, cache)
- **Backend**: Request-scoped state via Express middleware

## Testing Strategy

### Frontend (Vitest)
- Unit tests in `src/` with `.test.tsx` or `.test.ts` extensions
- Uses React Testing Library for component testing
- Target: >80% coverage

### Backend (Jest)
- Unit tests for services and utilities
- Integration tests using supertest for API endpoints
- Mocked external services and database
- Target: >80% coverage

## Authentication & Security

- **JWT**: 15-minute token expiry, refresh token flow
- **Routes**: Middleware validates token on protected endpoints
- **RBAC**: Role-based access control enforced in services
- **Database**: Prisma handles parameterized queries (prevents SQL injection)
- **Middleware**: Helmet for security headers, rate limiting, CORS

## Workflow State Machine

The backend implements an 11-stage loan workflow with 64 sub-statuses. Key statuses:
1. Draft → 2. Submitted → 3. Under Review → 4. Approved → 5. Funded

Workflow logic lives in backend services and is enforced via database constraints and API validation.

## Common Patterns

### Adding an API Endpoint
1. Define route in `backend/src/routes/`
2. Create controller method in `backend/src/controllers/`
3. Implement business logic in `backend/src/services/`
4. Use Prisma for database access
5. Add middleware for authentication/validation
6. Write integration tests

### Adding a Frontend Page
1. Create page/layout in `frontend/src/app/`
2. Build components in `frontend/src/components/`
3. Use Zustand for state if needed
4. Call backend API via `frontend/src/lib/api-client`
5. Write component tests with React Testing Library

### Database Migrations
1. Update `backend/prisma/schema.prisma`
2. Run `npx prisma migrate dev --name description_of_change`
3. Migration file auto-generated in `backend/prisma/migrations/`
4. Commit both schema and migration files

## Key Principles

- **Type Safety**: Strict TypeScript everywhere (strict mode enabled)
- **Testing**: >80% code coverage required
- **Security**: Input validation, auth on protected endpoints, no exposed secrets
- **Performance**: API responses <500ms, page load <2s
- **Accessibility**: WCAG 2.1 AA compliance for UI

## For Agents

This project uses **role-specific WARP.md files** for detailed guidance:

- `frontend/WARP.md` - UI/UX development, React components, Next.js patterns
- `backend/WARP.md` - REST API, workflow engine, integrations
- `database/WARP.md` - PostgreSQL schema, indexes, migrations

### Getting Started

1. Read the appropriate role-specific WARP.md
2. Check `.agent-context/task-board.md` for current tasks
3. Review `.agent-context/status/[your-role]-status.md` for context
4. Follow patterns established in existing code
5. Update your status file when completing work

---

**Last Updated**: November 2, 2025  
**Maintained By**: Project Setup Lead
