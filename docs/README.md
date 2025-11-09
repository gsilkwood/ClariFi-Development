# ClariFi Documentation

Welcome to the ClariFi Loan Origination System documentation hub. This directory contains all technical, user, and operational documentation for the project.

## 📚 Documentation Structure

### Getting Started
- **[Developer Onboarding](./guides/DEVELOPER_ONBOARDING.md)** - Setup, architecture overview, common patterns
- **[Architecture Overview](./architecture/ARCHITECTURE.md)** - System design, data flow, component interactions
- **[Database Schema](./architecture/DATABASE_SCHEMA.md)** - Entity relationships, field definitions

### API Documentation
- **[REST API Reference](./api/API_REFERENCE.md)** - Complete endpoint documentation (OpenAPI format)
- **[Authentication Guide](./api/AUTHENTICATION.md)** - JWT, token management, RBAC
- **[Error Handling](./api/ERROR_HANDLING.md)** - Error codes, debugging strategies

### User Guides (Role-Based)
- **[Executive User Guide](./guides/EXECUTIVE_GUIDE.md)** - Dashboard overview, reporting, analytics
- **[Branch Manager Guide](./guides/BRANCH_MANAGER_GUIDE.md)** - Portfolio management, team oversight
- **[Loan Officer Guide](./guides/LOAN_OFFICER_GUIDE.md)** - Loan processing workflow, application handling
- **[Broker Guide](./guides/BROKER_GUIDE.md)** - Loan submission, applicant management
- **[Borrower Guide](./guides/BORROWER_GUIDE.md)** - Application process, document upload, status tracking

### Operations & Deployment
- **[Deployment Runbook](./deployment/DEPLOYMENT_RUNBOOK.md)** - Production deployment steps, rollback procedures
- **[Infrastructure Guide](./deployment/INFRASTRUCTURE.md)** - GCP setup, Cloud SQL, Cloud Run configuration
- **[Security Documentation](./security/SECURITY.md)** - Encryption, compliance, incident response

### Development Guides
- **[Frontend Development](./development/FRONTEND.md)** - Next.js patterns, component structure, testing
- **[Backend Development](./development/BACKEND.md)** - Express.js patterns, API design, database access
- **[Database Development](./development/DATABASE.md)** - Schema design, migrations, optimization
- **[Testing Guide](./development/TESTING.md)** - Unit, integration, E2E testing strategies

### Architecture Diagrams
- **[System Architecture](./architecture/diagrams/SYSTEM_ARCHITECTURE.md)** - High-level system design
- **[Data Flow Diagram](./architecture/diagrams/DATA_FLOW.md)** - Request/response flow
- **[Database ERD](./architecture/diagrams/ERD.md)** - Entity relationship diagram
- **[Infrastructure Diagram](./architecture/diagrams/INFRASTRUCTURE.md)** - Cloud resource topology
- **[Workflow Engine](./architecture/diagrams/WORKFLOW.md)** - 11-stage loan workflow

---

## 🚀 Project Status

**Phase**: Phase 1 - Foundation  
**Status**: 🚀 Active Development (Continuous Sprint)  
**Last Updated**: 2025-11-08

### Phase 1 Objectives
- ✅ Project structure and Git setup
- [→] Database schema design (14 tables)
- [→] JWT authentication system
- [→] Next.js App Router setup
- [→] Design system (25+ components)
- [→] GCP infrastructure provisioning

See [Progress Tracking](./../.agent-context/task-board-sprint.md) for detailed status.

---

## 📖 Quick Navigation

### For Developers
1. Start with [Developer Onboarding](./guides/DEVELOPER_ONBOARDING.md)
2. Review [Architecture Overview](./architecture/ARCHITECTURE.md)
3. Check role-specific guides: [Frontend](./development/FRONTEND.md), [Backend](./development/BACKEND.md), [Database](./development/DATABASE.md)
4. Read [Testing Guide](./development/TESTING.md)

### For DevOps/Infrastructure
1. See [Infrastructure Guide](./deployment/INFRASTRUCTURE.md)
2. Follow [Deployment Runbook](./deployment/DEPLOYMENT_RUNBOOK.md)
3. Review [Security Documentation](./security/SECURITY.md)

### For Business/Product
1. Review [User Guides](#user-guides-role-based) for your role
2. Check [API Reference](./api/API_REFERENCE.md) for integration details
3. See [Security Documentation](./security/SECURITY.md) for compliance

### For QA/Testing
1. Start with [Testing Guide](./development/TESTING.md)
2. Review all [API Documentation](./api/API_REFERENCE.md)
3. Check [Error Handling](./api/ERROR_HANDLING.md)

---

## 🔍 Documentation Standards

All documentation in this project follows these standards:

### Markdown Format
- Use CommonMark-compliant markdown
- Include table of contents for documents >500 words
- Use relative links for cross-references
- Code examples use fenced code blocks with language identifier

### Structure
- **Title**: Concise, descriptive heading
- **Overview**: 1-2 paragraph summary
- **Table of Contents**: For long documents
- **Main Content**: Well-organized sections
- **Examples**: Code samples where appropriate
- **Related**: Links to related documentation

### Examples & Code
- Real code examples from repository
- Include file paths and line numbers
- Use proper syntax highlighting
- Keep examples focused and minimal

### Accessibility
- Use clear, concise language
- Avoid jargon or define it when used
- Use descriptive headings
- Include alt text for diagrams
- High contrast for images

---

## 🔗 Related Resources

- **Main README**: [README.md](../README.md)
- **Project Repository**: [GitHub](https://github.com/clarifi/clarifi-development)
- **Task Board**: [.agent-context/task-board-sprint.md](../.agent-context/task-board-sprint.md)
- **Architecture Decision Log**: `DECISIONS.md` (created during Phase 1)
- **API Status**: See deployment documentation for endpoint health

---

## 📋 Documentation Checklist

### Phase 1 (Foundation)
- [x] Documentation structure created
- [x] README with overview
- [ ] Developer onboarding guide (draft)
- [ ] API reference template
- [ ] Architecture diagrams placeholder
- [ ] User guides outline

### Phase 2 (Core Features)
- [ ] Loan application workflow documentation
- [ ] Document management guide
- [ ] Dashboard user guides (all 5 roles)
- [ ] Integration documentation

### Phase 3 (Workflow & Automation)
- [ ] Workflow engine documentation
- [ ] Email automation templates
- [ ] Task automation guide
- [ ] Reporting documentation

### Phase 4 (Advanced)
- [ ] Advanced features documentation
- [ ] Mobile guide
- [ ] Performance tuning guide
- [ ] Security hardening guide

### Phase 5 (Production)
- [ ] Complete API reference (final)
- [ ] Deployment procedures (final)
- [ ] Troubleshooting guide
- [ ] Release notes and changelog

---

## ✍️ Contributing to Documentation

### For Agents/Developers
1. When implementing a feature, create/update corresponding documentation
2. Keep documentation in sync with code changes
3. Use consistent formatting and structure
4. Link related documentation
5. Update this README if adding new sections

### For Non-Technical Users
1. Use clear, plain language
2. Include step-by-step instructions with screenshots
3. Provide examples and use cases
4. Define technical terms
5. Link to related resources

### Process
1. Create new file in appropriate subdirectory
2. Follow the structure and standards above
3. Link from this README
4. Submit for review before merging
5. Keep version controlled in Git

---

## 📞 Documentation Support

- **Questions?** Check if another document has the answer first
- **Found an error?** Update the document or report it
- **Need clarification?** Create an issue or reach out to the Documentation Agent
- **Have a suggestion?** Contribute your improvements

---

## 📄 License

All documentation is part of the ClariFi project and follows the same license as the codebase.

---

**Last Updated**: 2025-11-08  
**Maintained By**: 📚 Documentation Agent  
**Next Review**: Phase 1 Completion
