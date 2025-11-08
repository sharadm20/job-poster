// src/use-cases/user/get-profile.ts

import { UserRepository } from '@/shared/repository';
import { User } from '@/entities/user';

export class GetProfileUseCase {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async execute(): Promise<User> {
    return this.userRepository.getProfile();
  }
}