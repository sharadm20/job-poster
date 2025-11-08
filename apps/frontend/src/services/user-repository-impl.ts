// src/services/user-repository-impl.ts

import { UserRepository } from '@/shared/repository';
import { ApiService } from './api-service';
import { User, UserCredentials, UserRegistrationData } from '@/entities/user';

export class UserRepositoryImpl implements UserRepository {
  private apiService: ApiService;

  constructor(apiService: ApiService) {
    this.apiService = apiService;
  }

  async getProfile(): Promise<User> {
    const response = await this.apiService.getProfile();
    if (!response.data.data) {
      throw new Error('Profile not found');
    }
    return response.data.data;
  }

  async updateProfile(userData: Partial<User>): Promise<User> {
    const response = await this.apiService.updateProfile(userData);
    if (!response.data.data) {
      throw new Error('Failed to update profile');
    }
    return response.data.data;
  }

  async register(userData: UserRegistrationData): Promise<{ token: string }> {
    const response = await this.apiService.register(userData);
    if (!response.data.data) {
      throw new Error('Registration failed');
    }
    // Store the token in localStorage
    if (response.data.data.token) {
      localStorage.setItem('token', response.data.data.token);
    }
    return response.data.data;
  }

  async login(credentials: UserCredentials): Promise<{ token: string }> {
    const response = await this.apiService.login(credentials);
    if (!response.data.data) {
      throw new Error('Login failed');
    }
    // Store the token in localStorage
    if (response.data.data.token) {
      localStorage.setItem('token', response.data.data.token);
    }
    return response.data.data;
  }

  logout(): void {
    this.apiService.logout();
  }
}