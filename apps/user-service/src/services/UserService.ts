// apps/user-service/src/services/UserService.ts
import { User } from '@ai-job-applier/database';
import { IUser } from '@ai-job-applier/types';
import { hashPassword } from '@ai-job-applier/utils';
import Joi from 'joi';
import { ERROR_MESSAGES } from '@ai-job-applier/shared';

// Define the validation schema for user input
const userValidationSchema = Joi.object({
  firstName: Joi.string().max(50).required(),
  lastName: Joi.string().max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(128).required(),
  location: Joi.string().optional(),
  experience: Joi.number().min(0).optional(),
  skills: Joi.array().items(Joi.string()).optional(),
  preferences: Joi.object({
    location: Joi.string().optional(),
    remote: Joi.boolean().optional(),
    jobTypes: Joi.array().items(Joi.string()).optional(),
    salary: Joi.number().optional()
  }).optional()
});

export class UserService {
  /**
   * Create a new user
   * @param userData - The user data to create
   * @returns The created user (without password)
   */
  public static async createUser(userData: any): Promise<Omit<IUser, 'password'> | null> {
    // Validate input data
    const { error } = userValidationSchema.validate(userData);
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
      ...userData,
      password: hashedPassword
    };

    // Create and save the user
    const user = new User(userObject);
    const savedUser = await user.save();

    // Return user without password
    const userObjectWithoutPassword = savedUser.toJSON() as Omit<IUser, 'password'> & { password?: string };
    delete userObjectWithoutPassword.password;
    return userObjectWithoutPassword;
  }

  /**
   * Find a user by email
   * @param email - The email to search for
   * @returns The user or null if not found
   */
  public static async findByEmail(email: string): Promise<Omit<IUser, 'password'> | null> {
    const user = await User.findOne({ email });
    if (!user) {
      return null;
    }

    // Return user without password
    const userObject = user.toJSON() as Omit<IUser, 'password'> & { password?: string };
    delete userObject.password;
    return userObject;
  }

  /**
   * Find a user by ID
   * @param id - The ID to search for
   * @returns The user or null if not found
   */
  public static async findById(id: string): Promise<Omit<IUser, 'password'> | null> {
    const user = await User.findById(id);
    if (!user) {
      return null;
    }

    // Return user without password
    const userObject = user.toJSON() as Omit<IUser, 'password'> & { password?: string };
    delete userObject.password;
    return userObject;
  }
}