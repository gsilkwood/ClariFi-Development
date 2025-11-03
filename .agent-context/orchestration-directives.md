# Orchestration Agent Directives

**Project**: ClariFi Loan Origination System  
**Last Updated**: 2025-11-03  
**Status**: Project Initialization Complete - Ready for Phase 1

---

## Current Phase: Phase 0 → Phase 1 Transition

### ✅ Phase 0 Completion Status
- [x] Project structure created
- [x] Git repository initialized
- [x] Agent context framework established
- [x] Environment configuration template created
- [x] Docker orchestration configured
- [x] WARP.md guidance completed
- [x] README and documentation ready

### Next Action: Phase 1 Foundation (Weeks 1-2)

**Objective**: Build foundational infrastructure and authentication system

**Primary Agents Assigned**:
1. **DevOps Agent** - GCP infrastructure provisioning, Docker setup
2. **Database Agent** - Complete Prisma schema (14 tables), migrations
3. **Backend Agent** - Express.js boilerplate, authentication endpoints
4. **Frontend Agent** - Next.js App Router setup, page structure
5. **UI/UX Agent** - Design system creation (25+ components)

---

## Strategic Priorities

### Cost Management
- **Primary Cloud**: GCP ($1,500 credits available)
- **AI/LLM**: Gemini 2.5 Pro (free API key, 2,500 req/day limit)
- **Fallback AI**: Azure OpenAI GPT-4o ($2,500 credits available)
- **Target Monthly Cost**: <$50 for MVP phase

### Technology Stack
**Locked Decisions** (no changes without orchestration approval):
- Frontend: Next.js 14 + React 19 + TypeScript + Tailwind CSS
- Backend: Express.js + TypeScript + Prisma
- Database: PostgreSQL 15+ (Cloud SQL)
- Deployment: Vercel (frontend), GCP Cloud Run (backend)
- Authentication: JWT with 15-min expiry + refresh tokens

---

## Phase 1 Deliverables (Weeks 1-2)

### Must-Have by End of Phase 1
- [ ] GCP project provisioned with Cloud SQL database
- [ ] Prisma schema with all 14 required tables
- [ ] Database migrations applied successfully
- [ ] JWT authentication system operational
- [ ] Basic CRUD endpoints for core entities
- [ ] Design system with 25+ reusable components
- [ ] CI/CD pipeline (GitHub Actions) functional
- [ ] Local development stack runnable via docker-compose

### Phase 1 Success Metrics
- Database schema 100% complete with indexes
- Authentication endpoints all passing tests
- Design system approved by human
- Deployment pipeline active
- Zero critical security vulnerabilities identified

---

## Agent Communication Protocol

### File Structure (.agent-context/)
- **orchestration-directives.md** - This file (strategic decisions, phase directives)
- **chief-of-staff-assignments.md** - Individual task assignments to agents
- **task-board.md** - Kanban board (To Do, In Progress, Done)
- **blockers.md** - Active issues requiring escalation
- **daily-progress.md** - Daily standup updates from all agents
- **status/[agent]-status.md** - Per-agent detailed status

### Daily Workflow
1. Chief of Staff reads this file for current phase
2. Chief of Staff breaks phase into tasks → chief-of-staff-assignments.md
3. Each agent reads their assignments
4. Agents work and update status/[agent]-status.md
5. Chief of Staff aggregates to task-board.md
6. Daily at 09:00 UTC → daily-progress.md is updated
7. Orchestration Agent reviews progress 1x weekly

---

## Risk Mitigation

### Technical Risks
**Risk**: Prisma schema complexity  
**Mitigation**: Start with core 5 tables, expand incrementally  
**Owner**: Database Agent

**Risk**: JWT implementation security  
**Mitigation**: Use industry-standard libraries (jsonwebtoken), audit before Phase 2  
**Owner**: Backend Agent + QA Agent

**Risk**: Docker compose not working locally  
**Mitigation**: Test with multiple OS, provide troubleshooting guide  
**Owner**: DevOps Agent

### Timeline Risks
**Risk**: Design system iteration delays  
**Mitigation**: Human approval gate at Week 2, lock design at that point  
**Owner**: UI/UX Agent

**Risk**: Database provisioning delays on GCP  
**Mitigation**: Use local PostgreSQL initially, migrate to Cloud SQL by Week 2  
**Owner**: DevOps + Database Agents

---

## Approval Gates

### Gate 1: Phase 0 Complete ✅
**Status**: APPROVED (Project Initialization Complete)  
**Date**: 2025-11-03  
**Items Verified**:
- Project structure complete
- Configuration files created
- Environment template ready
- Docker compose ready

### Gate 2: Design System Approval (Due Week 2)
**Gate Owner**: Human (Product/Design Lead)  
**Deliverable**: UI/UX Design System with 25+ components  
**Criteria**:
- [ ] Components visually beautiful and novel
- [ ] WCAG 2.1 AA accessibility compliance
- [ ] Dark mode support implemented
- [ ] Responsive across all breakpoints
- [ ] Component documentation complete

### Gate 3: Database Schema Approval (Due Week 2)
**Gate Owner**: Orchestration Agent (Architecture Review)  
**Deliverable**: Complete 14-table schema with migrations  
**Criteria**:
- [ ] All 14 tables implemented
- [ ] Foreign keys and constraints correct
- [ ] Indexes optimized for known queries
- [ ] Migrations runnable from blank database
- [ ] Schema supports all 32 loan programs

### Gate 4: Phase 1 Complete (Due Week 2)
**Gate Owner**: Chief of Staff  
**Deliverable**: Phase 1 milestone verification  
**Criteria**:
- [ ] Docker stack runs locally
- [ ] All core endpoints functional
- [ ] Test coverage >80%
- [ ] Zero critical bugs
- [ ] Team consensus on readiness for Phase 2

---

## Communication Escalation Path

**Level 1 - Agent to Agent**:
- Direct read/write to .agent-context/ files
- Agent A writes question in blockers.md
- Agent B reads and responds in status file

**Level 2 - Agent to Chief of Staff**:
- Blocker that affects multiple agents
- Timeline concern
- Resource conflict
- Chief of Staff reads blockers.md, routes to appropriate agent

**Level 3 - Chief of Staff to Orchestration Agent**:
- Architectural decision needed
- Technology choice unclear
- Phase timeline at risk
- Scope creep detected
- Budget concern

**Level 4 - Orchestration to Human**:
- Project-level strategic decision
- Human approval gate reached
- Risk mitigation strategy needed
- Scope change requested

---

## Next Steps

1. **Chief of Staff Agent** reads this directive
2. **Chief of Staff** breaks Phase 1 into 6 major tasks
3. **Chief of Staff** assigns tasks in chief-of-staff-assignments.md
4. **Each Agent** reads assignment and begins work
5. **Daily**: Agents update status/[agent]-status.md
6. **Weekly**: Orchestration Agent reviews progress

---

## Notes for Agents

- Read the appropriate WARP.md file for your role (root/frontend/backend/database)
- Check .agent-context/task-board.md for current tasks
- Update your status file every 2-4 hours during active work
- Report blockers immediately to blockers.md
- Ask questions in blockers.md with @agent-name mentions
- Celebrate milestones in daily-progress.md

---

**Prepared by**: Project Orchestration Lead  
**Directive Valid Until**: Phase 1 Completion (Week 2)  
**Next Review**: 2025-11-10
