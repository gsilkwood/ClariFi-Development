import request from 'supertest';
import express from 'express';
import routes from '../../routes';

// Mock auth middleware to always authenticate with a test user
jest.mock('../../middleware/auth', () => ({
  authenticateToken: (req: any, _res: any, next: any) => {
    req.user = {
      userId: 'user-123',
      email: 'borrower@example.com',
      username: 'borrower',
      roleId: 1,
    };
    next();
  },
}));

// Mock LoanService to avoid DB dependency
jest.mock('../../services/loanService', () => {
  const mockLoan = {
    id: 'loan-123',
    loanNumber: 'LOAN-123',
    status: 'LEAD',
    loanAmount: { toString: () => '100000' },
    loanTermMonths: 36,
    purpose: 'Home',
    updatedAt: new Date('2025-01-01'),
  };

  const mockHistory = [
    { id: 'h1', loanId: 'loan-123', fromStatus: 'LEAD', toStatus: 'SUBMITTED', changedAt: new Date('2025-01-02') },
  ];

  return {
    LoanService: {
      createLoanApplication: jest.fn().mockResolvedValue(mockLoan),
      getLoanApplicationsByUser: jest.fn().mockResolvedValue([mockLoan]),
      getLoanApplication: jest.fn().mockResolvedValue(mockLoan),
      updateLoanApplication: jest.fn().mockResolvedValue({ ...mockLoan, purpose: 'Auto' }),
      submitForReview: jest.fn().mockResolvedValue({ ...mockLoan, status: 'SUBMITTED' }),
      getLoanStatus: jest.fn().mockResolvedValue({
        loanId: 'loan-123',
        currentStatus: 'LEAD',
        lastUpdated: new Date('2025-01-01'),
        history: mockHistory,
      }),
      getStatusHistory: jest.fn().mockResolvedValue(mockHistory),
      deleteLoanApplication: jest.fn().mockResolvedValue(undefined),
    },
  };
});

describe('Loan Routes Integration (mocked services)', () => {
  let app: express.Application;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/api', routes);
  });

  describe('POST /api/loans', () => {
    it('should create a loan and return 201', async () => {
      const res = await request(app)
        .post('/api/loans')
        .send({
          amount: 100000,
          term: 36,
          purpose: 'Home',
          employmentStatus: 'Employed',
          annualIncome: 75000,
          borrowerEmail: 'borrower@example.com',
        });

      expect(res.status).toBe(201);
      expect(res.body).toBeDefined();
      expect(res.body.id).toBe('loan-123');
    });
  });

  describe('GET /api/loans', () => {
    it('should return a list of loans', async () => {
      const res = await request(app).get('/api/loans');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body[0].id).toBe('loan-123');
    });
  });

  describe('GET /api/loans/:id', () => {
    it('should return a single loan', async () => {
      const res = await request(app).get('/api/loans/loan-123');
      expect(res.status).toBe(200);
      expect(res.body.id).toBe('loan-123');
    });
  });

  describe('PUT /api/loans/:id', () => {
    it('should update a loan and return 200', async () => {
      const res = await request(app)
        .put('/api/loans/loan-123')
        .send({ purpose: 'Auto' });
      expect(res.status).toBe(200);
      expect(res.body.purpose).toBe('Auto');
    });
  });

  describe('POST /api/loans/:id/submit', () => {
    it('should submit a loan and return 200', async () => {
      const res = await request(app).post('/api/loans/loan-123/submit');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('SUBMITTED');
    });
  });

  describe('GET /api/loans/:id/status', () => {
    it('should return loan status', async () => {
      const res = await request(app).get('/api/loans/loan-123/status');
      expect(res.status).toBe(200);
      expect(res.body.loanId).toBe('loan-123');
      expect(res.body.history.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('GET /api/loans/:id/history', () => {
    it('should return loan history', async () => {
      const res = await request(app).get('/api/loans/loan-123/history');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe('DELETE /api/loans/:id', () => {
    it('should delete a loan and return 200', async () => {
      const res = await request(app).delete('/api/loans/loan-123');
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Loan application deleted');
    });
  });
});
