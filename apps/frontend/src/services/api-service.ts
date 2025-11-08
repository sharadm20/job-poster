// src/services/api-service.ts

import axios, { AxiosResponse } from 'axios';
import { User, UserCredentials, UserRegistrationData } from '@/entities/user';
import { Job, JobSearchParams } from '@/entities/job';

// Base URL for API requests (Next.js will proxy these to the API gateway)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000/api';

// Create an axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // Increased from 10s to 30s to handle bcrypt hashing
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the token in headers
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle token expiration
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token might be expired, remove it and redirect to login
      localStorage.removeItem('token');
      if (typeof window !== 'undefined') {
        window.location.href = '/auth'; // Redirect to auth page
      }
    }
    return Promise.reject(error);
  }
);

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export class ApiService {
  // User API methods
  async getProfile(): Promise<AxiosResponse<ApiResponse<User>>> {
    return apiClient.get('/users/profile');
  }

  async updateProfile(userData: Partial<User>): Promise<AxiosResponse<ApiResponse<User>>> {
    return apiClient.put('/users/profile', userData);
  }

  async register(userData: UserRegistrationData): Promise<AxiosResponse<ApiResponse<{ token: string }>>> {
    return apiClient.post('/auth/register', userData);
  }

  async login(credentials: UserCredentials): Promise<AxiosResponse<ApiResponse<{ token: string }>>> {
    return apiClient.post('/auth/login', credentials);
  }

  async logout(): Promise<void> {
    localStorage.removeItem('token');
  }

  // Job API methods
  async getJobs(): Promise<AxiosResponse<ApiResponse<Job[]>>> {
    return apiClient.get('/jobs');
  }

  async getJobById(id: string): Promise<AxiosResponse<ApiResponse<Job>>> {
    return apiClient.get(`/jobs/${id}`);
  }

  async searchJobs(params: JobSearchParams): Promise<AxiosResponse<ApiResponse<Job[]>>> {
    const queryParams = new URLSearchParams();
    if (params.query) queryParams.append('q', params.query);
    if (params.location) queryParams.append('location', params.location);
    if (params.salaryMin) queryParams.append('salaryMin', params.salaryMin.toString());
    if (params.jobType) queryParams.append('type', params.jobType);

    const queryString = queryParams.toString();
    return apiClient.get(`/jobs/search${queryString ? `?${queryString}` : ''}`);
  }

  async applyToJob(jobId: string): Promise<AxiosResponse<ApiResponse>> {
    return apiClient.post(`/jobs/${jobId}/apply`);
  }
}