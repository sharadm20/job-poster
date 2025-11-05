// apps/auth-service/src/services/AuthService.ts
import { User } from '@ai-job-applier/database';
import { IUser, IAuthService } from '@ai-job-applier/types';
import { hashPassword, verifyPassword } from '@ai-job-applier/utils';
import { AuthService as JWTAuthService } from '@ai-job-applier/auth';
import Joi from 'joi';
import { ERROR_MESSAGES } from '@ai-job-applier/shared';

// Define the validation schema for registration
const registerValidationSchema = Joi.object({
  firstName: Joi.string().max(50).required(),
  lastName: Joi.string().max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(128).required()
});

// Define the validation schema for login
const loginValidationSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

export class AuthService implements IAuthService {
  private jwtAuthService: JWTAuthService;

  constructor() {
    this.jwtAuthService = new JWTAuthService();
  }

  /**
   * Register a new user
   * @param userData - The user data to register
   * @returns The created user and JWT token
   */
  public async register(userData: any): Promise<{ user: Omit<IUser, 'password'>, token: string } | null> {
    // Validate input data
    const { error } = registerValidationSchema.validate(userData);
    if (error) {
      throw new Error(`${ERROR_MESSAGES.VALIDATION_ERROR}: ${error.details[0].message}`);
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      throw new Error(ERROR_MESSAGES.EMAIL_EXISTS);
    }

    // Hash the password
    const hashedPassword = await hashPassword(userData.password);

    // Create the user object with hashed password
    const userObject = {
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      password: hashedPassword
    };

    // Create and save the user
    const user = new User(userObject);
    const savedUser = await user.save();

    // Generate JWT token
    const token = this.jwtAuthService.generateToken(savedUser);

    // Return user without password and the token
    const userObjectWithoutPassword = savedUser.toJSON() as Omit<IUser, 'password'> & { password?: string };
    delete userObjectWithoutPassword.password;
    
    return { user: userObjectWithoutPassword, token };
  }

  /**
   * Login user with credentials
   * @param credentials - The login credentials (email and password)
   * @returns The user and JWT token if credentials are valid
   */
  public async login(credentials: any): Promise<{ user: Omit<IUser, 'password'>, token: string } | null> {
    // Validate input data
    const { error } = loginValidationSchema.validate(credentials);
    if (error) {
      throw new Error(`${ERROR_MESSAGES.VALIDATION_ERROR}: ${error.details[0].message}`);
    }

    const { email, password } = credentials;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    // Verify the password
    if (!user.password) {
      throw new Error(ERROR_MESSAGES.INVALID_CREDENTIALS);
    }
    const isPasswordValid = await verifyPassword(password, user.password);
    if (!isPasswordValid) {
      throw new Error(ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    // Generate JWT token
    const token = this.jwtAuthService.generateToken(user);

    // Return user without password and the token
    const userObjectWithoutPassword = user.toJSON() as Omit<IUser, 'password'> & { password?: string };
    delete userObjectWithoutPassword.password;
    
    return { user: userObjectWithoutPassword, token };
  }
}