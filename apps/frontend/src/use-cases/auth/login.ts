// src/use-cases/auth/login.ts

import { UserRepository } from '@/shared/repository';
import { UserCredentials } from '@/entities/user';

export class LoginUseCase {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async execute(credentials: UserCredentials): Promise<{ token: string }> {
    return this.userRepository.login(credentials);
  }
}