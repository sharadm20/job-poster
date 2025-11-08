// src/use-cases/auth/logout.ts

import { UserRepository } from '@/shared/repository';

export class LogoutUseCase {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  execute(): void {
    this.userRepository.logout();
  }
}