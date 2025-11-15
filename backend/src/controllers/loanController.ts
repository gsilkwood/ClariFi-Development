import { Request, Response } from 'express';
import { LoanService } from '../services/loanService';
import { AuthenticatedRequest } from '../middleware/auth';
import { CreateLoanSchema, UpdateLoanSchema } from '../utils/validation';
import { ValidationError, NotFoundError, AuthorizationError } from '../utils/errors';
import logger from '../lib/logger';

export class LoanController {
  async createLoan(req: Request, res: Response): Promise<void> {
    const validationResult = CreateLoanSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      throw new ValidationError('Loan creation validation failed',
        validationResult.error.flatten().fieldErrors as Record<string, any>);
    }

    const authReq = req as AuthenticatedRequest;
    const data = validationResult.data;
    const { amount, term, purpose, employmentStatus, employerName, annualIncome, additionalIncome, borrowerEmail, firstName, lastName, loanProgramId } = data;

    try {
      const loan = await LoanService.createLoanApplication(authReq.user!.userId, {
        amount,
        term: term!,
        purpose,
        employmentStatus,
        employerName,
        annualIncome,
        additionalIncome,
        borrowerEmail,
        firstName,
        lastName,
        loanProgramId: loanProgramId ? Number(loanProgramId) : undefined,
      });

      logger.info('Loan application created', { loanId: loan.id, userId: authReq.user!.userId });
      res.status(201).json(loan);
    } catch (error: any) {
      throw error;
    }
  }

  async getLoanApplications(req: Request, res: Response): Promise<void> {
    const authReq = req as AuthenticatedRequest;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    // Validate pagination parameters
    if (page < 1) {
      throw new ValidationError('Page must be >= 1');
    }
    if (limit < 1 || limit > 100) {
      throw new ValidationError('Limit must be between 1 and 100');
    }

    const skip = (page - 1) * limit;
    const result = await LoanService.getLoanApplicationsByUser(authReq.user!.userId, skip, limit);
    res.json(result);
  }

  async getLoanApplication(req: Request, res: Response): Promise<void> {
    const authReq = req as AuthenticatedRequest;
    const { id } = req.params;

    try {
      const loan = await LoanService.getLoanApplication(id, authReq.user!.userId);
      res.json(loan);
    } catch (error: any) {
      if (error.message.includes('not found')) {
        throw new NotFoundError('Loan application');
      } else if (error.message.includes('Unauthorized')) {
        throw new AuthorizationError();
      }
      throw error;
    }
  }

  async updateLoan(req: Request, res: Response): Promise<void> {
    const validationResult = UpdateLoanSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      throw new ValidationError('Loan update validation failed',
        validationResult.error.flatten().fieldErrors as Record<string, any>);
    }

    const authReq = req as AuthenticatedRequest;
    const { id } = req.params;
    const updates = validationResult.data;

    try {
      const loan = await LoanService.updateLoanApplication(id, authReq.user!.userId, updates);
      logger.info('Loan application updated', { loanId: id });
      res.json(loan);
    } catch (error: any) {
      throw error;
    }
  }

  async submitForReview(req: Request, res: Response): Promise<void> {
    const authReq = req as AuthenticatedRequest;
    const { id } = req.params;

    try {
      const loan = await LoanService.submitForReview(id, authReq.user!.userId);
      logger.info('Loan submitted for review', { loanId: id });
      res.json(loan);
    } catch (error: any) {
      throw error;
    }
  }

  async getLoanStatus(req: Request, res: Response): Promise<void> {
    const authReq = req as AuthenticatedRequest;
    const { id } = req.params;

    try {
      const status = await LoanService.getLoanStatus(id, authReq.user!.userId);
      res.json(status);
    } catch (error: any) {
      throw new NotFoundError('Loan status');
    }
  }

  async getStatusHistory(req: Request, res: Response): Promise<void> {
    const authReq = req as AuthenticatedRequest;
    const { id } = req.params;

    try {
      const history = await LoanService.getStatusHistory(id, authReq.user!.userId);
      res.json(history);
    } catch (error: any) {
      throw new NotFoundError('Loan history');
    }
  }

  async deleteLoan(req: Request, res: Response): Promise<void> {
    const authReq = req as AuthenticatedRequest;
    const { id } = req.params;

    try {
      await LoanService.deleteLoanApplication(id, authReq.user!.userId);
      logger.info('Loan application deleted', { loanId: id });
      res.json({ message: 'Loan application deleted' });
    } catch (error: any) {
      throw error;
    }
  }
}

export const loanController = new LoanController();
