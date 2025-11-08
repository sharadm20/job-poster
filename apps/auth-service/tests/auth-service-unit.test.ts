import { AuthService } from '../src/services/AuthService';
import { User } from '@ai-job-applier/database';
import bcrypt from 'bcryptjs';

// Mock the database operations to test the service logic
jest.mock('@ai-job-applier/database', () => {
  const mockUser = {
    findOne: jest.fn(),
  };
  
  const mockUserInstance = {
    save: jest.fn()
  };
  
  // Mock the User constructor
  class MockUser {
    constructor(userData: any) {
      Object.assign(this, userData);
    }
    save = mockUserInstance.save;
  }
  
  return {
    ...jest.requireActual('@ai-job-applier/database'),
    User: MockUser,
    connectDB: jest.fn(),
    disconnectDB: jest.fn()
  };
});

describe('AuthService Signup Logic', () => {
  let authService: AuthService;

  beforeEach(() => {
    authService = new AuthService();
    jest.clearAllMocks();
  });

  it('should successfully register a new user with hashed password', async () => {
    const mockUserData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'test@example.com',
      password: 'securePassword123'
    };

    const mockSavedUser = {
      id: 'mockUserId',
      firstName: mockUserData.firstName,
      lastName: mockUserData.lastName,
      email: mockUserData.email,
      password: 'hashedPassword',
      toJSON: () => ({
        id: 'mockUserId',
        firstName: mockUserData.firstName,
        lastName: mockUserData.lastName,
        email: mockUserData.email,
        password: 'hashedPassword'
      })
    };

    (User.findOne as jest.Mock).mockResolvedValue(null); // No existing user
    (User.prototype.save as jest.Mock).mockResolvedValue(mockSavedUser);

    const result = await authService.register(mockUserData);

    expect(result).toBeDefined();
    expect(result?.user).toBeDefined();
    expect(result?.token).toBeDefined();
    expect(result?.user.email).toBe(mockUserData.email);
    expect(result?.user.firstName).toBe(mockUserData.firstName);
    expect(result?.user.lastName).toBe(mockUserData.lastName);
    
    // Verify that password was hashed (not the original plain text)
    expect(User.prototype.save).toHaveBeenCalledWith();
    expect((User.prototype.save as jest.Mock).mock.instances[0].password).not.toBe(mockUserData.password);
    
    // Verify the password was properly hashed using bcrypt
    const isHashed = await bcrypt.compare(mockUserData.password, mockSavedUser.password);
    expect(isHashed).toBe(true);
  });

  it('should reject registration if user already exists', async () => {
    const mockUserData = {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'existing@example.com',
      password: 'anotherPassword'
    };

    // Mock that a user with this email already exists
    (User.findOne as jest.Mock).mockResolvedValue({
      id: 'existingUserId',
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'existing@example.com',
      password: 'existingHashedPassword'
    });

    await expect(authService.register(mockUserData)).rejects.toThrow('Email already exists');
  });
});