import { Request, Response } from 'express';
import { LoanProgramService } from '../services/loanProgramService';
import { ValidationError } from '../utils/errors';
import logger from '../lib/logger';

export class LoanProgramController {
  async getActiveLoanPrograms(_req: Request, res: Response): Promise<void> {
    const programs = await LoanProgramService.getActiveLoanPrograms();
    logger.info('Fetched active loan programs', { count: programs.length });
    res.json(programs);
  }

  async getLoanProgram(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    
    if (!id || isNaN(Number(id))) {
      throw new ValidationError('Valid program ID required');
    }

    const program = await LoanProgramService.getLoanProgramById(Number(id));
    res.json(program);
  }

  async getProgramsByCategory(req: Request, res: Response): Promise<void> {
    const { category } = req.query;

    if (!category || typeof category !== 'string') {
      throw new ValidationError('Category parameter is required');
    }

    const programs = await LoanProgramService.getLoanProgramsByCategory(category);
    res.json(programs);
  }

  async getProgramStats(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
      throw new ValidationError('Valid program ID required');
    }

    const stats = await LoanProgramService.getProgramStats(Number(id));
    res.json(stats);
  }
}

export const loanProgramController = new LoanProgramController();
