# ClariFi Multi-Agent Development Environment

**Project**: ClariFi Loan Origination System  
**Version**: 2.0  
**Environment**: Warp IDE Agentic Development

---

## Quick Reference

- **Tech Stack**: Next.js 14, Express.js, PostgreSQL, TypeScript
- **Architecture**: Full-stack monorepo with frontend, backend, database
- **Deployment**: Vercel (frontend), GCP Cloud Run (backend), Cloud SQL (database)
- **AI Integration**: Gemini 2.5 Pro (primary), OpenAI (fallback)

## For Agents

This project uses **role-specific WARP.md files** for detailed guidance:

- `frontend/WARP.md` - UI/UX development, React components, Next.js patterns
- `backend/WARP.md` - REST API, workflow engine, integrations
- `database/WARP.md` - PostgreSQL schema, indexes, migrations

## Project Structure

```
clarifi-development/
├── frontend/          # Next.js application
├── backend/           # Express.js API
├── database/          # PostgreSQL schema
├── .agent-context/    # Agent coordination files
├── docs/              # Project documentation
└── infrastructure/    # DevOps & deployment
```

## Getting Started for Agents

1. Read the appropriate WARP.md for your role
2. Check `.agent-context/task-board.md` for current tasks
3. Review `.agent-context/status/[your-role]-status.md` for context
4. Follow patterns established in existing code
5. Update your status file when completing work

## Key Principles

- **Type Safety**: Strict TypeScript everywhere
- **Testing**: >80% coverage required
- **Security**: Input validation, auth on all protected endpoints
- **Performance**: API <500ms, page load <2s
- **Accessibility**: WCAG 2.1 AA compliance

---

**Last Updated**: November 2, 2025  
**Maintained By**: Project Setup Lead
