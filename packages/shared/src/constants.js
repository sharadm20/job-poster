"use strict";
// packages/shared/src/constants.ts
// Shared constants
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWT_CONFIG = exports.HTTP_STATUS = exports.ERROR_MESSAGES = void 0;
exports.ERROR_MESSAGES = {
    VALIDATION_ERROR: 'Validation error',
    USER_NOT_FOUND: 'User not found',
    INVALID_CREDENTIALS: 'Invalid credentials',
    EMAIL_EXISTS: 'Email already exists',
    UNAUTHORIZED: 'Unauthorized',
    INTERNAL_ERROR: 'Internal server error'
};
exports.HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    INTERNAL_SERVER_ERROR: 500
};
exports.JWT_CONFIG = {
    EXPIRES_IN: '24h',
    ALGORITHM: 'HS256'
};
