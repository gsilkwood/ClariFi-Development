/**
 * Swagger/OpenAPI documentation configuration
 * This provides API documentation that can be viewed at /api-docs
 */

export const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ClariFi API Documentation',
      version: '1.0.0',
      description: 'REST API for ClariFi Loan Origination and CRM Platform',
      contact: {
        name: 'ClariFi Support',
        url: 'https://clarifi.example.com',
      },
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 4000}`,
        description: 'Development server',
      },
      {
        url: process.env.API_URL || 'https://api.clarifi.example.com',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT access token in the Authorization header',
        },
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'refreshToken',
          description: 'Refresh token stored in httpOnly cookie',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            username: { type: 'string' },
            email: { type: 'string', format: 'email' },
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            role: { type: 'object' },
          },
        },
        LoanApplication: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            loanNumber: { type: 'string' },
            loanAmount: { type: 'number' },
            status: { type: 'string' },
            purpose: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Document: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            loanId: { type: 'string' },
            documentType: { type: 'string' },
            documentName: { type: 'string' },
            filePath: { type: 'string' },
            verificationStatus: { type: 'string' },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            error: { type: 'string' },
            message: { type: 'string' },
            details: { type: 'object' },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
        cookieAuth: [],
      },
    ],
    paths: {
      '/auth/register': {
        post: {
          tags: ['Authentication'],
          summary: 'Register a new user',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email', 'username', 'password'],
                  properties: {
                    email: { type: 'string', format: 'email' },
                    username: { type: 'string', minLength: 3 },
                    password: { type: 'string', minLength: 8 },
                    firstName: { type: 'string' },
                    lastName: { type: 'string' },
                  },
                },
              },
            },
          },
          responses: {
            201: {
              description: 'User registered successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      user: { $ref: '#/components/schemas/User' },
                      tokens: {
                        type: 'object',
                        properties: {
                          accessToken: { type: 'string' },
                          expiresIn: { type: 'number' },
                        },
                      },
                    },
                  },
                },
              },
            },
            400: { description: 'Validation error' },
            409: { description: 'User already exists' },
          },
        },
      },
      '/auth/login': {
        post: {
          tags: ['Authentication'],
          summary: 'Login user',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email', 'password'],
                  properties: {
                    email: { type: 'string', format: 'email' },
                    password: { type: 'string' },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: 'User logged in successfully',
            },
            401: { description: 'Invalid credentials' },
          },
        },
      },
      '/auth/logout': {
        post: {
          tags: ['Authentication'],
          summary: 'Logout user',
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'User logged out successfully' },
            401: { description: 'Unauthorized' },
          },
        },
      },
      '/loans': {
        get: {
          tags: ['Loans'],
          summary: 'Get user loan applications',
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
            { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } },
          ],
          responses: {
            200: { description: 'List of loans' },
            401: { description: 'Unauthorized' },
          },
        },
        post: {
          tags: ['Loans'],
          summary: 'Create new loan application',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['amount', 'purpose', 'employmentStatus', 'annualIncome', 'borrowerEmail'],
                  properties: {
                    amount: { type: 'number', minimum: 1000 },
                    term: { type: 'integer', enum: [12, 24, 36, 48] },
                    purpose: { type: 'string' },
                    employmentStatus: { type: 'string' },
                    annualIncome: { type: 'number' },
                    borrowerEmail: { type: 'string', format: 'email' },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: 'Loan created' },
            400: { description: 'Validation error' },
            401: { description: 'Unauthorized' },
          },
        },
      },
      '/programs': {
        get: {
          tags: ['Loan Programs'],
          summary: 'Get active loan programs',
          responses: {
            200: { description: 'List of loan programs' },
          },
        },
      },
      '/notifications': {
        get: {
          tags: ['Notifications'],
          summary: 'Get user notifications',
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
            { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 } },
          ],
          responses: {
            200: { description: 'List of notifications' },
            401: { description: 'Unauthorized' },
          },
        },
      },
      '/tasks': {
        get: {
          tags: ['Tasks'],
          summary: 'Get user tasks',
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'List of tasks' },
            401: { description: 'Unauthorized' },
          },
        },
      },
    },
  },
  apis: [],
};
