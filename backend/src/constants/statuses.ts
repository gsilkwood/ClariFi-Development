/**
 * Loan application status constants
 */
export const LOAN_STATUS = {
  DRAFT: 'DRAFT',
  SUBMITTED: 'SUBMITTED',
  UNDER_REVIEW: 'UNDER_REVIEW',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  FUNDED: 'FUNDED',
  CLOSED: 'CLOSED',
} as const;

/**
 * Document verification status constants
 */
export const VERIFICATION_STATUS = {
  PENDING: 'PENDING',
  VERIFIED: 'VERIFIED',
  REJECTED: 'REJECTED',
  NEEDS_REVIEW: 'NEEDS_REVIEW',
} as const;

/**
 * Document type constants
 */
export const DOCUMENT_TYPE = {
  INCOME_STATEMENT: 'INCOME_STATEMENT',
  TAX_RETURN: 'TAX_RETURN',
  BANK_STATEMENT: 'BANK_STATEMENT',
  IDENTIFICATION: 'IDENTIFICATION',
  PROOF_OF_ADDRESS: 'PROOF_OF_ADDRESS',
  PROPERTY_APPRAISAL: 'PROPERTY_APPRAISAL',
  OTHER: 'OTHER',
} as const;

/**
 * Employment status constants
 */
export const EMPLOYMENT_STATUS = {
  EMPLOYED: 'EMPLOYED',
  SELF_EMPLOYED: 'SELF_EMPLOYED',
  UNEMPLOYED: 'UNEMPLOYED',
  RETIRED: 'RETIRED',
} as const;

/**
 * User role constants
 */
export const USER_ROLE = {
  BORROWER: 'BORROWER',
  LENDER: 'LENDER',
  UNDERWRITER: 'UNDERWRITER',
  ADMIN: 'ADMIN',
} as const;

export type LoanStatusType = typeof LOAN_STATUS[keyof typeof LOAN_STATUS];
export type VerificationStatusType = typeof VERIFICATION_STATUS[keyof typeof VERIFICATION_STATUS];
export type DocumentTypeType = typeof DOCUMENT_TYPE[keyof typeof DOCUMENT_TYPE];
export type EmploymentStatusType = typeof EMPLOYMENT_STATUS[keyof typeof EMPLOYMENT_STATUS];
export type UserRoleType = typeof USER_ROLE[keyof typeof USER_ROLE];
