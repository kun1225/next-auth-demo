import { Request, Response, NextFunction } from 'express';
import { ZodError, type ZodObject } from 'zod';
import { ERROR_CODES, ApiResponse } from '@next-auth-demo/shared';

export function validateSchema(schema: ZodObject) {
  return async (
    req: Request,
    res: Response<ApiResponse<void>>,
    next: NextFunction
  ) => {
    try {
      await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          success: false,
          error: {
            code: ERROR_CODES.SCHEMA_VALIDATION_ERROR,
            message: error.issues.at(0)?.message ?? 'Schema validation error',
          },
        });
        return;
      }

      res.status(500).json({
        success: false,
        error: {
          code: ERROR_CODES.INTERNAL_SERVER_ERROR,
          message: 'Internal server error',
        },
      });
    }
  };
}
