import request from 'supertest';
import { connectDB, disconnectDB, User } from '@ai-job-applier/database';
import { AuthService } from '../src/services/AuthService';

describe('Signup functionality', () => {
  let authService: AuthService;

  beforeAll(async () => {
    await connectDB();
    authService = new AuthService();
  });

  afterAll(async () => {
    // Clean up test data
    await User.deleteMany({ 
      email: { $in: ['test@example.com', 'jane@example.com', 'jane_duplicate_test@example.com', 'jane_duplicate_test2@example.com'] } 
    });
    await disconnectDB();
  });

  it('should successfully register a new user and persist to MongoDB', async () => {
    const userData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'test@example.com',
      password: 'securePassword123'
    };

    const result = await authService.register(userData);

    // Verify the result structure
    expect(result).toBeDefined();
    expect(result?.user).toBeDefined();
    expect(result?.token).toBeDefined();
    expect(result?.user.email).toBe(userData.email);
    expect(result?.user.firstName).toBe(userData.firstName);
    expect(result?.user.lastName).toBe(userData.lastName);
    
    // Verify that the user was actually saved to the database
    const savedUser = await User.findOne({ email: userData.email });
    expect(savedUser).toBeDefined();
    expect(savedUser?.firstName).toBe(userData.firstName);
    expect(savedUser?.lastName).toBe(userData.lastName);
    expect(savedUser?.email).toBe(userData.email);
    
    // Verify password was hashed (should not match the original)
    expect(savedUser?.password).not.toBe(userData.password);
    
    // Verify that the password can be verified with bcrypt
    const isPasswordValid = await authService.login({
      email: userData.email,
      password: userData.password
    });
    expect(isPasswordValid).toBeDefined();
  });

  it('should not allow duplicate email registration', async () => {
    const userData = {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane_duplicate_test2@example.com',
      password: 'anotherSecurePassword123'
    };

    // Register the user for the first time - should succeed
    const result = await authService.register(userData);
    expect(result).toBeDefined();

    // Try to register the same email again - should throw an error
    await expect(authService.register(userData)).rejects.toThrow('Email already exists');
  });
});