# ClariFi REST API Reference

## Overview

The ClariFi REST API provides programmatic access to the loan origination system. All endpoints require authentication via JWT tokens and return JSON responses.

**Base URL**: `https://api.clarifi.dev/v1` (production) | `http://localhost:4000/v1` (development)  
**Response Format**: JSON  
**Authentication**: JWT Bearer Token  

---

## Table of Contents

- [Authentication](#authentication)
- [Request/Response Format](#requestresponse-format)
- [Error Handling](#error-handling)
- [Endpoints](#endpoints)
  - [Authentication Endpoints](#authentication-endpoints)
  - [User Management](#user-management)
  - [Loan Applications](#loan-applications)
  - [Document Management](#document-management)
  - [Workflow](#workflow)
  - [Reporting](#reporting)

---

## Authentication

### JWT Token Flow

1. User calls `POST /auth/login` with email and password
2. Server returns access token (15 min expiry) and refresh token (7 day expiry)
3. Client includes token in `Authorization: Bearer <token>` header for subsequent requests
4. When access token expires, call `POST /auth/refresh` with refresh token
5. Server returns new access token

### Token Storage (Frontend)

- **Access Token**: Store in memory or secure session (not localStorage if possible)
- **Refresh Token**: Store in httpOnly cookie (if possible) or secure storage
- **No sensitive data in tokens**: Tokens are JWT but should not contain PII

### RBAC (Role-Based Access Control)

Five roles with different permissions:

| Role | Access |
|------|--------|
| **Admin** | Full system access, user management, configuration |
| **Executive** | View all applications, analytics, reporting |
| **Branch Manager** | Manage branch staff and their applications |
| **Loan Officer** | Process applications, update status |
| **Broker** | Submit applications on behalf of borrowers |

---

## Request/Response Format

### Request Headers

```http
POST /v1/auth/login HTTP/1.1
Host: api.clarifi.dev
Content-Type: application/json
Accept: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Response Format

All responses follow this format:

```json
{
  "success": true,
  "data": {
    // Response-specific data
  },
  "meta": {
    "timestamp": "2025-11-08T23:00:00Z",
    "version": "1.0.0"
  }
}
```

### Error Response

```json
{
  "success": false,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Email or password is incorrect",
    "details": {}
  },
  "meta": {
    "timestamp": "2025-11-08T23:00:00Z",
    "version": "1.0.0"
  }
}
```

---

## Error Handling

### HTTP Status Codes

| Code | Meaning | Example |
|------|---------|---------|
| **200** | OK | Successful request |
| **201** | Created | Resource successfully created |
| **400** | Bad Request | Invalid parameters or validation error |
| **401** | Unauthorized | Missing or invalid authentication token |
| **403** | Forbidden | Authenticated but insufficient permissions |
| **404** | Not Found | Resource does not exist |
| **409** | Conflict | Resource conflict (e.g., duplicate email) |
| **500** | Internal Server Error | Server error |
| **503** | Service Unavailable | Temporary service issue |

### Error Codes

See [Error Handling Guide](./ERROR_HANDLING.md) for complete list of application-specific error codes.

---

## Endpoints

### Authentication Endpoints

#### POST /auth/register

Register a new user account.

**Request:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe",
  "role": "loan_officer"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "usr_12345",
      "email": "john@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "loan_officer",
      "createdAt": "2025-11-08T23:00:00Z"
    }
  }
}
```

**Errors:**
- `400`: Invalid email format or weak password
- `409`: Email already registered
- `422`: Missing required fields

---

#### POST /auth/login

Authenticate user and receive tokens.

**Request:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "ref_abc123xyz789...",
    "user": {
      "id": "usr_12345",
      "email": "john@example.com",
      "role": "loan_officer"
    }
  }
}
```

**Errors:**
- `400`: Invalid credentials
- `401`: Unauthorized

---

#### POST /auth/refresh

Refresh access token using refresh token.

**Request:**
```json
{
  "refreshToken": "ref_abc123xyz789..."
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 900
  }
}
```

**Errors:**
- `401`: Invalid or expired refresh token

---

#### POST /auth/logout

Invalidate current session (optional for stateless JWT).

**Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "Successfully logged out"
  }
}
```

---

### User Management

#### GET /users/me

Get current authenticated user.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "usr_12345",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "loan_officer",
    "createdAt": "2025-11-08T23:00:00Z",
    "lastLogin": "2025-11-08T23:00:00Z"
  }
}
```

---

#### GET /users/{userId}

Get user details (Admin/Manager only).

**Parameters:**
- `userId` (path) - User ID

**Response (200):** Same as GET /users/me

**Errors:**
- `403`: Insufficient permissions
- `404`: User not found

---

### Loan Applications

#### POST /applications

Create a new loan application.

**Request:**
```json
{
  "loanProgram": "CONVENTIONAL_30_YEAR",
  "applicantEmail": "applicant@example.com",
  "propertyAddress": "123 Main St, Springfield, IL",
  "loanAmount": 350000
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "app_67890",
    "status": "DRAFT",
    "currentStep": 1,
    "totalSteps": 6,
    "loanProgram": "CONVENTIONAL_30_YEAR",
    "createdAt": "2025-11-08T23:00:00Z"
  }
}
```

---

#### GET /applications

List applications (filtered by user role).

**Query Parameters:**
- `status` - Filter by status (DRAFT, SUBMITTED, APPROVED, REJECTED)
- `loanProgram` - Filter by program
- `limit` - Results per page (default: 20, max: 100)
- `offset` - Pagination offset

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "app_67890",
      "status": "SUBMITTED",
      "applicantName": "John Applicant",
      "loanAmount": 350000,
      "createdAt": "2025-11-08T23:00:00Z"
    }
  ],
  "meta": {
    "total": 42,
    "limit": 20,
    "offset": 0
  }
}
```

---

#### GET /applications/{applicationId}

Get application details.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "app_67890",
    "status": "SUBMITTED",
    "currentStep": 3,
    "totalSteps": 6,
    "applicant": {
      "firstName": "John",
      "lastName": "Applicant",
      "email": "applicant@example.com",
      "phone": "+1-555-0123"
    },
    "property": {
      "address": "123 Main St, Springfield, IL",
      "city": "Springfield",
      "state": "IL",
      "zip": "62701"
    },
    "loanDetails": {
      "program": "CONVENTIONAL_30_YEAR",
      "amount": 350000,
      "term": 360
    },
    "documents": [
      {
        "id": "doc_11111",
        "type": "TAX_RETURN",
        "status": "VERIFIED",
        "uploadedAt": "2025-11-08T23:00:00Z"
      }
    ],
    "timeline": {
      "submittedAt": "2025-11-08T23:00:00Z",
      "underReviewAt": null,
      "approvedAt": null
    }
  }
}
```

---

#### PUT /applications/{applicationId}

Update application (status, details).

**Request:**
```json
{
  "status": "APPROVED",
  "notes": "Application meets all criteria"
}
```

**Response (200):** Updated application object

**Errors:**
- `400`: Invalid status transition
- `403`: User cannot modify this application
- `404`: Application not found

---

### Document Management

#### POST /applications/{applicationId}/documents

Upload document for application.

**Form Data:**
- `file` (multipart/form-data) - Document file
- `type` - Document type (TAX_RETURN, PAY_STUB, BANK_STATEMENT, etc.)

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "doc_11111",
    "type": "TAX_RETURN",
    "fileName": "2024_tax_return.pdf",
    "status": "PENDING_REVIEW",
    "uploadedAt": "2025-11-08T23:00:00Z",
    "size": 2048576
  }
}
```

---

#### GET /applications/{applicationId}/documents/{documentId}

Get document details.

**Response (200):** Document object

---

#### DELETE /applications/{applicationId}/documents/{documentId}

Delete document (before verification).

**Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "Document deleted successfully"
  }
}
```

**Errors:**
- `403`: Cannot delete verified document
- `404`: Document not found

---

### Workflow

#### GET /workflows/{applicationId}/timeline

Get application workflow timeline.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "applicationId": "app_67890",
    "currentStage": "UNDER_REVIEW",
    "stages": [
      {
        "stage": "DRAFT",
        "status": "COMPLETED",
        "completedAt": "2025-11-08T22:00:00Z"
      },
      {
        "stage": "SUBMITTED",
        "status": "COMPLETED",
        "completedAt": "2025-11-08T22:30:00Z"
      },
      {
        "stage": "UNDER_REVIEW",
        "status": "IN_PROGRESS",
        "startedAt": "2025-11-08T22:45:00Z"
      }
    ]
  }
}
```

---

### Reporting

#### GET /reports/dashboard

Get dashboard metrics and summary.

**Query Parameters:**
- `dateRange` - "today" | "week" | "month" | "custom"
- `startDate` - ISO date (required if dateRange=custom)
- `endDate` - ISO date (required if dateRange=custom)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "totalApplications": 127,
    "avgProcessingTime": "4.2 days",
    "approvalRate": "78.5%",
    "pendingApplications": 23,
    "applicationsNeedingAttention": 5
  }
}
```

---

## Rate Limiting

- **Rate Limit**: 1000 requests per hour per API key
- **Headers**: 
  - `X-RateLimit-Limit`: 1000
  - `X-RateLimit-Remaining`: 999
  - `X-RateLimit-Reset`: 1699460400

---

## Pagination

For endpoints returning lists:

```json
{
  "data": [...],
  "meta": {
    "total": 500,
    "limit": 20,
    "offset": 0,
    "hasMore": true
  }
}
```

Use `offset` for pagination: `?offset=20` for next page, `?offset=40` for third page, etc.

---

## OpenAPI Specification

Complete OpenAPI 3.0 specification available at:
- `/v1/docs/openapi.json` - Machine-readable spec
- `/v1/docs` - Swagger UI documentation

---

## Related Documentation

- [Authentication Guide](./AUTHENTICATION.md) - Detailed auth setup
- [Error Handling](./ERROR_HANDLING.md) - Error codes and troubleshooting
- [API Status](./API_STATUS.md) - Endpoint health and monitoring

---

**Last Updated**: 2025-11-08  
**API Version**: 1.0.0 (Draft)  
**Status**: Under Development (Phase 1)
