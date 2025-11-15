import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { ValidationError } from '../utils/errors';
import logger from '../lib/logger';

export type ValidateTarget = 'body' | 'query' | 'params';

/**
 * Middleware factory for validating requests against Zod schemas
 */
export const validateRequest = (
  schema: ZodSchema,
  target: ValidateTarget = 'body'
) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      const dataToValidate = target === 'body' ? req.body :
                             target === 'query' ? req.query :
                             req.params;

      const validationResult = schema.safeParse(dataToValidate);

      if (!validationResult.success) {
        const errors = validationResult.error.flatten().fieldErrors;
        logger.warn('Validation error', {
          path: req.path,
          method: req.method,
          errors,
        });
        throw new ValidationError('Validation failed', errors as Record<string, any>);
      }

      // Replace data with validated data
      if (target === 'body') {
        req.body = validationResult.data;
      } else if (target === 'query') {
        req.query = validationResult.data as any;
      } else {
        req.params = validationResult.data as any;
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
