// apps/user-service/src/controllers/UserController.ts
import { Request, Response } from 'express';
import { UserService } from '../services/UserService';
import { ERROR_MESSAGES, HTTP_STATUS } from '@ai-job-applier/shared';
import { IApiResponse } from '@ai-job-applier/types';

export class UserController {
  /**
   * Create a new user
   */
  public static async createUser(req: Request, res: Response): Promise<void> {
    try {
      const userData = req.body;

      // Create the user using the service layer
      const user = await UserService.createUser(userData);

      if (!user) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({ 
          success: false,
          error: ERROR_MESSAGES.INTERNAL_ERROR,
          message: 'Failed to create user'
        });
        return;
      }

      res.status(HTTP_STATUS.CREATED).json({ 
        success: true,
        data: user,
        message: 'User created successfully'
      });
    } catch (error: any) {
      if (error.message.includes('Email already exists')) {
        res.status(HTTP_STATUS.CONFLICT).json({ 
          success: false,
          error: ERROR_MESSAGES.EMAIL_EXISTS,
          message: ERROR_MESSAGES.EMAIL_EXISTS
        });
        return;
      }
      
      if (error.message.includes('Validation error')) {
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
   * Get user by ID
   */
  public static async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const user = await UserService.findById(id);

      if (!user) {
        res.status(HTTP_STATUS.NOT_FOUND).json({ 
          success: false,
          error: ERROR_MESSAGES.USER_NOT_FOUND,
          message: ERROR_MESSAGES.USER_NOT_FOUND
        });
        return;
      }

      res.status(HTTP_STATUS.OK).json({ 
        success: true,
        data: user,
        message: 'User retrieved successfully'
      });
    } catch (error) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ 
        success: false,
        error: ERROR_MESSAGES.INTERNAL_ERROR,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Get user by email
   */
  public static async getUserByEmail(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.params;

      const user = await UserService.findByEmail(email);

      if (!user) {
        res.status(HTTP_STATUS.NOT_FOUND).json({ 
          success: false,
          error: ERROR_MESSAGES.USER_NOT_FOUND,
          message: ERROR_MESSAGES.USER_NOT_FOUND
        });
        return;
      }

      res.status(HTTP_STATUS.OK).json({ 
        success: true,
        data: user,
        message: 'User retrieved successfully'
      });
    } catch (error) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ 
        success: false,
        error: ERROR_MESSAGES.INTERNAL_ERROR,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Update user by ID
   */
  public static async updateUser(req: Request, res: Response): Promise<void> {
    try {
      // Implementation will be added later
      res.status(HTTP_STATUS.NOT_FOUND).json({ 
        success: false,
        error: 'Not implemented',
        message: 'Endpoint not implemented yet'
      });
    } catch (error) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ 
        success: false,
        error: ERROR_MESSAGES.INTERNAL_ERROR,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Delete user by ID
   */
  public static async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      // Implementation will be added later
      res.status(HTTP_STATUS.NOT_FOUND).json({ 
        success: false,
        error: 'Not implemented',
        message: 'Endpoint not implemented yet'
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