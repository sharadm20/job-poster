"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const UserService_1 = require("../services/UserService");
const shared_1 = require("@ai-job-applier/shared");
class UserController {
    /**
     * Create a new user
     */
    static async createUser(req, res) {
        try {
            const userData = req.body;
            // Create the user using the service layer
            const user = await UserService_1.UserService.createUser(userData);
            if (!user) {
                res.status(shared_1.HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    error: shared_1.ERROR_MESSAGES.INTERNAL_ERROR,
                    message: 'Failed to create user'
                });
                return;
            }
            res.status(shared_1.HTTP_STATUS.CREATED).json({
                success: true,
                data: user,
                message: 'User created successfully'
            });
        }
        catch (error) {
            if (error.message.includes('Email already exists')) {
                res.status(shared_1.HTTP_STATUS.CONFLICT).json({
                    success: false,
                    error: shared_1.ERROR_MESSAGES.EMAIL_EXISTS,
                    message: shared_1.ERROR_MESSAGES.EMAIL_EXISTS
                });
                return;
            }
            if (error.message.includes('Validation error')) {
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
     * Get user by ID
     */
    static async getUserById(req, res) {
        try {
            const { id } = req.params;
            const user = await UserService_1.UserService.findById(id);
            if (!user) {
                res.status(shared_1.HTTP_STATUS.NOT_FOUND).json({
                    success: false,
                    error: shared_1.ERROR_MESSAGES.USER_NOT_FOUND,
                    message: shared_1.ERROR_MESSAGES.USER_NOT_FOUND
                });
                return;
            }
            res.status(shared_1.HTTP_STATUS.OK).json({
                success: true,
                data: user,
                message: 'User retrieved successfully'
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
    /**
     * Get user by email
     */
    static async getUserByEmail(req, res) {
        try {
            const { email } = req.params;
            const user = await UserService_1.UserService.findByEmail(email);
            if (!user) {
                res.status(shared_1.HTTP_STATUS.NOT_FOUND).json({
                    success: false,
                    error: shared_1.ERROR_MESSAGES.USER_NOT_FOUND,
                    message: shared_1.ERROR_MESSAGES.USER_NOT_FOUND
                });
                return;
            }
            res.status(shared_1.HTTP_STATUS.OK).json({
                success: true,
                data: user,
                message: 'User retrieved successfully'
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
    /**
     * Update user by ID
     */
    static async updateUser(req, res) {
        try {
            // Implementation will be added later
            res.status(shared_1.HTTP_STATUS.NOT_FOUND).json({
                success: false,
                error: 'Not implemented',
                message: 'Endpoint not implemented yet'
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
    /**
     * Delete user by ID
     */
    static async deleteUser(req, res) {
        try {
            // Implementation will be added later
            res.status(shared_1.HTTP_STATUS.NOT_FOUND).json({
                success: false,
                error: 'Not implemented',
                message: 'Endpoint not implemented yet'
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
exports.UserController = UserController;
