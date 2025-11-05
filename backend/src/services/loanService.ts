import { PrismaClient } from '@prisma/client';
import { CreateLoanRequest, UpdateLoanRequest, LoanStatus } from '../types/loan';

const prisma = new PrismaClient();

export class LoanService {
  /**
   * Create a new loan application
   */
  static async createLoanApplication(userId: string, data: CreateLoanRequest) {
    // Validate loan amount
    if (data.amount < 1000 || data.amount > 1000000) {
      throw new Error('Loan amount must be between $1,000 and $1,000,000');
    }

    // Validate term
    const validTerms = [12, 24, 36, 48];
    if (!validTerms.includes(data.term)) {
      throw new Error('Loan term must be 12, 24, 36, or 48 months');
    }

    // Validate income
    if (data.annualIncome < 0) {
      throw new Error('Annual income must be non-negative');
    }

    const application = await prisma.loanApplication.create({
      data: {
        userId,
        amount: data.amount,
        term: data.term,
        purpose: data.purpose,
        employmentStatus: data.employmentStatus,
        employerName: data.employerName,
        annualIncome: data.annualIncome,
        additionalIncome: data.additionalIncome || 0,
        status: 'draft',
      },
      include: {
        user: { select: { email: true, username: true } },
      },
    });

    return application;
  }

  /**
   * Get all applications for a user
   */
  static async getLoanApplications(userId: string) {
    const applications = await prisma.loanApplication.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return applications;
  }

  /**
   * Get a single loan application
   */
  static async getLoanApplication(loanId: string, userId?: string) {
    const application = await prisma.loanApplication.findUnique({
      where: { id: loanId },
      include: {
        user: { select: { email: true, username: true } },
        statusHistory: { orderBy: { createdAt: 'asc' } },
      },
    });

    if (!application) {
      throw new Error('Loan application not found');
    }

    // Check ownership if userId provided
    if (userId && application.userId !== userId) {
      throw new Error('Unauthorized: You do not own this loan application');
    }

    return application;
  }

  /**
   * Update a loan application (only in draft status)
   */
  static async updateLoanApplication(
    loanId: string,
    userId: string,
    updates: UpdateLoanRequest
  ) {
    const application = await this.getLoanApplication(loanId, userId);

    if (application.status !== 'draft') {
      throw new Error(`Cannot update loan in ${application.status} status`);
    }

    // Validate if amount is being updated
    if (updates.amount && (updates.amount < 1000 || updates.amount > 1000000)) {
      throw new Error('Loan amount must be between $1,000 and $1,000,000');
    }

    // Validate if term is being updated
    if (updates.term) {
      const validTerms = [12, 24, 36, 48];
      if (!validTerms.includes(updates.term)) {
        throw new Error('Loan term must be 12, 24, 36, or 48 months');
      }
    }

    const updated = await prisma.loanApplication.update({
      where: { id: loanId },
      data: {
        amount: updates.amount,
        term: updates.term,
        purpose: updates.purpose,
        employmentStatus: updates.employmentStatus,
        employerName: updates.employerName,
        annualIncome: updates.annualIncome,
        additionalIncome: updates.additionalIncome,
      },
    });

    return updated;
  }

  /**
   * Submit application for review (transition to submitted)
   */
  static async submitForReview(loanId: string, userId: string) {
    const application = await this.getLoanApplication(loanId, userId);

    if (application.status !== 'draft') {
      throw new Error(`Cannot submit loan in ${application.status} status`);
    }

    // Create status history entry
    await prisma.loanStatusHistory.create({
      data: {
        loanId,
        fromStatus: 'draft',
        toStatus: 'submitted',
      },
    });

    // Update application status
    const updated = await prisma.loanApplication.update({
      where: { id: loanId },
      data: { status: 'submitted' },
    });

    return updated;
  }

  /**
   * Get current loan status
   */
  static async getLoanStatus(loanId: string, userId?: string) {
    const application = await this.getLoanApplication(loanId, userId);

    const history = await prisma.loanStatusHistory.findMany({
      where: { loanId },
      orderBy: { createdAt: 'asc' },
    });

    return {
      loanId,
      currentStatus: application.status,
      lastUpdated: application.updatedAt,
      history,
    };
  }

  /**
   * Get full status history for a loan
   */
  static async getStatusHistory(loanId: string, userId?: string) {
    await this.getLoanApplication(loanId, userId);

    const history = await prisma.loanStatusHistory.findMany({
      where: { loanId },
      orderBy: { createdAt: 'asc' },
    });

    return history;
  }

  /**
   * Delete a draft application
   */
  static async deleteLoanApplication(loanId: string, userId: string) {
    const application = await this.getLoanApplication(loanId, userId);

    if (application.status !== 'draft') {
      throw new Error(`Cannot delete loan in ${application.status} status`);
    }

    // Delete related records first
    await prisma.loanStatusHistory.deleteMany({ where: { loanId } });

    // Delete the application
    await prisma.loanApplication.delete({
      where: { id: loanId },
    });
  }
}
