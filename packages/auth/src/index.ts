// packages/auth/src/index.ts
import jwt from 'jsonwebtoken';
import { IUser } from '@ai-job-applier/types';

export interface ITokenPayload {
  userId: string;
  email: string;
  iat: number;
  exp: number;
}

export class AuthService {
  private jwtSecret: string;

  constructor() {
    this.jwtSecret = process.env.JWT_SECRET || 'fallback_secret_key_for_development';
  }

  /**
   * Generate JWT token for user
   */
  public generateToken(user: IUser): string {
    if (!user.id || !user.email) {
      throw new Error('User must have id and email');
    }

    return jwt.sign(
      { userId: user.id, email: user.email },
      this.jwtSecret,
      { expiresIn: '24h' }
    );
  }

  /**
   * Verify JWT token
   */
  public verifyToken(token: string): ITokenPayload | null {
    try {
      const decoded = jwt.verify(token, this.jwtSecret) as ITokenPayload;
      return decoded;
    } catch (error) {
      console.error('Token verification failed:', error);
      return null;
    }
  }

  /**
   * Get user ID from token
   */
  public getUserIdFromToken(token: string): string | null {
    const payload = this.verifyToken(token);
    return payload ? payload.userId : null;
  }
}