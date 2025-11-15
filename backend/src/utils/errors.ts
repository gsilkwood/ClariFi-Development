/**
 * Base application error class
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(
    statusCode: number,
    message: string,
    isOperational: boolean = true
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);

    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Validation error for request/input validation failures
 */
export class ValidationError extends AppError {
  public readonly details?: Record<string, any>;

  constructor(message: string, details?: Record<string, any>) {
    super(400, message, true);
    Object.setPrototypeOf(this, new.target.prototype);
    this.details = details;
  }
}

/**
 * Authentication error for invalid credentials
 */
export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication failed') {
    super(401, message, true);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Authorization error for insufficient permissions
 */
export class AuthorizationError extends AppError {
  constructor(message: string = 'Insufficient permissions') {
    super(403, message, true);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Not found error for missing resources
 */
export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(404, `${resource} not found`, true);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Conflict error for duplicate or conflicting resources
 */
export class ConflictError extends AppError {
  constructor(message: string = 'Resource already exists') {
    super(409, message, true);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Rate limit error
 */
export class RateLimitError extends AppError {
  constructor(message: string = 'Too many requests') {
    super(429, message, true);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Internal server error
 */
export class InternalServerError extends AppError {
  constructor(message: string = 'Internal server error') {
    super(500, message, false);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
