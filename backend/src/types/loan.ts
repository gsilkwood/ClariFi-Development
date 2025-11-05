export enum LoanStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  UNDER_REVIEW = 'under_review',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  FUNDED = 'funded',
  CLOSED = 'closed',
}

export interface CreateLoanRequest {
  amount: number;
  term: number; // months
  purpose: string;
  employmentStatus: string;
  employerName?: string;
  annualIncome: number;
  additionalIncome?: number;
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
