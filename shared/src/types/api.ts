export type ApiResponse<T> =
  | {
      success: true;
      message?: string;
      data?: T;
    }
  | {
      success: false;
      error: {
        code: ErrorCode;
        message: ErrorMessage | string;
      };
    };

export const ERROR_CODES = {
  MISSING_FIELDS: 'MISSING_FIELDS',
  EMAIL_ALREADY_REGISTERED: 'EMAIL_ALREADY_REGISTERED',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  EMAIL_NOT_FOUND: 'EMAIL_NOT_FOUND',
  NO_TOKEN: 'NO_TOKEN',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  TOKEN_REVOKED: 'TOKEN_REVOKED',
  INVALID_TOKEN: 'INVALID_TOKEN',
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  INVALID_REFRESH_TOKEN: 'INVALID_REFRESH_TOKEN',
  SCHEMA_VALIDATION_ERROR: 'SCHEMA_VALIDATION_ERROR',
} as const;

export type ErrorCode = keyof typeof ERROR_CODES;

export const ERROR_MESSAGES = {
  [ERROR_CODES.MISSING_FIELDS]: 'Missing required fields',
  [ERROR_CODES.EMAIL_ALREADY_REGISTERED]: 'Email already registered',
  [ERROR_CODES.INVALID_CREDENTIALS]: 'Invalid credentials',
  [ERROR_CODES.INTERNAL_SERVER_ERROR]: 'Internal server error',
  [ERROR_CODES.EMAIL_NOT_FOUND]: 'Email not found',
  [ERROR_CODES.NO_TOKEN]: 'No token provided',
  [ERROR_CODES.TOKEN_EXPIRED]: 'Token has expired',
  [ERROR_CODES.TOKEN_REVOKED]: 'Token has been revoked',
  [ERROR_CODES.INVALID_TOKEN]: 'Invalid token',
  [ERROR_CODES.USER_NOT_FOUND]: 'User not found',
  [ERROR_CODES.INVALID_REFRESH_TOKEN]: 'Invalid refresh token',
  [ERROR_CODES.SCHEMA_VALIDATION_ERROR]: 'Schema validation error',
} as const;

export type ErrorMessage = (typeof ERROR_MESSAGES)[ErrorCode];
