// src/use-cases/auth/register.ts

import { UserRepository } from '@/shared/repository';
import { UserRegistrationData } from '@/entities/user';

export class RegisterUseCase {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async execute(userData: UserRegistrationData): Promise<{ token: string }> {
    return this.userRepository.register(userData);
  }
}