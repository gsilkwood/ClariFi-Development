# ClariFi - Loan Origination System

**Enterprise-grade loan origination and CRM system built with multi-agent development**

## Directory Structure

```
~/clarifi-docs/           = Staging directory (documentation, WARP files, downloads)
~/clarifi-development/    = Active project directory (Git repo, development)
```

## Quick Start

### Prerequisites
- Node.js 20+ LTS
- PostgreSQL 15+
- Git

### Setup
```bash
cd ~/clarifi-development/frontend && npm install
cd ~/clarifi-development/backend && npm install
```

Set up database:
```bash
cd ~/clarifi-development/backend
cp .env.example .env
# Edit .env with your database credentials
npx prisma migrate dev
```

Start development servers:
```bash
# Terminal 1: Frontend
cd ~/clarifi-development/frontend && npm run dev

# Terminal 2: Backend
cd ~/clarifi-development/backend && npm run dev
```

## 📁 Project Structure

```
clarifi-development/
├── frontend/          # Next.js 14 application
├── backend/           # Express.js REST API
├── database/          # PostgreSQL schema
├── .agent-context/    # Multi-agent coordination
└── docs/              # Project documentation
```

## 🤖 Warp Multi-Agent Development

This project is optimized for MULTI-AGENT ORCHESTRATION WITH AUTOMATED DEVELOPMENT WORKFLOWS

- **WARP.md files** provide agent-specific guidance
- **.agent-context/** enables agent coordination, communication, and tracking task completion
- **Git repository** is indexed for context-aware assistance

### For Agents
1. Review `WARP.md` in project root
2. Read role-specific WARP.md (frontend/backend/database)
3. Check `.agent-context/task-board.md` for assignments
4. After each completed task, update the task board at `.agent-context/task-board.md` and update your status in `.agent-context/status/`

## 🎯 Key Features

- 32 loan programs (19 real estate + 13 business)
- 11-stage workflow with 64 sub-statuses
- 5 role-specific dashboards
- Complete document management with OCR
- Real-time notifications and automation
- Enterprise-grade security and compliance

## 📚 Documentation

Comprehensive documentation files stored in `~/clarifi-docs/`:

- `WARP-root-v2.md` - Project overview
- `WARP-backend-v2.md` - Backend API development
- `WARP-frontend-v2.md` - Frontend UI development
- `WARP-database-v2.md` - Database architecture
- `INTEGRATION-SUMMARY.md` - Integration details

## 🔒 Security

- AES-256 encryption for PII
- JWT authentication with 15-min expiry
- RBAC on all endpoints
- Comprehensive audit logging
- TRID/HMDA/CCPA/GDPR compliant

## 📊 Tech Stack

**Frontend**: Next.js 14, React 19, TypeScript, Tailwind CSS, shadcn/ui  
**Backend**: Express.js, TypeScript, Prisma, PostgreSQL  
**Infrastructure**: GCP Cloud Run, Cloud SQL, Vercel  
**AI**: Gemini 2.5 Pro, OpenAI (fallback)

## 🧪 Testing

```bash
cd ~/clarifi-development/frontend && npm test
cd ~/clarifi-development/backend && npm test
```

## 📝 License

Proprietary - Clarity Financial

---

**Built with Agentic Development Environment, with Multi-Agent Orchestration**
