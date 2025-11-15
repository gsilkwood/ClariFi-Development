import { prisma } from '../lib/prisma';
import logger from '../lib/logger';
import { NotFoundError } from '../utils/errors';

export class LoanProgramService {
  /**
   * Get all active loan programs
   */
  static async getActiveLoanPrograms() {
    try {
      const programs = await prisma.loanProgram.findMany({
        where: {
          isActive: true,
        },
        select: {
          id: true,
          programCode: true,
          programName: true,
          programCategory: true,
          description: true,
          minAmount: true,
          maxAmount: true,
          minTermMonths: true,
          maxTermMonths: true,
          requirements: true,
        },
        orderBy: {
          programName: 'asc',
        },
      });

      logger.info('Retrieved active loan programs', { count: programs.length });
      return programs;
    } catch (error: any) {
      logger.error('Error retrieving loan programs', { error: error.message });
      throw error;
    }
  }

  /**
   * Get a specific loan program by ID
   */
  static async getLoanProgramById(programId: number) {
    try {
      const program = await prisma.loanProgram.findUnique({
        where: { id: programId },
        include: {
          _count: {
            select: { loanApplications: true },
          },
        },
      });

      if (!program) {
        throw new NotFoundError('Loan program');
      }

      return program;
    } catch (error: any) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      logger.error('Error retrieving loan program', { programId, error: error.message });
      throw error;
    }
  }

  /**
   * Get all loan programs (including inactive)
   */
  static async getAllLoanPrograms(includeInactive = false) {
    try {
      const programs = await prisma.loanProgram.findMany({
        where: includeInactive ? {} : { isActive: true },
        orderBy: {
          programName: 'asc',
        },
      });

      return programs;
    } catch (error: any) {
      logger.error('Error retrieving all loan programs', { error: error.message });
      throw error;
    }
  }

  /**
   * Search loan programs by category
   */
  static async getLoanProgramsByCategory(category: string) {
    try {
      const programs = await prisma.loanProgram.findMany({
        where: {
          programCategory: category,
          isActive: true,
        },
        orderBy: {
          programName: 'asc',
        },
      });

      return programs;
    } catch (error: any) {
      logger.error('Error retrieving loan programs by category', { category, error: error.message });
      throw error;
    }
  }

  /**
   * Get program stats
   */
  static async getProgramStats(programId: number) {
    try {
      const program = await prisma.loanProgram.findUnique({
        where: { id: programId },
      });

      if (!program) {
        throw new NotFoundError('Loan program');
      }

      const stats = await prisma.loanApplication.groupBy({
        by: ['status'],
        where: {
          programId,
        },
        _count: true,
      });

      return {
        program,
        statusBreakdown: stats,
      };
    } catch (error: any) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      logger.error('Error retrieving program stats', { programId, error: error.message });
      throw error;
    }
  }
}
