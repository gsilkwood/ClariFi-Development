# Chief of Staff Task Assignments

**Project**: ClariFi Loan Origination System  
**Current Phase**: Phase 1 - Foundation (Weeks 1-2)  
**Last Updated**: 2025-11-03  
**Status**: Ready for Phase 1 Kickoff

---

## How to Use This File

1. **Agents**: Check below for your name to find assignments
2. **Each task has**: Task ID, Objective, Deliverables, Acceptance Criteria, Due Date, Priority
3. **Update this file** when assignments change or tasks complete
4. **Update your status file** (status/[role]-status.md) regularly
5. **Report blockers** immediately to blockers.md

---

## Active Assignments (Phase 1)

### 🗄️ DATABASE AGENT

---

**TASK ID**: COS-001  
**TASK NAME**: Design Complete Prisma Schema  
**OBJECTIVE**: Create all 14 required database tables with proper relationships, constraints, and indexes

**CONTEXT**: 
- The Prisma schema currently has only a placeholder User model
- We need 14 tables supporting 32 loan programs and 5 user roles
- Migrations must be generated automatically

**DELIVERABLES**:
- [ ] 14 tables implemented in backend/prisma/schema.prisma
- [ ] All foreign key relationships defined
- [ ] Unique and check constraints applied
- [ ] Indexes created for performance-critical queries
- [ ] Prisma client generated successfully
- [ ] Initial migration created

**ACCEPTANCE CRITERIA**:
- [ ] Schema supports all 32 loan programs
- [ ] Schema supports 5 user roles with proper RBAC fields
- [ ] All relationships correctly defined with cascading rules
- [ ] `npx prisma generate` runs without errors
- [ ] `npx prisma migrate dev --name init` creates valid migration
- [ ] Design System Approval Gate review passes

**DEPENDENCIES**:
- None (can start immediately)

**PRIORITY**: P0 (Critical Path)  
**EFFORT**: 8-12 hours  
**DUE DATE**: 2025-11-06 (by end of Week 1)

**NOTES**:
- Refer to ~/clarifi-docs/WARP-database-v2.md for requirements
- Consult with Backend Agent on service layer needs
- Get Orchestration Agent approval before final commit

---

### ⚙️ BACKEND AGENT

---

**TASK ID**: COS-002  
**TASK NAME**: Implement JWT Authentication System  
**OBJECTIVE**: Create user registration, login, and JWT token management endpoints

**CONTEXT**:
- Current backend/src/index.ts is minimal
- We need secure JWT with 15-min expiry + refresh token flow
- Must support 5 user roles with proper authorization checks

**DELIVERABLES**:
- [ ] POST /api/auth/register endpoint
- [ ] POST /api/auth/login endpoint
- [ ] POST /api/auth/refresh endpoint
- [ ] JWT middleware for protected routes
- [ ] Password hashing with bcrypt
- [ ] Role-based access control (RBAC) helpers
- [ ] Authentication tests (Jest)

**ACCEPTANCE CRITERIA**:
- [ ] User can register with email/password
- [ ] User can login and receive JWT token
- [ ] JWT token valid for 15 minutes
- [ ] Refresh token extends session
- [ ] Protected endpoints reject unauthorized requests
- [ ] All endpoints return proper error codes
- [ ] >80% test coverage for auth module
- [ ] No hardcoded secrets in code

**DEPENDENCIES**:
- Database Agent completes COS-001 (Prisma schema)

**PRIORITY**: P0 (Critical Path)  
**EFFORT**: 10-14 hours  
**DUE DATE**: 2025-11-07 (by mid-Week 1)

**NOTES**:
- Use jsonwebtoken library (already in package.json)
- Use bcrypt for password hashing
- Follow JWT best practices (short expiry, refresh tokens)
- Coordinate with Frontend Agent on token storage/handling

---

### 💻 FRONTEND AGENT

---

**TASK ID**: COS-003  
**TASK NAME**: Set Up Next.js App Router & Page Structure  
**OBJECTIVE**: Create base page structure and routing for all user roles

**CONTEXT**:
- Frontend package.json is ready
- Need to scaffold Next.js App Router pages
- Must support 5 role-specific dashboards

**DELIVERABLES**:
- [ ] Next.js App Router configured in src/app/
- [ ] Root layout (src/app/layout.tsx)
- [ ] Home page (src/app/page.tsx)
- [ ] Authentication pages (login, register, forgot-password)
- [ ] Protected route wrapper component
- [ ] Basic role-based layout for each user type
- [ ] Zustand store setup for auth state

**ACCEPTANCE CRITERIA**:
- [ ] `npm run dev` starts without errors
- [ ] All pages render without TypeScript errors
- [ ] Protected routes redirect unauthenticated users
- [ ] Role-specific layouts load correctly
- [ ] Zustand auth store initialized
- [ ] API client (axios) configured
- [ ] >80% test coverage for core page components

**DEPENDENCIES**:
- Backend Agent completes COS-002 (authentication endpoints)

**PRIORITY**: P0 (Critical Path)  
**EFFORT**: 8-10 hours  
**DUE DATE**: 2025-11-07 (by mid-Week 1)

**NOTES**:
- Don't build full UI yet - just page structure and routing
- Coordinate with UI/UX Agent on component imports
- Use Zustand for auth state management
- Create API client in src/lib/api-client.ts

---

### 🎨 UI/UX DESIGN AGENT

---

**TASK ID**: COS-004  
**TASK NAME**: Create Design System with 25+ Components  
**OBJECTIVE**: Build beautiful, reusable component library using Tailwind CSS + shadcn/ui

**CONTEXT**:
- We need a modern, novel design that stands out in fintech
- Components must support dark mode
- All components must be WCAG 2.1 AA compliant
- This is a human approval gate at Week 2

**DELIVERABLES**:
- [ ] 25+ reusable components built
- [ ] Tailwind CSS configuration optimized
- [ ] Component storybook/documentation
- [ ] Dark mode support for all components
- [ ] Icon system (SVG/icon library)
- [ ] Color palette defined
- [ ] Typography system established
- [ ] Spacing/sizing system documented

**COMPONENT CATEGORIES** (suggestions):
- Forms: Input, Button, Select, Checkbox, Radio, Textarea
- Layout: Card, Container, Grid, Sidebar, Header, Footer
- Navigation: Navbar, Breadcrumb, Tabs, Pagination
- Feedback: Alert, Modal, Toast, Badge, Progress
- Data: Table, DataGrid, List, Tree
- Misc: Avatar, Icon, Tooltip, Dropdown

**ACCEPTANCE CRITERIA**:
- [ ] All 25+ components tested and documented
- [ ] WCAG 2.1 AA compliance verified
- [ ] Dark mode working on all components
- [ ] Responsive on mobile/tablet/desktop
- [ ] Component documentation clear and complete
- [ ] Figma design file (or similar) available
- [ ] Human approval gate passed

**DEPENDENCIES**:
- None (can start immediately, parallel with other tasks)

**PRIORITY**: P0 (Critical Path)  
**EFFORT**: 16-20 hours  
**DUE DATE**: 2025-11-06 (by end of Week 1)

**NOTES**:
- This is a human approval gate - get feedback early and iterate
- Reference modern fintech design (Stripe, Mercury, Ramp)
- Create something completely novel - not generic
- Document component usage in Storybook or MDX files

---

### 🚀 DEVOPS AGENT

---

**TASK ID**: COS-005  
**TASK NAME**: Set Up GCP Infrastructure & CI/CD Pipeline  
**OBJECTIVE**: Provision GCP resources and automate deployment

**CONTEXT**:
- We have $1,500 GCP credits available
- Need Cloud SQL (PostgreSQL), Cloud Run backend hosting
- GitHub Actions for CI/CD
- docker-compose.yml created for local development

**DELIVERABLES**:
- [ ] GCP project created and configured
- [ ] Cloud SQL PostgreSQL instance provisioned
- [ ] Service account with appropriate IAM roles
- [ ] GitHub Actions workflow created
- [ ] Auto-deployment to GCP Cloud Run on main branch push
- [ ] Environment variables configured in GCP/GitHub
- [ ] Database backup strategy documented
- [ ] Monitoring and logging enabled (Cloud Logging)

**ACCEPTANCE CRITERIA**:
- [ ] GCP project accessible and funded
- [ ] Cloud SQL instance running and accessible
- [ ] GitHub Actions workflow runs on every push
- [ ] Docker images build successfully in CI
- [ ] Deployment to Cloud Run automatic and functional
- [ ] Database backups scheduled
- [ ] Monitoring dashboards created

**DEPENDENCIES**:
- Backend Agent provides Dockerfile for backend
- Frontend Agent provides Dockerfile for frontend

**PRIORITY**: P0 (Critical Path)  
**EFFORT**: 10-12 hours  
**DUE DATE**: 2025-11-07 (by mid-Week 1)

**NOTES**:
- Use Terraform or GCP Deployment Manager for IaC
- Keep costs under $20/month during Phase 1
- Document all provisioning steps
- Test complete deployment pipeline end-to-end

---

### 📋 CHIEF OF STAFF AGENT

---

**TASK ID**: COS-006  
**TASK NAME**: Orchestrate Phase 1 Coordination  
**OBJECTIVE**: Coordinate all 5 agents, track progress, unblock issues

**CONTEXT**:
- You are the project manager coordinating all specialized agents
- Your job is to read this file, distribute tasks, and keep things on track
- Daily sync on task-board.md and daily-progress.md

**DELIVERABLES**:
- [ ] Daily progress updates in daily-progress.md
- [ ] Blocker identification and escalation
- [ ] Task dependency tracking
- [ ] Weekly summary to Orchestration Agent
- [ ] Team coordination meetings (if needed)

**ACCEPTANCE CRITERIA**:
- [ ] All assigned tasks tracked and updated
- [ ] Blockers reported within 4 hours of discovery
- [ ] Interdependencies managed and communicated
- [ ] Phase 1 completes on schedule (Week 2)

**DEPENDENCIES**:
- Continuous updates from all other agents

**PRIORITY**: P0 (Critical)  
**EFFORT**: 4-6 hours/day throughout Phase 1  
**DUE DATE**: 2025-11-10 (Phase 1 completion)

**NOTES**:
- Read orchestration-directives.md for strategic context
- Update task-board.md daily with progress
- Escalate blockers to blockers.md immediately
- Celebrate team wins in daily-progress.md

---

## Status Legend

- **Not Started**: Task not yet begun
- **In Progress**: Agent actively working on task
- **Blocked**: Task waiting on external dependency or blocker
- **In Review**: Task complete, awaiting approval/review
- **Complete**: Task finished and approved

---

## Phase 1 Timeline

```
Week 1 (Nov 4-10):
├─ Mon-Tue: Tasks COS-001 (DB), COS-004 (Design) in parallel
├─ Tue-Wed: Tasks COS-002 (Auth), COS-003 (Frontend), COS-005 (DevOps)
├─ Thu-Fri: Integration testing, bug fixes
└─ Fri: Internal review

Week 2 (Nov 11-15):
├─ Mon: Design System Approval Gate (COS-004)
├─ Tue-Wed: Phase 1 refinements
├─ Thu: Full stack testing
├─ Fri: Phase 1 Complete Gate & Phase 2 Planning
```

---

## How Agents Update Progress

1. **Each agent** has a status file: `.agent-context/status/[role]-status.md`
2. **Update your status file** when:
   - Starting a new task
   - Hitting a blocker
   - Completing a deliverable
   - Need help or clarification
3. **Chief of Staff reads** all status files and aggregates to task-board.md
4. **Orchestration Agent reads** task-board.md weekly

---

## Next Steps

1. Each agent reads their assigned task(s)
2. Agents read orchestration-directives.md for context
3. Agents read their role-specific WARP.md file
4. Agents begin work immediately
5. Daily updates in status/[role]-status.md
6. Chief of Staff coordinates and removes blockers

---

**Prepared by**: ClariFi Project Orchestration  
**Valid Through**: Phase 1 Completion (2025-11-10)  
**Review Cycle**: Daily updates, weekly rollups
