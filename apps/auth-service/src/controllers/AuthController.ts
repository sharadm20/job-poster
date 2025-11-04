// apps/auth-service/src/controllers/AuthController.ts
import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';
import { ERROR_MESSAGES, HTTP_STATUS } from '@ai-job-applier/shared';
import { IApiResponse } from '@ai-job-applier/types';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  /**
   * Register a new user
   */
  public async register(req: Request, res: Response): Promise<void> {
    try {
      const userData = req.body;

      const result = await this.authService.register(userData);

      if (!result) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({ 
          success: false,
          error: ERROR_MESSAGES.INTERNAL_ERROR,
          message: 'Failed to register user'
        });
        return;
      }

      const { user, token } = result;

      res.status(HTTP_STATUS.CREATED).json({ 
        success: true,
        data: { user, token },
        message: 'User registered successfully'
      });
    } catch (error: any) {
      if (error.message.includes(ERROR_MESSAGES.EMAIL_EXISTS)) {
        res.status(HTTP_STATUS.CONFLICT).json({ 
          success: false,
          error: ERROR_MESSAGES.EMAIL_EXISTS,
          message: ERROR_MESSAGES.EMAIL_EXISTS
        });
        return;
      }
      
      if (error.message.includes(ERROR_MESSAGES.VALIDATION_ERROR)) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({ 
          success: false,
          error: ERROR_MESSAGES.VALIDATION_ERROR,
          message: error.message
        });
        return;
      }
      
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ 
        success: false,
        error: ERROR_MESSAGES.INTERNAL_ERROR,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Login user with credentials
   */
  public async login(req: Request, res: Response): Promise<void> {
    try {
      const credentials = req.body;

      const result = await this.authService.login(credentials);

      if (!result) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({ 
          success: false,
          error: ERROR_MESSAGES.INTERNAL_ERROR,
          message: 'Failed to login user'
        });
        return;
      }

      const { user, token } = result;

      res.status(HTTP_STATUS.OK).json({ 
        success: true,
        data: { user, token },
        message: 'Login successful'
      });
    } catch (error: any) {
      if (error.message.includes(ERROR_MESSAGES.USER_NOT_FOUND)) {
        res.status(HTTP_STATUS.NOT_FOUND).json({ 
          success: false,
          error: ERROR_MESSAGES.USER_NOT_FOUND,
          message: ERROR_MESSAGES.USER_NOT_FOUND
        });
        return;
      }
      
      if (error.message.includes(ERROR_MESSAGES.INVALID_CREDENTIALS)) {
        res.status(HTTP_STATUS.UNAUTHORIZED).json({ 
          success: false,
          error: ERROR_MESSAGES.INVALID_CREDENTIALS,
          message: ERROR_MESSAGES.INVALID_CREDENTIALS
        });
        return;
      }
      
      if (error.message.includes(ERROR_MESSAGES.VALIDATION_ERROR)) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({ 
          success: false,
          error: ERROR_MESSAGES.VALIDATION_ERROR,
          message: error.message
        });
        return;
      }
      
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ 
        success: false,
        error: ERROR_MESSAGES.INTERNAL_ERROR,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Verify JWT token
   */
  public async verifyToken(req: Request, res: Response): Promise<void> {
    try {
      // This endpoint would typically be protected by middleware
      // For now, we'll just return a success response
      res.status(HTTP_STATUS.OK).json({ 
        success: true,
        data: { valid: true },
        message: 'Token is valid'
      });
    } catch (error) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ 
        success: false,
        error: ERROR_MESSAGES.INTERNAL_ERROR,
        message: 'Internal server error'
      });
    }
  }
}