export enum LoanStatus {
  LEAD = 'LEAD',
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  UNDER_REVIEW = 'UNDER_REVIEW',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  FUNDED = 'FUNDED',
  CLOSED = 'CLOSED',
}

export interface LoanApplication {
  id: string;
  loanNumber: string;
  status: LoanStatus | string;
  loanAmount: string | number; // may be stringified decimal from API
  loanTermMonths: number;
  purpose?: string;
  updatedAt: string;
}

export interface LoanStatusHistory {
  id: string;
  loanId: string;
  fromStatus?: LoanStatus | string;
  toStatus: LoanStatus | string;
  changedAt: string;
  reason?: string;
}

export interface CreateLoanRequest {
  amount: number;
  term: number; // months
  purpose: string;
  employmentStatus: string;
  employerName?: string;
  annualIncome: number;
  additionalIncome?: number;
  borrowerEmail: string;
  firstName?: string;
  lastName?: string;
}

export interface UpdateLoanRequest {
  amount?: number;
  term?: number;
  purpose?: string;
}
