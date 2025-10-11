import { NextResponse } from 'next/server';

export interface ApiError {
  message: string;
  code?: string;
  statusCode: number;
  details?: Record<string, unknown>;
}

export class AppError extends Error implements ApiError {
  public readonly code?: string;
  public readonly statusCode: number;
  public readonly details?: Record<string, unknown>;

  constructor(message: string, statusCode: number = 500, code?: string, details?: Record<string, unknown>) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

// Common error types
export class ValidationError extends AppError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, 400, 'VALIDATION_ERROR', details);
    this.name = 'ValidationError';
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication required') {
    super(message, 401, 'AUTHENTICATION_ERROR');
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Insufficient permissions') {
    super(message, 403, 'AUTHORIZATION_ERROR');
    this.name = 'AuthorizationError';
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(message, 404, 'NOT_FOUND_ERROR');
    this.name = 'NotFoundError';
  }
}

export class ConflictError extends AppError {
  constructor(message: string = 'Resource conflict') {
    super(message, 409, 'CONFLICT_ERROR');
    this.name = 'ConflictError';
  }
}

// Error response formatter
export function createErrorResponse(error: Error | ApiError): NextResponse {
  const apiError = error instanceof AppError ? error : new AppError(error.message || 'Internal server error', 500);

  const responseBody = {
    success: false,
    error: {
      message: apiError.message,
      code: apiError.code,
      ...(process.env.NODE_ENV === 'development' && {
        stack: (error as Error).stack,
        details: apiError.details,
      }),
    },
  };

  return NextResponse.json(responseBody, { status: apiError.statusCode });
}

// Success response formatter
export function createSuccessResponse<T = Record<string, unknown>>(data: T, message?: string): NextResponse {
  const responseBody = {
    success: true,
    data,
    ...(message && { message }),
  };

  return NextResponse.json(responseBody);
}

// Async route handler wrapper
export function withErrorHandler<T extends unknown[]>(
  handler: (...args: T) => Promise<NextResponse>
) {
  return async (...args: T): Promise<NextResponse> => {
    try {
      return await handler(...args);
    } catch (error) {
      console.error('API Error:', error);

      // Log to error reporting service in production
      if (process.env.NODE_ENV === 'production') {
        // reportError(error);
      }

      return createErrorResponse(error as Error);
    }
  };
}