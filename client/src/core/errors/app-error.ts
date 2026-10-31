/**
 * 100KG Performance OS — Application Error Definitions
 */

export class AppError extends Error {
  public readonly code: string;
  public readonly statusCode?: number;
  public readonly isOperational: boolean;

  constructor(message: string, code = "INTERNAL_ERROR", statusCode = 500, isOperational = true) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class AuthError extends AppError {
  constructor(message = "Authentication required or expired.", code = "AUTH_ERROR") {
    super(message, code, 401);
  }
}

export class NetworkError extends AppError {
  constructor(message = "Network connection failed. Offline mode active.", code = "NETWORK_ERROR") {
    super(message, code, 0);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, code = "VALIDATION_ERROR") {
    super(message, code, 400);
  }
}
