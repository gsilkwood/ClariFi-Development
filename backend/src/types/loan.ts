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
  employmentStatus?: string;
  employerName?: string;
  annualIncome?: number;
  additionalIncome?: number;
}

export interface LoanApplicationResponse {
  id: string;
  userId: string;
  amount: number;
  term: number;
  purpose: string;
  employmentStatus: string;
  employerName?: string;
  annualIncome: number;
  additionalIncome?: number;
  status: LoanStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface LoanStatusHistory {
  id: string;
  loanId: string;
  fromStatus: LoanStatus;
  toStatus: LoanStatus;
  reason?: string;
  createdAt: Date;
}

export interface LoanStatusResponse {
  loanId: string;
  currentStatus: LoanStatus;
  lastUpdated: Date;
  history: LoanStatusHistory[];
}
