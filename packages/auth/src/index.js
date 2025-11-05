"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
// packages/auth/src/index.ts
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class AuthService {
    constructor() {
        this.jwtSecret = process.env.JWT_SECRET || 'fallback_secret_key_for_development';
    }
    /**
     * Generate JWT token for user
     */
    generateToken(user) {
        if (!user.id || !user.email) {
            throw new Error('User must have id and email');
        }
        return jsonwebtoken_1.default.sign({ userId: user.id, email: user.email }, this.jwtSecret, { expiresIn: '24h' });
    }
    /**
     * Verify JWT token
     */
    verifyToken(token) {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, this.jwtSecret);
            return decoded;
        }
        catch (error) {
            console.error('Token verification failed:', error);
            return null;
        }
    }
    /**
     * Get user ID from token
     */
    getUserIdFromToken(token) {
        const payload = this.verifyToken(token);
        return payload ? payload.userId : null;
    }
}
exports.AuthService = AuthService;
