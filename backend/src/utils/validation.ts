import { z } from 'zod';

// ============ Auth Validation Schemas ============

export const RegisterSchema = z.object({
  email: z.string().email('Invalid email address'),
  username: z.string().min(3, 'Username must be at least 3 characters').max(50),
  password: z.string().min(8, 'Password must be at least 8 characters').regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    'Password must contain uppercase, lowercase, number, and special character'
  ),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});

export const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password required'),
});

export const RefreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token required'),
});

// ============ Loan Validation Schemas ============

export const CreateLoanSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
  term: z.number().positive('Term must be positive').optional(),
  purpose: z.string().min(1, 'Purpose required').max(500),
  employmentStatus: z.enum(['EMPLOYED', 'SELF_EMPLOYED', 'UNEMPLOYED', 'RETIRED']),
  employerName: z.string().optional(),
  annualIncome: z.number().positive('Annual income must be positive'),
  additionalIncome: z.number().nonnegative().optional(),
  borrowerEmail: z.string().email('Invalid email address'),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  loanProgramId: z.string().optional(),
});

export const UpdateLoanSchema = z.object({
  amount: z.number().positive('Amount must be positive').optional(),
  term: z.number().positive('Term must be positive').optional(),
  purpose: z.string().min(1).max(500).optional(),
  employmentStatus: z.enum(['EMPLOYED', 'SELF_EMPLOYED', 'UNEMPLOYED', 'RETIRED']).optional(),
  employerName: z.string().optional(),
  annualIncome: z.number().positive().optional(),
  additionalIncome: z.number().nonnegative().optional(),
  borrowerEmail: z.string().email().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});

export const LoanIdSchema = z.object({
  id: z.string().uuid('Invalid loan ID'),
});

// ============ Document Validation Schemas ============

export const DocumentTypeEnum = z.enum([
  'INCOME_STATEMENT',
  'TAX_RETURN',
  'BANK_STATEMENT',
  'IDENTIFICATION',
  'PROOF_OF_ADDRESS',
  'PROPERTY_APPRAISAL',
  'OTHER',
]);

export const UploadDocumentSchema = z.object({
  documentType: DocumentTypeEnum,
  documentName: z.string().optional(),
  isRequired: z.boolean().optional(),
});

export const VerifyDocumentSchema = z.object({
  verificationStatus: z.enum(['PENDING', 'VERIFIED', 'REJECTED', 'NEEDS_REVIEW']),
  notes: z.string().optional(),
});

export const DocumentIdSchema = z.object({
  docId: z.string().uuid('Invalid document ID'),
});

// ============ Pagination Schema ============

export const PaginationSchema = z.object({
  page: z.number().int().min(1).default(1).optional(),
  limit: z.number().int().min(1).max(100).default(10).optional(),
  skip: z.number().int().min(0).optional(),
  take: z.number().int().min(1).max(100).optional(),
});

// Export types
export type RegisterRequest = z.infer<typeof RegisterSchema>;
export type LoginRequest = z.infer<typeof LoginSchema>;
export type CreateLoanRequest = z.infer<typeof CreateLoanSchema>;
export type UpdateLoanRequest = z.infer<typeof UpdateLoanSchema>;
export type UploadDocumentRequest = z.infer<typeof UploadDocumentSchema>;
export type VerifyDocumentRequest = z.infer<typeof VerifyDocumentSchema>;
