import { LOAN_STATUS, LoanStatusType } from '../constants/statuses';
import logger from '../lib/logger';

/**
 * Workflow state transition rules
 * Maps current state to allowed next states
 */
const STATE_TRANSITIONS: Record<LoanStatusType, LoanStatusType[]> = {
  [LOAN_STATUS.DRAFT]: [LOAN_STATUS.SUBMITTED, LOAN_STATUS.CLOSED],
  [LOAN_STATUS.SUBMITTED]: [LOAN_STATUS.UNDER_REVIEW, LOAN_STATUS.REJECTED, LOAN_STATUS.DRAFT],
  [LOAN_STATUS.UNDER_REVIEW]: [LOAN_STATUS.APPROVED, LOAN_STATUS.REJECTED],
  [LOAN_STATUS.APPROVED]: [LOAN_STATUS.FUNDED, LOAN_STATUS.REJECTED],
  [LOAN_STATUS.REJECTED]: [LOAN_STATUS.CLOSED],
  [LOAN_STATUS.FUNDED]: [LOAN_STATUS.CLOSED],
  [LOAN_STATUS.CLOSED]: [],
};

/**
 * Workflow service for managing loan application state transitions
 */
export class WorkflowService {
  /**
   * Check if a transition from current to target status is allowed
   */
  static canTransition(currentStatus: LoanStatusType, targetStatus: LoanStatusType): boolean {
    return STATE_TRANSITIONS[currentStatus]?.includes(targetStatus) ?? false;
  }

  /**
   * Get all allowed transitions from a given status
   */
  static getAllowedTransitions(status: LoanStatusType): LoanStatusType[] {
    return STATE_TRANSITIONS[status] || [];
  }

  /**
   * Perform a state transition with validation
   */
  static transition(
    currentStatus: LoanStatusType,
    targetStatus: LoanStatusType,
    loanId: string
  ): { success: boolean; error?: string } {
    if (!this.canTransition(currentStatus, targetStatus)) {
      const error = `Cannot transition from ${currentStatus} to ${targetStatus}`;
      logger.warn('Invalid workflow transition', { loanId, from: currentStatus, to: targetStatus });
      return { success: false, error };
    }

    logger.info('Workflow transition successful', {
      loanId,
      from: currentStatus,
      to: targetStatus,
    });

    return { success: true };
  }

  /**
   * Get description of a status
   */
  static getStatusDescription(status: LoanStatusType): string {
    const descriptions: Record<LoanStatusType, string> = {
      [LOAN_STATUS.DRAFT]: 'Application is being prepared',
      [LOAN_STATUS.SUBMITTED]: 'Application has been submitted for review',
      [LOAN_STATUS.UNDER_REVIEW]: 'Application is under review by underwriters',
      [LOAN_STATUS.APPROVED]: 'Application has been approved',
      [LOAN_STATUS.REJECTED]: 'Application has been rejected',
      [LOAN_STATUS.FUNDED]: 'Loan has been funded',
      [LOAN_STATUS.CLOSED]: 'Application is closed',
    };

    return descriptions[status] || 'Unknown status';
  }
}
