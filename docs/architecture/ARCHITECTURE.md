# ClariFi System Architecture

## Overview

ClariFi is a modern, cloud-native loan origination system built with a microservices-ready architecture. This document provides a high-level understanding of the system design, component interactions, and data flow.

**Status**: Phase 1 - Foundation Architecture (In Development)

---

## Table of Contents

- [System Components](#system-components)
- [Architecture Layers](#architecture-layers)
- [Data Flow](#data-flow)
- [Technology Stack](#technology-stack)
- [Security Architecture](#security-architecture)
- [Scalability & Performance](#scalability--performance)
- [Related Diagrams](#related-diagrams)

---

## System Components

### 1. Frontend Application (Next.js 14)

**Location**: `frontend/`  
**Purpose**: User-facing web application  
**Technology**: Next.js 14, React 19, TypeScript, Tailwind CSS, shadcn/ui

**Key Features**:
- Five role-specific dashboards
- 6-step loan application workflow
- Document management UI
- Real-time status updates
- Mobile-responsive design

**Responsibilities**:
- Render user interfaces
- Validate input on client
- Manage local authentication state
- Call backend APIs
- Display real-time updates via WebSocket

### 2. Backend API (Express.js)

**Location**: `backend/src/`  
**Purpose**: Business logic and data access layer  
**Technology**: Express.js, TypeScript, Prisma ORM

**Key Features**:
- RESTful API (30+ endpoints)
- JWT authentication & authorization
- Workflow state machine (11 stages)
- Document processing pipeline
- Email/SMS automation
- Third-party integrations

**Responsibilities**:
- Handle HTTP requests
- Enforce business rules and validations
- Manage database transactions
- Trigger automation workflows
- Log all operations for audit trail

### 3. Database (PostgreSQL)

**Location**: `backend/prisma/`  
**Purpose**: Persistent data storage  
**Technology**: PostgreSQL 15+, Prisma Migrations

**Key Tables**:
- Users (authentication, RBAC)
- Applications (loan data)
- Documents (file references)
- Workflow (state transitions)
- Audit Log (compliance tracking)

**Characteristics**:
- 14 core tables
- 165+ fields
- Full ACID compliance
- Row-level security policies
- Automated backups

### 4. External Services

**Third-Party Integrations**:

| Service | Purpose | Provider |
|---------|---------|----------|
| **Email** | Transactional emails | SendGrid |
| **SMS** | Notifications | AWS SNS |
| **OCR** | Document parsing | Gemini 2.5 Pro |
| **Error Tracking** | Logging & monitoring | Sentry |
| **File Storage** | Document hosting | GCP Cloud Storage |
| **Credit Bureau** | Credit reports | (Phase 4+) |

---

## Architecture Layers

### Layer 1: Presentation (Frontend)

```
┌─────────────────────────────────────┐
│     User Interface (Next.js)         │
│  ┌─────────────────────────────────┐ │
│  │ Pages & Layouts                 │ │
│  │ (App Router)                    │ │
│  └─────────────────────────────────┘ │
│  ┌─────────────────────────────────┐ │
│  │ React Components & Hooks        │ │
│  └─────────────────────────────────┘ │
│  ┌─────────────────────────────────┐ │
│  │ Zustand State Management        │ │
│  └─────────────────────────────────┘ │
│  ┌─────────────────────────────────┐ │
│  │ API Client (Axios)              │ │
│  └─────────────────────────────────┘ │
└─────────────────────────────────────┘
           ↓ HTTP/JSON
      [Backend API]
```

### Layer 2: API Gateway & Middleware (Express.js)

```
┌──────────────────────────────────────┐
│    Express.js Application            │
│  ┌────────────────────────────────┐  │
│  │ Middleware Stack               │  │
│  │ • CORS                         │  │
│  │ • Authentication (JWT)         │  │
│  │ • Request Validation           │  │
│  │ • Error Handling               │  │
│  │ • Rate Limiting                │  │
│  └────────────────────────────────┘  │
│  ┌────────────────────────────────┐  │
│  │ Routing & Controllers          │  │
│  └────────────────────────────────┘  │
└──────────────────────────────────────┘
           ↓ Prisma ORM
      [Database]
```

### Layer 3: Business Logic (Services)

```
┌──────────────────────────────────────┐
│    Service Layer                     │
│  ┌────────────────────────────────┐  │
│  │ Authentication Service         │  │
│  │ Application Service            │  │
│  │ Document Service               │  │
│  │ Workflow Service               │  │
│  │ Notification Service           │  │
│  │ Integration Service            │  │
│  └────────────────────────────────┘  │
└──────────────────────────────────────┘
           ↓ Business Logic
      [Data Access]
```

### Layer 4: Data Access (Prisma ORM)

```
┌──────────────────────────────────────┐
│    Prisma ORM & Schema               │
│  ┌────────────────────────────────┐  │
│  │ Type-Safe Query Generation     │  │
│  │ Connection Pooling             │  │
│  │ Transaction Management         │  │
│  │ Migration System               │  │
│  └────────────────────────────────┘  │
└──────────────────────────────────────┘
           ↓ SQL
      [PostgreSQL]
```

### Layer 5: Data Storage (PostgreSQL)

```
┌──────────────────────────────────────┐
│    PostgreSQL Database               │
│  ┌────────────────────────────────┐  │
│  │ Core Tables                    │  │
│  │ • Users                        │  │
│  │ • Applications                 │  │
│  │ • Documents                    │  │
│  │ • Workflow Events              │  │
│  │ • Audit Log                    │  │
│  │                                │  │
│  │ Indexes & Constraints          │  │
│  │ • Performance indexes          │  │
│  │ • Foreign key constraints      │  │
│  │ • Row-level security           │  │
│  └────────────────────────────────┘  │
└──────────────────────────────────────┘
```

---

## Data Flow

### Typical Request Flow

```
1. USER INTERACTION (Frontend)
   └─→ User clicks "Submit Application"

2. FRONTEND PROCESSING
   └─→ React component validates input
   └─→ Zustand updates local state
   └─→ Axios constructs HTTP request
   └─→ JWT token added to Authorization header

3. HTTP REQUEST
   └─→ POST /v1/applications
   └─→ JSON payload sent to backend

4. BACKEND MIDDLEWARE
   └─→ CORS middleware processes request
   └─→ Auth middleware validates JWT
   └─→ Request validation middleware
   └─→ Rate limiter checks quota

5. ROUTE HANDLING
   └─→ Router matches endpoint
   └─→ Controller receives request
   └─→ Controller parameters extracted

6. BUSINESS LOGIC (Service)
   └─→ Application service processes logic
   └─→ Validation rules enforced
   └─→ Authorization checked (RBAC)
   └─→ Workflow state verified

7. DATABASE TRANSACTION
   └─→ Prisma generates SQL
   └─→ PostgreSQL executes transaction
   └─→ Data persisted atomically
   └─→ Indexes updated

8. AUTOMATION TRIGGERS
   └─→ Workflow service triggered
   └─→ Email service queues notification
   └─→ Audit log recorded

9. RESPONSE GENERATION
   └─→ Service returns result
   └─→ Controller formats response
   └─→ Middleware adds metadata
   └─→ JSON response created

10. HTTP RESPONSE
    └─→ 201 Created with resource data
    └─→ Sent to client

11. FRONTEND UPDATE
    └─→ Axios interceptor processes response
    └─→ Zustand state updated
    └─→ React component re-renders
    └─→ User sees confirmation
```

---

## Technology Stack

### Frontend
- **Framework**: Next.js 14 (App Router, React 19)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Testing**: Vitest, React Testing Library
- **Linting**: ESLint, Prettier

### Backend
- **Framework**: Express.js
- **Language**: TypeScript (strict mode)
- **ORM**: Prisma
- **Database**: PostgreSQL 15+
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcrypt
- **Testing**: Jest, supertest
- **Logging**: Winston, Sentry
- **Linting**: ESLint, Prettier

### Infrastructure
- **Cloud Provider**: GCP (primary), Azure & AWS (backup)
- **Frontend Hosting**: Vercel
- **Backend Runtime**: GCP Cloud Run
- **Database**: GCP Cloud SQL (PostgreSQL)
- **File Storage**: GCP Cloud Storage
- **CI/CD**: GitHub Actions
- **Containerization**: Docker
- **Secrets Manager**: GCP Secret Manager

### Monitoring & Observability
- **Error Tracking**: Sentry
- **Logging**: Cloud Logging (GCP)
- **Monitoring**: Cloud Monitoring (GCP)
- **Metrics**: Prometheus (future)
- **Tracing**: OpenTelemetry (future)

---

## Security Architecture

### Authentication Flow

```
┌──────────────┐
│   User       │
│   (Browser)  │
└──────┬───────┘
       │ 1. Login credentials
       ↓
┌──────────────────────┐
│  Backend             │
│  (Authentication)    │
│                      │
│  1. Hash password    │
│  2. Validate         │
│  3. Generate JWT     │
│  4. Return tokens    │
└──────┬───────────────┘
       │ 2. Tokens (access + refresh)
       ↓
┌──────────────────────┐
│  Frontend            │
│  (Zustand)           │
│                      │
│  1. Store tokens     │
│  2. Add to requests  │
└──────┬───────────────┘
       │ 3. JWT in Authorization header
       ↓
┌──────────────────────┐
│  Backend             │
│  (Protected routes)  │
│                      │
│  1. Verify JWT       │
│  2. Extract user     │
│  3. Enforce RBAC     │
└──────────────────────┘
```

### Role-Based Access Control (RBAC)

```
Roles & Permissions:

┌─────────────────────────────────────┐
│         Admin                       │
│  • User management                  │
│  • System configuration             │
│  • Full data access                 │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│         Executive                   │
│  • View all applications            │
│  • Analytics & reporting            │
│  • Approval authority               │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│      Branch Manager                 │
│  • Manage branch applications       │
│  • Staff oversight                  │
│  • Portfolio reporting              │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│       Loan Officer                  │
│  • Process applications             │
│  • Request documents                │
│  • Update status                    │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│          Broker                     │
│  • Submit applications              │
│  • Manage applicants                │
│  • Limited data access              │
└─────────────────────────────────────┘
```

### Data Protection

- **Encryption at Transit**: HTTPS/TLS 1.3
- **Encryption at Rest**: PostgreSQL with encryption
- **Sensitive Data**: PII encrypted in database
- **Password Hashing**: bcrypt with salt rounds
- **Token Security**: Short expiry (15 min), rotation support
- **SQL Injection Prevention**: Prisma parameterized queries
- **CSRF Protection**: Origin verification

---

## Scalability & Performance

### Horizontal Scaling

```
┌─────────────┐
│  Vercel     │  (Frontend - auto-scaling)
└─────────────┘

┌──────────────────────────┐
│  Cloud Run               │
│  ├─ Backend Instance 1   │
│  ├─ Backend Instance 2   │
│  ├─ Backend Instance 3   │
│  └─ ...                  │
└──────────────────────────┘

┌─────────────┐
│  Cloud SQL  │  (Database - vertical scaling)
└─────────────┘
```

### Performance Targets

| Component | Target | Strategy |
|-----------|--------|----------|
| Page Load | <2 sec | Code splitting, lazy loading |
| API Response | <500 ms | Query optimization, caching |
| Dashboard Query | <100 ms | Indexes, materialized views |
| Document Upload | <5 sec | Async processing, progress UI |

### Caching Strategy

- **Frontend**: Browser cache + service worker
- **Backend**: Redis (future Phase 2+)
- **Database**: Query result caching via ORM

---

## Deployment Architecture

See [Infrastructure Diagram](./diagrams/INFRASTRUCTURE.md) for details on GCP deployment.

---

## Related Diagrams

- **[System Architecture Diagram](./diagrams/SYSTEM_ARCHITECTURE.md)** - High-level system boxes
- **[Data Flow Diagram](./diagrams/DATA_FLOW.md)** - Request/response flows
- **[Database ERD](./diagrams/ERD.md)** - Entity relationships
- **[Infrastructure Diagram](./diagrams/INFRASTRUCTURE.md)** - Cloud resource topology
- **[Workflow Engine Diagram](./diagrams/WORKFLOW.md)** - 11-stage loan workflow

---

## Design Decisions

For architectural decisions and their rationale, see `DECISIONS.md` (created during Phase 1).

---

## Next Steps

- Phase 2: Add microservices for document processing
- Phase 3: Implement message queue for async jobs
- Phase 4: Add machine learning for loan recommendations
- Phase 5: Implement real-time WebSocket communication

---

**Status**: Phase 1 - Foundation (In Development)  
**Last Updated**: 2025-11-08  
**Maintained By**: 📚 Documentation Agent + 🎯 Orchestration Agent
