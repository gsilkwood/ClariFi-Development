# ClariFi API Documentation

## Overview

The ClariFi API is a RESTful service built with Express.js and TypeScript. It provides endpoints for user authentication, loan application management, document handling, and workflow management.

## Base URL

```
http://localhost:4000/api
```

## Authentication

### Access Token
- Format: Bearer token in Authorization header
- Duration: 15 minutes
- Sent in response body

### Refresh Token
- Stored in httpOnly cookie
- Duration: 7 days
- Auto-rotated on refresh
- Cannot be accessed via JavaScript

```bash
curl -H "Authorization: Bearer <access_token>" \
  http://localhost:4000/api/loans
```

## API Endpoints

### Authentication

#### Register
```
POST /auth/register
```

Request:
```json
{
  "email": "user@example.com",
  "username": "username",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe"
}
```

Response: `201 Created`
```json
{
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "username": "username",
    "role": { "id": 1, "name": "BORROWER" }
  },
  "tokens": {
    "accessToken": "jwt_token",
    "expiresIn": 900
  }
}
```

#### Login
```
POST /auth/login
```

Request:
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

Response: `200 OK`
```json
{
  "user": { /* user object */ },
  "tokens": { /* tokens */ }
}
```

#### Refresh Token
```
POST /auth/refresh
```

Response: `200 OK`
```json
{
  "accessToken": "new_jwt_token",
  "expiresIn": 900
}
```

#### Logout
```
POST /auth/logout
Authorization: Bearer <access_token>
```

#### Request Password Reset
```
POST /auth/password-reset/request
```

Request:
```json
{
  "email": "user@example.com"
}
```

#### Reset Password
```
POST /auth/password-reset/confirm
```

Request:
```json
{
  "resetToken": "token",
  "newPassword": "NewSecurePass123!"
}
```

#### Change Password
```
POST /auth/password/change
Authorization: Bearer <access_token>
```

Request:
```json
{
  "currentPassword": "CurrentPass123!",
  "newPassword": "NewPass123!"
}
```

### Loan Programs

#### Get Active Programs
```
GET /programs
```

Response: `200 OK`
```json
[
  {
    "id": 1,
    "programCode": "HOME-100",
    "programName": "Home Mortgage",
    "description": "...",
    "minAmount": 100000,
    "maxAmount": 1000000,
    "minTermMonths": 120,
    "maxTermMonths": 360
  }
]
```

#### Get Program by Category
```
GET /programs/category?category=MORTGAGE
```

#### Get Program Details
```
GET /programs/:id
```

#### Get Program Statistics
```
GET /programs/:id/stats
```

### Loans

#### Create Loan Application
```
POST /loans
Authorization: Bearer <access_token>
```

Request:
```json
{
  "amount": 250000,
  "term": 360,
  "purpose": "Home purchase",
  "employmentStatus": "EMPLOYED",
  "employerName": "Acme Corp",
  "annualIncome": 120000,
  "borrowerEmail": "borrower@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "loanProgramId": 1
}
```

Response: `201 Created`
```json
{
  "id": "loan_id",
  "loanNumber": "LOAN-1234567890",
  "loanAmount": 250000,
  "status": "DRAFT",
  "purpose": "Home purchase",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

#### Get Loans
```
GET /loans?page=1&limit=10
Authorization: Bearer <access_token>
```

Response: `200 OK`
```json
{
  "data": [ /* loan objects */ ],
  "pagination": {
    "total": 25,
    "skip": 0,
    "take": 10,
    "pages": 3
  }
}
```

#### Get Loan Details
```
GET /loans/:id
Authorization: Bearer <access_token>
```

#### Update Loan
```
PUT /loans/:id
Authorization: Bearer <access_token>
```

Request:
```json
{
  "amount": 260000,
  "purpose": "Updated purpose"
}
```

#### Submit for Review
```
POST /loans/:id/submit
Authorization: Bearer <access_token>
```

#### Get Loan Status
```
GET /loans/:id/status
Authorization: Bearer <access_token>
```

#### Get Status History
```
GET /loans/:id/history
Authorization: Bearer <access_token>
```

#### Delete Loan
```
DELETE /loans/:id
Authorization: Bearer <access_token>
```

### Documents

#### Upload Document
```
POST /loans/:id/documents
Authorization: Bearer <access_token>
Content-Type: multipart/form-data
```

Form Parameters:
- `file`: Binary file
- `documentType`: Document type enum
- `documentName`: Optional document name
- `isRequired`: Optional boolean

Response: `201 Created`

#### List Documents
```
GET /loans/:id/documents
Authorization: Bearer <access_token>
```

#### Verify Document
```
POST /documents/:docId/verify
Authorization: Bearer <access_token>
```

Request:
```json
{
  "verificationStatus": "VERIFIED",
  "notes": "Document verified"
}
```

#### Delete Document
```
DELETE /documents/:docId
Authorization: Bearer <access_token>
```

### Notifications

#### Get Notifications
```
GET /notifications?page=1&limit=20
Authorization: Bearer <access_token>
```

#### Get Unread Notifications
```
GET /notifications/unread
Authorization: Bearer <access_token>
```

#### Mark as Opened
```
POST /notifications/:id/mark-opened
Authorization: Bearer <access_token>
```

#### Delete Notification
```
DELETE /notifications/:id
Authorization: Bearer <access_token>
```

#### Clear All Notifications
```
POST /notifications/clear-all
Authorization: Bearer <access_token>
```

### Activities

#### Get Recent Activities
```
GET /activities?page=1&limit=100
Authorization: Bearer <access_token>
```

#### Get User Activities
```
GET /activities/user/my-activities?page=1&limit=50
Authorization: Bearer <access_token>
```

#### Get Loan Activities
```
GET /activities/loans/:loanId?page=1&limit=50
Authorization: Bearer <access_token>
```

#### Get Activities by Action
```
GET /activities/action?action=CREATED&page=1&limit=50
Authorization: Bearer <access_token>
```

### Tasks

#### Create Task
```
POST /tasks
Authorization: Bearer <access_token>
```

Request:
```json
{
  "loanId": "loan_id",
  "taskType": "DOCUMENT_REVIEW",
  "title": "Review income documents",
  "description": "Review income statement and tax returns",
  "priority": "HIGH",
  "dueDate": "2024-02-01T00:00:00Z"
}
```

#### Get My Tasks
```
GET /tasks/my-tasks?page=1&limit=50
Authorization: Bearer <access_token>
```

#### Get Loan Tasks
```
GET /tasks/loans/:loanId?page=1&limit=50
Authorization: Bearer <access_token>
```

#### Get Overdue Tasks
```
GET /tasks/overdue
Authorization: Bearer <access_token>
```

#### Get Task Statistics
```
GET /tasks/stats
Authorization: Bearer <access_token>
```

#### Update Task Status
```
PATCH /tasks/:taskId/status
Authorization: Bearer <access_token>
```

Request:
```json
{
  "status": "COMPLETED"
}
```

#### Assign Task
```
PATCH /tasks/:taskId/assign
Authorization: Bearer <access_token>
```

Request:
```json
{
  "userId": "user_id"
}
```

#### Delete Task
```
DELETE /tasks/:taskId
Authorization: Bearer <access_token>
```

## Error Responses

### Validation Error (400)
```json
{
  "error": "ValidationError",
  "message": "Validation failed",
  "details": {
    "email": ["Invalid email format"],
    "password": ["Password must contain uppercase"]
  }
}
```

### Authentication Error (401)
```json
{
  "error": "AuthenticationError",
  "message": "Invalid credentials"
}
```

### Authorization Error (403)
```json
{
  "error": "AuthorizationError",
  "message": "Insufficient permissions"
}
```

### Not Found Error (404)
```json
{
  "error": "NotFoundError",
  "message": "Loan application not found"
}
```

### Conflict Error (409)
```json
{
  "error": "ConflictError",
  "message": "User with this email already exists"
}
```

### Internal Server Error (500)
```json
{
  "error": "InternalServerError",
  "message": "An unexpected error occurred"
}
```

## Rate Limiting

- General API: 100 requests per 15 minutes
- Auth endpoints: 5 requests per 15 minutes
- Limits are per IP address

Response headers:
```
RateLimit-Limit: 100
RateLimit-Remaining: 95
RateLimit-Reset: 1234567890
```

## Health Check

```
GET /health
```

Response: `200 OK`
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00Z",
  "uptime": 3600
}
```

## Best Practices

1. **Always use HTTPS** in production
2. **Handle token expiry** gracefully with refresh token flow
3. **Implement retry logic** for failed requests
4. **Cache responses** where appropriate
5. **Use pagination** for large datasets
6. **Include error handling** for all requests
7. **Log API calls** for debugging
8. **Validate input** on client side first

## Examples

### Complete Auth Flow

```javascript
// 1. Register
const registerRes = await fetch('http://localhost:4000/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({
    email: 'user@example.com',
    username: 'user',
    password: 'SecurePass123!'
  })
});

// 2. Login
const loginRes = await fetch('http://localhost:4000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'SecurePass123!'
  })
});

const { tokens } = await loginRes.json();

// 3. Use access token
const loansRes = await fetch('http://localhost:4000/api/loans', {
  headers: { 'Authorization': `Bearer ${tokens.accessToken}` }
});

// 4. Refresh when needed
const refreshRes = await fetch('http://localhost:4000/api/auth/refresh', {
  method: 'POST',
  credentials: 'include'
});

const { accessToken } = await refreshRes.json();
```

## Support

For API support, refer to the main README or contact the support team.
