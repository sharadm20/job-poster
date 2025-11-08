// __tests__/use-cases/auth/login.test.ts

import { LoginUseCase } from '@/use-cases/auth/login';
import { UserRepository } from '@/shared/repository';
import { UserCredentials } from '@/entities/user';

describe('LoginUseCase', () => {
  let mockUserRepository: UserRepository;
  let loginUseCase: LoginUseCase;
  const mockCredentials: UserCredentials = {
    email: 'test@example.com',
    password: 'password123'
  };
  
  const mockTokenResponse = {
    token: 'mock-jwt-token'
  };

  beforeEach(() => {
    mockUserRepository = {
      getProfile: jest.fn(),
      updateProfile: jest.fn(),
      register: jest.fn(),
      login: jest.fn(),
      logout: jest.fn(),
    } as unknown as UserRepository;

    loginUseCase = new LoginUseCase(mockUserRepository);
  });

  it('should return token when login is successful', async () => {
    // Arrange
    (mockUserRepository.login as jest.MockedFunction<any>).mockResolvedValue(mockTokenResponse);

    // Act
    const result = await loginUseCase.execute(mockCredentials);

    // Assert
    expect(mockUserRepository.login).toHaveBeenCalledWith(mockCredentials);
    expect(result).toEqual(mockTokenResponse);
  });

  it('should handle errors when repository throws an error', async () => {
    // Arrange
    const errorMessage = 'Invalid credentials';
    (mockUserRepository.login as jest.MockedFunction<any>).mockRejectedValue(new Error(errorMessage));

    // Act & Assert
    await expect(loginUseCase.execute(mockCredentials)).rejects.toThrow(errorMessage);
    expect(mockUserRepository.login).toHaveBeenCalledWith(mockCredentials);
  });
});