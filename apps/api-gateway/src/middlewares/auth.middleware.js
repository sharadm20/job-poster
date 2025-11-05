"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const auth_1 = require("@ai-job-applier/auth");
const shared_1 = require("@ai-job-applier/shared");
const authService = new auth_1.AuthService();
const authMiddleware = (req, res, next) => {
    try {
        // Get token from header
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            res.status(shared_1.HTTP_STATUS.UNAUTHORIZED).json({
                success: false,
                error: 'Access denied. No token provided.',
                message: 'Authorization token is required'
            });
            return;
        }
        // Verify token
        const decoded = authService.verifyToken(token);
        if (!decoded) {
            res.status(shared_1.HTTP_STATUS.UNAUTHORIZED).json({
                success: false,
                error: 'Invalid token.',
                message: 'Invalid or expired token'
            });
            return;
        }
        req.user = decoded;
        next();
    }
    catch (error) {
        res.status(shared_1.HTTP_STATUS.UNAUTHORIZED).json({
            success: false,
            error: 'Invalid token.',
            message: 'Token verification failed'
        });
    }
};
exports.authMiddleware = authMiddleware;
