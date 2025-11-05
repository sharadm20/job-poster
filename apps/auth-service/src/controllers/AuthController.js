"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const AuthService_1 = require("../services/AuthService");
const shared_1 = require("@ai-job-applier/shared");
class AuthController {
    constructor() {
        this.authService = new AuthService_1.AuthService();
    }
    /**
     * Register a new user
     */
    async register(req, res) {
        try {
            const userData = req.body;
            const result = await this.authService.register(userData);
            if (!result) {
                res.status(shared_1.HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    error: shared_1.ERROR_MESSAGES.INTERNAL_ERROR,
                    message: 'Failed to register user'
                });
                return;
            }
            const { user, token } = result;
            res.status(shared_1.HTTP_STATUS.CREATED).json({
                success: true,
                data: { user, token },
                message: 'User registered successfully'
            });
        }
        catch (error) {
            if (error.message.includes(shared_1.ERROR_MESSAGES.EMAIL_EXISTS)) {
                res.status(shared_1.HTTP_STATUS.CONFLICT).json({
                    success: false,
                    error: shared_1.ERROR_MESSAGES.EMAIL_EXISTS,
                    message: shared_1.ERROR_MESSAGES.EMAIL_EXISTS
                });
                return;
            }
            if (error.message.includes(shared_1.ERROR_MESSAGES.VALIDATION_ERROR)) {
                res.status(shared_1.HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    error: shared_1.ERROR_MESSAGES.VALIDATION_ERROR,
                    message: error.message
                });
                return;
            }
            res.status(shared_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: shared_1.ERROR_MESSAGES.INTERNAL_ERROR,
                message: 'Internal server error'
            });
        }
    }
    /**
     * Login user with credentials
     */
    async login(req, res) {
        try {
            const credentials = req.body;
            const result = await this.authService.login(credentials);
            if (!result) {
                res.status(shared_1.HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    error: shared_1.ERROR_MESSAGES.INTERNAL_ERROR,
                    message: 'Failed to login user'
                });
                return;
            }
            const { user, token } = result;
            res.status(shared_1.HTTP_STATUS.OK).json({
                success: true,
                data: { user, token },
                message: 'Login successful'
            });
        }
        catch (error) {
            if (error.message.includes(shared_1.ERROR_MESSAGES.USER_NOT_FOUND)) {
                res.status(shared_1.HTTP_STATUS.NOT_FOUND).json({
                    success: false,
                    error: shared_1.ERROR_MESSAGES.USER_NOT_FOUND,
                    message: shared_1.ERROR_MESSAGES.USER_NOT_FOUND
                });
                return;
            }
            if (error.message.includes(shared_1.ERROR_MESSAGES.INVALID_CREDENTIALS)) {
                res.status(shared_1.HTTP_STATUS.UNAUTHORIZED).json({
                    success: false,
                    error: shared_1.ERROR_MESSAGES.INVALID_CREDENTIALS,
                    message: shared_1.ERROR_MESSAGES.INVALID_CREDENTIALS
                });
                return;
            }
            if (error.message.includes(shared_1.ERROR_MESSAGES.VALIDATION_ERROR)) {
                res.status(shared_1.HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    error: shared_1.ERROR_MESSAGES.VALIDATION_ERROR,
                    message: error.message
                });
                return;
            }
            res.status(shared_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: shared_1.ERROR_MESSAGES.INTERNAL_ERROR,
                message: 'Internal server error'
            });
        }
    }
    /**
     * Verify JWT token
     */
    async verifyToken(req, res) {
        try {
            // This endpoint would typically be protected by middleware
            // For now, we'll just return a success response
            res.status(shared_1.HTTP_STATUS.OK).json({
                success: true,
                data: { valid: true },
                message: 'Token is valid'
            });
        }
        catch (error) {
            res.status(shared_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: shared_1.ERROR_MESSAGES.INTERNAL_ERROR,
                message: 'Internal server error'
            });
        }
    }
}
exports.AuthController = AuthController;
