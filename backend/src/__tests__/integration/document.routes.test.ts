import request from 'supertest';
import express, { Express } from 'express';
import routes from '../../routes';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || 'postgresql://gsilkwood@localhost/clarifi_test',
    },
  },
});

// Mock auth middleware
jest.mock('../../middleware/auth', () => ({
  authenticateToken: jest.fn((req, _res, next) => {
    req.user = { userId: 'test-user-123', email: 'test@example.com', role: 'BORROWER' };
    next();
  }),
}));

// Mock documentService
jest.mock('../../services/documentService', () => ({
  documentService: {
    uploadDocument: jest.fn().mockResolvedValue({
      id: 'doc-123',
      loanId: 'loan-456',
      documentType: 'INCOME_STATEMENT',
      documentName: 'paystub.pdf',
      filePath: 'uploads/123-paystub.pdf',
      fileSize: 5000,
      mimeType: 'application/pdf',
      uploadedById: 'test-user-123',
      isRequired: true,
      isReceived: true,
      extractionStatus: 'PENDING',
      verificationStatus: 'PENDING',
      uploadedAt: new Date(),
      verifiedById: null,
      verifiedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }),
    listDocuments: jest.fn().mockResolvedValue([
      {
        id: 'doc-123',
        loanId: 'loan-456',
        documentType: 'INCOME_STATEMENT',
        documentName: 'paystub.pdf',
        filePath: 'uploads/123-paystub.pdf',
        fileSize: 5000,
        mimeType: 'application/pdf',
        uploadedById: 'test-user-123',
        isRequired: true,
        isReceived: true,
        extractionStatus: 'PENDING',
        verificationStatus: 'PENDING',
        uploadedAt: new Date(),
        verifiedById: null,
        verifiedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]),
    verifyDocument: jest.fn().mockResolvedValue({
      id: 'doc-123',
      verificationStatus: 'VERIFIED',
      verifiedById: 'test-user-123',
      verifiedAt: new Date(),
    }),
    deleteDocument: jest.fn().mockResolvedValue(undefined),
  },
}));

describe('Document Routes Integration', () => {
  let app: Express;

  beforeAll(async () => {
    app = express();
    app.use(express.json());
    app.use('/api', routes);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('POST /api/loans/:id/documents', () => {
    it('should upload a document and return 201', async () => {
      const buffer = Buffer.from('fake-pdf-content');
      const response = await request(app)
        .post('/api/loans/loan-456/documents')
        .attach('file', buffer, 'paystub.pdf')
        .field('documentType', 'INCOME_STATEMENT')
        .field('documentName', 'paystub.pdf')
        .field('isRequired', 'true');

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id', 'doc-123');
      expect(response.body).toHaveProperty('documentType', 'INCOME_STATEMENT');
    });

    it('should return 400 if no file is uploaded', async () => {
      const response = await request(app)
        .post('/api/loans/loan-456/documents')
        .field('documentType', 'INCOME_STATEMENT');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'No file uploaded');
    });
  });

  describe('GET /api/loans/:id/documents', () => {
    it('should list documents for a loan and return 200', async () => {
      const response = await request(app).get('/api/loans/loan-456/documents');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty('id', 'doc-123');
    });
  });

  describe('POST /api/documents/:docId/verify', () => {
    it('should verify a document and return 200', async () => {
      const response = await request(app)
        .post('/api/documents/doc-123/verify')
        .send({ verificationStatus: 'VERIFIED' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('verificationStatus', 'VERIFIED');
      expect(response.body).toHaveProperty('verifiedById', 'test-user-123');
    });

    it('should return 400 if verificationStatus is invalid', async () => {
      const response = await request(app)
        .post('/api/documents/doc-123/verify')
        .send({ verificationStatus: 'INVALID_STATUS' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Invalid verification status');
    });
  });

  describe('DELETE /api/documents/:docId', () => {
    it('should delete a document and return 204', async () => {
      const response = await request(app).delete('/api/documents/doc-123');

      expect(response.status).toBe(204);
      expect(response.body).toEqual({});
    });
  });
});
