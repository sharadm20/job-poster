// apps/api-gateway/src/middlewares/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { AuthService } from '@ai-job-applier/auth';
import { HTTP_STATUS } from '@ai-job-applier/shared';

const authService = new AuthService();

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      res.status(HTTP_STATUS.UNAUTHORIZED).json({ 
        success: false,
        error: 'Access denied. No token provided.',
        message: 'Authorization token is required'
      });
      return;
    }

    // Verify token
    const decoded = authService.verifyToken(token);
    if (!decoded) {
      res.status(HTTP_STATUS.UNAUTHORIZED).json({ 
        success: false,
        error: 'Invalid token.',
        message: 'Invalid or expired token'
      });
      return;
    }
    
    (req as any).user = decoded;
    next();
  } catch (error) {
    res.status(HTTP_STATUS.UNAUTHORIZED).json({ 
      success: false,
      error: 'Invalid token.',
      message: 'Token verification failed'
    });
  }
};