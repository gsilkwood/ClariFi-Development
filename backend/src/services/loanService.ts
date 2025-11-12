import { CreateLoanRequest, UpdateLoanRequest } from '../types/loan';
import { prisma } from '../lib/prisma';

export class LoanService {
  /**
   * Create a new loan application (simplified - using Borrower relationship)
   * NOTE: The full schema requires programId, borrowerId, loanOfficerId
   * This is a simplified implementation for MVP
   */
  static async createLoanApplication(_userId: string, data: CreateLoanRequest) {
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

    // Get or create a default borrower for this user
    const borrower = await prisma.borrower.upsert({
      where: { email: data.borrowerEmail },
      update: {},
      create: {
        email: data.borrowerEmail,
        firstName: data.firstName || 'Unknown',
        lastName: data.lastName || 'User',
        employmentStatus: data.employmentStatus,
        employmentInfo: {
          employerName: data.employerName,
          annualIncome: data.annualIncome,
          additionalIncome: data.additionalIncome || 0,
        },
      },
    });

    // Get default loan program and loan officer (for MVP)
    const program = await prisma.loanProgram.findFirst({
      where: { isActive: true },
    });

    if (!program) {
      throw new Error('No active loan programs available');
    }

    const loanOfficer = await prisma.user.findFirst({
      where: { role: { name: 'Loan Officer' } },
    });

    if (!loanOfficer) {
      throw new Error('No loan officers available');
    }

    // Create loan with required fields
    const application = await prisma.loanApplication.create({
      data: {
        loanNumber: `LOAN-${Date.now()}`,
        programId: program.id,
        loanOfficerId: loanOfficer.id,
        borrowerId: borrower.id,
        loanAmount: new (require('decimal.js'))(data.amount),
        loanTermMonths: data.term,
        purpose: data.purpose,
        status: 'LEAD',
      },
      include: {
        borrower: { select: { email: true, firstName: true, lastName: true } },
      },
    });

    return application;
  }

  /**
   * Get all applications for a borrower
   */
  static async getLoanApplicationsByUser(userId: string) {
    // First find borrower by email (need user email)
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error('User not found');

    const applications = await prisma.loanApplication.findMany({
      where: {
        borrower: { email: user.email },
      },
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
        borrower: { select: { email: true, firstName: true, lastName: true } },
        statusHistory: { orderBy: { changedAt: 'asc' } },
        loanOfficer: { select: { username: true, email: true } },
      },
    });

    if (!application) {
      throw new Error('Loan application not found');
    }

    // Check ownership if userId provided
    if (userId) {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user || application.borrower.email !== user.email) {
        throw new Error('Unauthorized: You do not own this loan application');
      }
    }

    return application;
  }

  /**
   * Update a loan application
   */
  static async updateLoanApplication(
    loanId: string,
    userId: string,
    updates: UpdateLoanRequest
  ) {
    const application = await this.getLoanApplication(loanId, userId);

    // Only allow updates in certain statuses
    const updatableStatuses = ['LEAD', 'DRAFT'];
    if (!updatableStatuses.includes(application.status)) {
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
        loanAmount: updates.amount ? new (require('decimal.js'))(updates.amount) : undefined,
        loanTermMonths: updates.term,
        purpose: updates.purpose,
      },
    });

    return updated;
  }

  /**
   * Submit application for review
   */
  static async submitForReview(loanId: string, userId: string) {
    const application = await this.getLoanApplication(loanId, userId);
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error('User not found');

    const updatableStatuses = ['LEAD', 'DRAFT'];
    if (!updatableStatuses.includes(application.status)) {
      throw new Error(`Cannot submit loan in ${application.status} status`);
    }

    // Create status history entry
    await prisma.loanStatusHistory.create({
      data: {
        loanId,
        fromStatus: application.status,
        toStatus: 'SUBMITTED',
        changedById: userId,
      },
    });

    // Update application status
    const updated = await prisma.loanApplication.update({
      where: { id: loanId },
      data: { status: 'SUBMITTED' },
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
      orderBy: { changedAt: 'asc' },
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
      orderBy: { changedAt: 'asc' },
    });

    return history;
  }

  /**
   * Delete a draft application
   */
  static async deleteLoanApplication(loanId: string, userId: string) {
    const application = await this.getLoanApplication(loanId, userId);

    const deletableStatuses = ['LEAD', 'DRAFT'];
    if (!deletableStatuses.includes(application.status)) {
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
