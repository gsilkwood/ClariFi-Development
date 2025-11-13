# ClariFi - Prioritized Action Items

This document provides a prioritized, actionable checklist derived from the comprehensive code review.

---

## 🔥 CRITICAL - Do First

### Security Fixes

- [X] **Move refresh tokens from localStorage to httpOnly cookies**
  - File: `frontend/src/lib/auth-client.ts`
  - Estimated Time: 4 hours
  - Risk: HIGH - XSS vulnerability
  - Owner: CTO.NEW AGENT ***COMPLETE***

- [X] **Add Helmet security headers**
  - File: `backend/src/index.ts`
  - Add: `app.use(helmet())`
  - Estimated Time: 30 minutes
  - Risk: HIGH
  - Owner: CTO.NEW AGENT ***COMPLETE***

- [X] **Implement rate limiting**
  - File: `backend/src/index.ts`
  - Add rate limiting middleware
  - Estimated Time: 2 hours
  - Risk: HIGH - Brute force attacks
  - Owner: CTO.NEW AGENT ***COMPLETE***

- [X] **Remove default JWT secrets**
  - File: `backend/src/utils/jwt.ts` lines 4, 6
  - Ensure environment variables required
  - Estimated Time: 30 minutes
  - Risk: HIGH
  - Owner: CTO.NEW AGENT ***COMPLETE***

### Code Quality - Critical

- [X] **Fix Prisma client singleton pattern**
  - Create: `backend/src/lib/prisma.ts`
  - Update: All service files to import from lib
  - Estimated Time: 2 hours
  - Risk: HIGH - Connection pool exhaustion
  - Owner: CTO.NEW AGENT ***COMPLETE***

- [X] **Remove hardcoded database URL**
  - File: `backend/src/services/documentService.ts` line 8
  - Estimated Time: 5 minutes
  - Risk: MEDIUM
  - Owner: CTO.NEW AGENT ***COMPLETE***

- [?] **Generate database migrations**
  - Command: `cd backend && npx prisma migrate dev --name initial`
  - Estimated Time: 30 minutes
  - Risk: HIGH - Deployment blocker
  - Owner: CTO.NEW AGENT ***HAS THIS TASK ACTUALLY BEEN COMPLETED, OR DID YOU FORCE IT THROUGH?***

### Configuration Files

- [X] **Create Tailwind config**
  - File: `frontend/tailwind.config.js`
  - Estimated Time: 30 minutes
  - Owner: CTO.NEW AGENT ***COMPLETE***

- [X] **Create Next.js config**
  - File: `frontend/next.config.js`
  - Estimated Time: 30 minutes
  - Owner: CTO.NEW AGENT ***COMPLETE***

- [X] **Create ESLint config**
  - File: `frontend/.eslintrc.json`
  - Estimated Time: 30 minutes
  - Owner: CTO.NEW AGENT ***COMPLETE***

---

# ***🔥IMPORTANT🔥*** 

## 🔥 MANDATORY - MUST COMPLETE BY 11/13/2025 @ 11:59PM EDT

### Input Validation

- [ ] **Implement Zod validation for Auth routes**
  - Files: `backend/src/controllers/authController.ts`
  - Add schemas for register, login
  - Owner: CTO.NEW AGENT

- [ ] **Implement Zod validation for Loan routes**
  - Files: `backend/src/controllers/loanController.ts`
  - Add schemas for create, update
  - Owner: CTO.NEW AGENT

- [ ] **Implement Zod validation for Document routes**
  - Files: `backend/src/controllers/documentController.ts`
  - Add schemas for upload, verify
  - Owner: CTO.NEW AGENT

### Error Handling

- [ ] **Create custom error classes**
  - Create: `backend/src/utils/errors.ts`
  - Classes: AppError, ValidationError, UnauthorizedError, NotFoundError
  - Owner: CTO.NEW AGENT

- [ ] **Update error handler middleware**
  - File: `backend/src/middleware/errorHandler.ts`
  - Handle new error types
  - Owner: CTO.NEW AGENT

- [ ] **Add React Error Boundaries**
  - Create: `frontend/src/components/ErrorBoundary.tsx`
  - Wrap app layout
  - Owner: CTO.NEW AGENT

### Logging

- [ ] **Configure Winston logger**
  - Create: `backend/src/lib/logger.ts`
  - Update all console.log calls
  - Owner: CTO.NEW AGENT

- [ ] **Update logging middleware**
  - File: `backend/src/middleware/logging.ts`
  - Use Winston instead of console.log
  - Owner: CTO.NEW AGENT

### Testing

- [ ] **Add frontend tests for auth pages**
  - Files: Login, Register pages
  - Target: 80% coverage
  - Owner: CTO.NEW AGENT

- [ ] **Add frontend tests for dashboard**
  - File: Dashboard page
  - Target: 80% coverage
  - Owner: CTO.NEW AGENT

- [ ] **Add frontend tests for auth store**
  - File: `stores/authStore.ts`
  - Target: 90% coverage
  - Owner: CTO.NEW AGENT

- [ ] **Add frontend tests for loan store**
  - File: `stores/loanStore.ts`
  - Target: 90% coverage
  - Owner: CTO.NEW AGENT

- [ ] **Improve backend integration tests**
  - Use real test database instead of mocks
  - Add negative test cases
  - Owner: CTO.NEW AGENT

---

# ***🔥IMPORTANT🔥*** 

## 🔥 MANDATORY - MUST COMPLETE BY 11/13/2025 @ 11:59PM EDT

### Core Features

- [ ] **Implement loan program selection**
  - Add endpoint to list active programs
  - Update frontend loan creation form
  - Owner: CTO.NEW AGENT

- [ ] **Add pagination to loan listing**
  - Backend: Add skip/take parameters
  - Frontend: Add pagination controls
  - Owner: CTO.NEW AGENT

- [ ] **Implement basic workflow state machine**
  - Create: `backend/src/services/workflowService.ts`
  - Define state transitions
  - Owner: CTO.NEW AGENT

- [ ] **Build notification system (in-app)**
  - Create notification service
  - Add API endpoints
  - Add frontend notification center
  - Owner: CTO.NEW AGENT

- [ ] **Implement task management**
  - Create task service
  - Add API endpoints
  - Add frontend task list
  - Owner: CTO.NEW AGENT

### Documentation

- [ ] **Add API documentation (Swagger)**
  - Install swagger-jsdoc and swagger-ui-express
  - Document all endpoints
  - Owner: CTO.NEW AGENT

- [ ] **Create deployment guide**
  - Document: Environment setup, database migrations, deployment steps
  - Owner: CTO.NEW AGENT

- [ ] **Write contributing guidelines**
  - Code style, PR process, testing requirements
  - Owner: CTO.NEW AGENT

### Code Quality

- [ ] **Extract magic strings to constants**
  - Create: `backend/src/constants/` directory
  - Files: statuses.ts, roles.ts, errors.ts
  - Owner: CTO.NEW AGENT

- [ ] **Add JSDoc comments to all services**
  - Document parameters, return types, errors
  - Owner: CTO.NEW AGENT

- [ ] **Fix TypeScript strict checks in frontend**
  - Update tsconfig.json with missing strict options
  - Fix resulting errors
  - Owner: CTO.NEW AGENT

### Performance

- [ ] **Add response compression**
  - Install and configure compression middleware
  - Owner: CTO.NEW AGENT

- [ ] **Configure database connection pooling**
  - Update Prisma client configuration
  - Owner: CTO.NEW AGENT

- [ ] **Add bundle analyzer to frontend**
  - Install @next/bundle-analyzer
  - Optimize large dependencies
  - Owner: CTO.NEW AGENT

---

# ***🔥IMPORTANT🔥*** 

## 🔥 MANDATORY - MUST COMPLETE BY 11/13/2025 

### Features

- [ ] **Implement email service**
  - Choose provider (SendGrid, AWS SES, etc.)
  - Create email templates
  - Owner: PROJECT LEAD (HUMAN USER)

- [ ] **Add password reset functionality**
  - Backend: Reset token generation
  - Frontend: Reset flow pages
  - Owner: CTO.NEW AGENT

- [ ] **Build admin panel**
  - User management UI
  - System configuration UI
  - Owner: CTO.NEW AGENT

- [ ] **Implement search functionality**
  - Add search endpoints
  - Add frontend search UI
  - Consider Elasticsearch integration
  - Owner: CTO.NEW AGENT


- [ ] **Add export functionality**
  - PDF generation
  - Excel export
  - Owner: CTO.NEW AGENT


### Testing

- [ ] **Add E2E tests**
  - Set up Playwright or Cypress
  - Write 5-10 critical flow tests
  - Owner: CTO.NEW AGENT


- [ ] **Add load testing**
  - Set up k6 or Artillery
  - Test critical endpoints
  - Owner: CTO.NEW AGENT


### Infrastructure

- [ ] **Set up CI/CD pipeline**
  - GitHub Actions or GitLab CI
  - Automated testing, linting, deployment
  - Owner: CTO.NEW TASK RUNNER AGENT


- [ ] **Configure monitoring**
  - Set up Sentry or similar
  - Add health check endpoints
  - Configure alerts
  - Owner: CTO.NEW TASK RUNNER AGENT


- [ ] **Implement caching layer**
  - Set up Redis
  - Cache loan programs, user sessions
  - Owner: CTO.NEW TASK RUNNER AGENT


---


---

## 📊 Summary

**Total REMAINING ACTION ITEMS TO BE COMPLETED BY CTO.NEW AGENT** 
37 PRIMARY "TOP LINE" TASKS, WITH ANYWHERE FROM 1-4 SUB-TASKS FOR EVERY PRIMARY TASK
***ALL ACTION ITEMS MUST BE COMPLETED BEFORE DEADLINE OF NOVEMBER 13, 2025, @ 🔥🔥🔥11:59PM EDT (TODAY!)🔥🔥🔥***




---

## 🎯 PLANNING AND TASK ORDER OF COMPLETION (ALL ITEMS MUST BE COMPLETED, BUT THEY SHOULD BE COMPLETED IN THIS ORDER):

### STEP 1: CRITICAL ITEMS (AGENT MARKED COMPLETE, CHECK ACTUAL FILES TO MAKE SURE THE TASKS ARE ACTUALLY COMPLETED AND NOT JUST MARKED "COMPLETE" ON THE LOGS 
Focus: Security, code quality, configuration
Goal: Make codebase stable and secure

### STEP 2: Quality & Testing
Focus: Validation, error handling, tests
Goal: Reach 70% test coverage

### STEP 3: Core Features Part 1
Focus: Pagination, programs, workflow basics
Goal: Complete essential user-facing features

### STEP 4: Core Features Part 2
Focus: Notifications, tasks, activity logging
Goal: Complete MVP feature set

# 🔥 COMPLETION ***🔥DEADLINE🔥*** NOVEMBER 13, 2025, @ 11:59PM EDT
### ALL ACTIONS, ITEMS, FEATURES, AND TASKS ***MUST BE COMPLETED*** AND PRODUCTION READY BY NO LATER THAT 🔥🔥***🔥🔥🔥 11:59PM EDT, NOVEMBER 13, 2025 (TODAY) 🔥🔥🔥***
---

**Last Updated:** November 13, 2024  
**Next Review:** November 13, 2024, @ ***🔥🔥🔥11:59pm EDT🔥🔥🔥***
