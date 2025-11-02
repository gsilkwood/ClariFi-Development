# Database Architecture Guide

**Database**: PostgreSQL 15+  
**ORM**: Prisma  
**Migration Tool**: Prisma Migrate

## Schema Overview

- 14 core tables
- 165+ fields
- 11-stage workflow support
- Full audit logging

## Key Responsibilities

- Maintain schema integrity
- Optimize query performance
- Manage migrations
- Implement security (encryption, RBAC)

## Performance Targets

- Dashboard queries: <100ms
- Single record fetch: <50ms
- Report generation: <500ms

## Code Patterns

See full schema in staging directory WARP-database-v2.md

---

**Owner**: Database Architect Agent
