// src/use-cases/user/update-profile.ts

import { UserRepository } from '@/shared/repository';
import { User } from '@/entities/user';

export class UpdateProfileUseCase {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async execute(userData: Partial<User>): Promise<User> {
    return this.userRepository.updateProfile(userData);
  }
}