// __tests__/use-cases/user/get-profile.test.ts

import { GetProfileUseCase } from '@/use-cases/user/get-profile';
import { UserRepository } from '@/shared/repository';
import { User } from '@/entities/user';

describe('GetProfileUseCase', () => {
  let mockUserRepository: UserRepository;
  let getProfileUseCase: GetProfileUseCase;
  const mockUser: User = {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    bio: 'Software Developer',
    skills: ['TypeScript', 'React'],
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01'
  };

  beforeEach(() => {
    mockUserRepository = {
      getProfile: jest.fn(),
      updateProfile: jest.fn(),
      register: jest.fn(),
      login: jest.fn(),
      logout: jest.fn(),
    } as unknown as UserRepository;

    getProfileUseCase = new GetProfileUseCase(mockUserRepository);
  });

  it('should return user profile when execute is called', async () => {
    // Arrange
    (mockUserRepository.getProfile as jest.MockedFunction<any>).mockResolvedValue(mockUser);

    // Act
    const result = await getProfileUseCase.execute();

    // Assert
    expect(mockUserRepository.getProfile).toHaveBeenCalled();
    expect(result).toEqual(mockUser);
  });

  it('should handle errors when repository throws an error', async () => {
    // Arrange
    const errorMessage = 'Failed to get profile';
    (mockUserRepository.getProfile as jest.MockedFunction<any>).mockRejectedValue(new Error(errorMessage));

    // Act & Assert
    await expect(getProfileUseCase.execute()).rejects.toThrow(errorMessage);
    expect(mockUserRepository.getProfile).toHaveBeenCalled();
  });
});