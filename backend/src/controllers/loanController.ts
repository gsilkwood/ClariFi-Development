import { Request, Response } from 'express';
import { LoanService } from '../services/loanService';
import { AuthenticatedRequest } from '../middleware/auth';

export class LoanController {
  async createLoan(req: Request, res: Response): Promise<void> {
    try {
      const authReq = req as AuthenticatedRequest;
      const { amount, term, purpose, employmentStatus, employerName, annualIncome, additionalIncome, borrowerEmail, firstName, lastName } = req.body;

      if (!amount || !purpose || !employmentStatus || !annualIncome || !borrowerEmail) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
      }

      const loan = await LoanService.createLoanApplication(authReq.user!.userId, {
        amount,
        term,
        purpose,
        employmentStatus,
        employerName,
        annualIncome,
        additionalIncome,
        borrowerEmail,
        firstName,
        lastName,
      });

      res.status(201).json(loan);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getLoanApplications(req: Request, res: Response): Promise<void> {
    try {
      const authReq = req as AuthenticatedRequest;
      const loans = await LoanService.getLoanApplicationsByUser(authReq.user!.userId);
      res.json(loans);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getLoanApplication(req: Request, res: Response): Promise<void> {
    try {
      const authReq = req as AuthenticatedRequest;
      const { id } = req.params;
      const loan = await LoanService.getLoanApplication(id, authReq.user!.userId);
      res.json(loan);
    } catch (error: any) {
      if (error.message.includes('not found')) {
        res.status(404).json({ error: error.message });
      } else if (error.message.includes('Unauthorized')) {
        res.status(403).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  }

  async updateLoan(req: Request, res: Response): Promise<void> {
    try {
      const authReq = req as AuthenticatedRequest;
      const { id } = req.params;
      const updates = req.body;
      const loan = await LoanService.updateLoanApplication(id, authReq.user!.userId, updates);
      res.json(loan);
    } catch (error: any) {
      if (error.message.includes('Cannot update')) {
        res.status(409).json({ error: error.message });
      } else {
        res.status(400).json({ error: error.message });
      }
    }
  }

  async submitForReview(req: Request, res: Response): Promise<void> {
    try {
      const authReq = req as AuthenticatedRequest;
      const { id } = req.params;
      const loan = await LoanService.submitForReview(id, authReq.user!.userId);
      res.json(loan);
    } catch (error: any) {
      res.status(409).json({ error: error.message });
    }
  }

  async getLoanStatus(req: Request, res: Response): Promise<void> {
    try {
      const authReq = req as AuthenticatedRequest;
      const { id } = req.params;
      const status = await LoanService.getLoanStatus(id, authReq.user!.userId);
      res.json(status);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }

  async getStatusHistory(req: Request, res: Response): Promise<void> {
    try {
      const authReq = req as AuthenticatedRequest;
      const { id } = req.params;
      const history = await LoanService.getStatusHistory(id, authReq.user!.userId);
      res.json(history);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }

  async deleteLoan(req: Request, res: Response): Promise<void> {
    try {
      const authReq = req as AuthenticatedRequest;
      const { id } = req.params;
      await LoanService.deleteLoanApplication(id, authReq.user!.userId);
      res.json({ message: 'Loan application deleted' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}

export const loanController = new LoanController();
