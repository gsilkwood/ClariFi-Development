# ClariFi - Quick Fix Code Snippets

This document contains ready-to-use code snippets for the most critical fixes identified in the code review.

---

## 1. Fix Prisma Client Singleton

### Create: `backend/src/lib/prisma.ts`

```typescript
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' 
      ? ['query', 'error', 'warn'] 
      : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;
```

### Update: All service files

**In `backend/src/services/authService.ts`:**
```typescript
// Remove lines 6-12, replace with:
import { prisma } from '../lib/prisma';

// Remove the const prisma = new PrismaClient() block
```

**In `backend/src/services/loanService.ts`:**
```typescript
// Remove lines 4-10, replace with:
import { prisma } from '../lib/prisma';

// Remove the const prisma = new PrismaClient() block
```

**In `backend/src/services/documentService.ts`:**
```typescript
// Remove lines 5-11, replace with:
import { prisma } from '../lib/prisma';

// Remove the const prisma = new PrismaClient() block
```

---

## 2. Add Security Middleware

### Update: `backend/src/index.ts`

Add after line 1:
```typescript
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
```

Add after line 21 (after `app.use(requestLogger)`):
```typescript
// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

// Stricter rate limit for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // 5 requests per 15 minutes
  skipSuccessfulRequests: true,
});

app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
```

---

## 3. Fix JWT Secrets

### Update: `backend/src/utils/jwt.ts`

Replace lines 4-7 with:
```typescript
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRY = process.env.JWT_EXPIRY || '15m';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY || '7d';

// Validate required secrets
if (!JWT_SECRET || !REFRESH_TOKEN_SECRET) {
  throw new Error(
    'JWT_SECRET and REFRESH_TOKEN_SECRET must be set in environment variables'
  );
}

if (JWT_SECRET.length < 32 || REFRESH_TOKEN_SECRET.length < 32) {
  throw new Error(
    'JWT secrets must be at least 32 characters long'
  );
}
```

---

## 4. Add Zod Validation Schemas

### Create: `backend/src/schemas/auth.schemas.ts`

```typescript
import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  username: z.string().min(3).max(50).regex(/^[a-zA-Z0-9_]+$/, 
    'Username can only contain letters, numbers, and underscores'),
  password: z.string().min(8).max(100)
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  firstName: z.string().min(1).max(100).optional(),
  lastName: z.string().min(1).max(100).optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});
```

### Create: `backend/src/schemas/loan.schemas.ts`

```typescript
import { z } from 'zod';

export const createLoanSchema = z.object({
  amount: z.number()
    .min(1000, 'Loan amount must be at least $1,000')
    .max(1000000, 'Loan amount cannot exceed $1,000,000'),
  term: z.number()
    .refine((val) => [12, 24, 36, 48].includes(val), 
      'Loan term must be 12, 24, 36, or 48 months'),
  purpose: z.string().min(1).max(255),
  employmentStatus: z.string().min(1),
  employerName: z.string().optional(),
  annualIncome: z.number().min(0),
  additionalIncome: z.number().min(0).optional(),
  borrowerEmail: z.string().email(),
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
});

export const updateLoanSchema = z.object({
  amount: z.number()
    .min(1000)
    .max(1000000)
    .optional(),
  term: z.number()
    .refine((val) => [12, 24, 36, 48].includes(val))
    .optional(),
  purpose: z.string().min(1).max(255).optional(),
}).strict();
```

### Create: `backend/src/middleware/validate.ts`

```typescript
import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          error: 'Validation failed',
          details: error.errors.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        });
        return;
      }
      next(error);
    }
  };
};
```

### Update: `backend/src/routes/authRoutes.ts`

```typescript
import { Router } from 'express';
import { authController } from '../controllers/authController';
import { validate } from '../middleware/validate';
import { registerSchema, loginSchema, refreshTokenSchema } from '../schemas/auth.schemas';

const router = Router();

router.post('/register', validate(registerSchema), (req, res) => 
  authController.register(req, res));

router.post('/login', validate(loginSchema), (req, res) => 
  authController.login(req, res));

router.post('/refresh', validate(refreshTokenSchema), (req, res) => 
  authController.refreshToken(req, res));

router.post('/logout', (req, res) => 
  authController.logout(req, res));

export default router;
```

### Update: `backend/src/routes/loanRoutes.ts`

```typescript
import { Router } from 'express';
import { loanController } from '../controllers/loanController';
import { authenticateToken } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createLoanSchema, updateLoanSchema } from '../schemas/loan.schemas';

const router = Router();

router.use(authenticateToken);

router.post('/', validate(createLoanSchema), (req, res) => 
  loanController.createLoan(req, res));

router.get('/', (req, res) => 
  loanController.getLoanApplications(req, res));

router.get('/:id', (req, res) => 
  loanController.getLoanApplication(req, res));

router.put('/:id', validate(updateLoanSchema), (req, res) => 
  loanController.updateLoan(req, res));

router.post('/:id/submit', (req, res) => 
  loanController.submitForReview(req, res));

router.get('/:id/status', (req, res) => 
  loanController.getLoanStatus(req, res));

router.get('/:id/history', (req, res) => 
  loanController.getStatusHistory(req, res));

router.delete('/:id', (req, res) => 
  loanController.deleteLoan(req, res));

export default router;
```

---

## 5. Create Custom Error Classes

### Create: `backend/src/utils/errors.ts`

```typescript
export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public code: string,
    public isOperational: boolean = true
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, public details?: any) {
    super(400, message, 'VALIDATION_ERROR');
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized') {
    super(401, message, 'UNAUTHORIZED');
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Forbidden') {
    super(403, message, 'FORBIDDEN');
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(404, `${resource} not found`, 'NOT_FOUND');
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(409, message, 'CONFLICT');
  }
}

export class InternalServerError extends AppError {
  constructor(message: string = 'Internal server error') {
    super(500, message, 'INTERNAL_SERVER_ERROR');
  }
}
```

### Update: `backend/src/middleware/errorHandler.ts`

```typescript
import { Request, Response, NextFunction } from 'express';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { AppError } from '../utils/errors';

interface ErrorResponse {
  error: string;
  message: string;
  code?: string;
  details?: any;
  stack?: string;
}

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error('Error:', err);

  // Handle custom AppError
  if (err instanceof AppError) {
    const response: ErrorResponse = {
      error: err.name,
      message: err.message,
      code: err.code,
    };

    if (process.env.NODE_ENV === 'development') {
      response.stack = err.stack;
    }

    res.status(err.statusCode).json(response);
    return;
  }

  // Handle Prisma errors
  if (err instanceof PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      res.status(409).json({
        error: 'Conflict',
        message: 'A record with this value already exists',
        code: 'UNIQUE_CONSTRAINT_VIOLATION',
        details: err.meta,
      });
      return;
    }

    if (err.code === 'P2025') {
      res.status(404).json({
        error: 'Not Found',
        message: 'The requested record was not found',
        code: 'RECORD_NOT_FOUND',
      });
      return;
    }
  }

  // Handle validation errors
  if (err.name === 'ValidationError') {
    res.status(400).json({
      error: 'Validation Error',
      message: err.message,
      code: 'VALIDATION_ERROR',
    });
    return;
  }

  // Default 500 error
  const response: ErrorResponse = {
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' 
      ? 'An unexpected error occurred' 
      : err.message,
    code: 'INTERNAL_SERVER_ERROR',
  };

  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }

  res.status(500).json(response);
};
```

---

## 6. Add Frontend Error Boundary

### Create: `frontend/src/components/ErrorBoundary.tsx`

```typescript
'use client';

import React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    // TODO: Send to error tracking service (Sentry, etc.)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-red-600 mb-4">
              Something went wrong
            </h1>
            <p className="text-gray-600 mb-6">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <div className="space-y-3">
              <button
                onClick={() => this.setState({ hasError: false, error: null })}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Try again
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                Go to home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
```

### Update: `frontend/src/app/layout.tsx`

```typescript
import type { Metadata } from 'next';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import './globals.css';

export const metadata: Metadata = {
  title: 'ClariFi - Loan Origination System',
  description: 'Modern loan origination and CRM system powered by AI',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </body>
    </html>
  );
}
```

---

## 7. Create Configuration Files

### Create: `frontend/tailwind.config.js`

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
```

### Create: `frontend/next.config.js`

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Environment variables to expose to browser
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api',
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
        ],
      },
    ];
  },

  // Webpack configuration
  webpack: (config, { dev, isServer }) => {
    // Add bundle analyzer in development
    if (dev && !isServer && process.env.ANALYZE === 'true') {
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          openAnalyzer: true,
        })
      );
    }

    return config;
  },
};

module.exports = nextConfig;
```

### Create: `frontend/postcss.config.js`

```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

### Create: `frontend/.eslintrc.json`

```json
{
  "extends": [
    "next/core-web-vitals",
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint"],
  "rules": {
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/no-unused-vars": ["warn", { 
      "argsIgnorePattern": "^_" 
    }],
    "no-console": ["warn", { 
      "allow": ["warn", "error"] 
    }]
  }
}
```

---

## 8. Generate Database Migrations

### Commands to run:

```bash
cd backend

# Generate Prisma client
npx prisma generate

# Create initial migration
npx prisma migrate dev --name initial

# Verify migration was created
ls -la prisma/migrations/
```

### Optional: Create seed script

**Create: `backend/prisma/seed.ts`**

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create roles
  const borrowerRole = await prisma.userRole.upsert({
    where: { name: 'BORROWER' },
    update: {},
    create: {
      name: 'BORROWER',
      description: 'Default borrower role',
      permissions: ['view_own_loans', 'upload_documents', 'message_loan_officer'],
    },
  });

  const loanOfficerRole = await prisma.userRole.upsert({
    where: { name: 'Loan Officer' },
    update: {},
    create: {
      name: 'Loan Officer',
      description: 'Loan officer role',
      permissions: ['view_all_loans', 'approve_loans', 'assign_tasks'],
    },
  });

  // Create default loan program
  const defaultProgram = await prisma.loanProgram.upsert({
    where: { programCode: 'CONV-30' },
    update: {},
    create: {
      programCode: 'CONV-30',
      programName: 'Conventional 30-Year Fixed',
      programCategory: 'Real Estate',
      description: 'Standard 30-year fixed rate mortgage',
      minAmount: 50000,
      maxAmount: 1000000,
      minTermMonths: 360,
      maxTermMonths: 360,
      isActive: true,
    },
  });

  console.log('Seed data created:', {
    borrowerRole,
    loanOfficerRole,
    defaultProgram,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

**Update `backend/package.json`:**

```json
{
  "prisma": {
    "seed": "ts-node prisma/seed.ts"
  }
}
```

**Run seed:**
```bash
npx prisma db seed
```

---

## 9. Update .gitignore

### Create/Update: `.gitignore` (root)

```gitignore
# Dependencies
node_modules/
package-lock.json
yarn.lock

# Environment variables
.env
.env.local
.env.*.local

# Build outputs
dist/
build/
.next/
out/

# Logs
logs/
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# OS files
.DS_Store
Thumbs.db

# IDE files
.vscode/
.idea/
*.swp
*.swo
*~

# Test coverage
coverage/
.nyc_output/

# Uploads
uploads/
*.upload

# Database
*.db
*.sqlite
*.sqlite3

# Prisma
prisma/dev.db
prisma/migrations/*_snapshot.json
```

---

## 10. Environment Variable Validation

### Create: `backend/src/utils/env.ts`

```typescript
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.string().default('4000'),
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(32),
  REFRESH_TOKEN_SECRET: z.string().min(32),
  JWT_EXPIRY: z.string().default('15m'),
  REFRESH_TOKEN_EXPIRY: z.string().default('7d'),
  FRONTEND_URL: z.string().url().default('http://localhost:3000'),
});

export function validateEnv() {
  try {
    const env = envSchema.parse(process.env);
    return env;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ Invalid environment variables:');
      error.errors.forEach((err) => {
        console.error(`  - ${err.path.join('.')}: ${err.message}`);
      });
      process.exit(1);
    }
    throw error;
  }
}
```

### Update: `backend/src/index.ts`

Add at the top after imports:
```typescript
import { validateEnv } from './utils/env';

// Validate environment variables before starting server
validateEnv();
```

---

## Summary

These code snippets address the 10 most critical issues:

1. ✅ Prisma singleton pattern
2. ✅ Security middleware (Helmet + rate limiting)
3. ✅ JWT secret validation
4. ✅ Zod input validation
5. ✅ Custom error classes
6. ✅ Frontend error boundaries
7. ✅ Configuration files
8. ✅ Database migrations
9. ✅ .gitignore updates
10. ✅ Environment validation

**Estimated implementation time:** 8-12 hours

**Priority order:**
1. Prisma singleton (prevents connection issues)
2. Environment validation (prevents startup with bad config)
3. Security middleware (protects endpoints)
4. Database migrations (enables deployment)
5. Configuration files (enables proper builds)
6. Input validation (prevents bad data)
7. Error handling (improves debugging)
8. Error boundaries (improves UX)

---

**After implementing these fixes, run:**

```bash
# Backend
cd backend
npm install
npx prisma generate
npx prisma migrate dev --name initial
npm run test
npm run build

# Frontend
cd frontend
npm install
npm run build
npm run lint

# Both
npm test  # When frontend tests are added
```
