// src/shared/repository.ts

export interface UserRepository {
  getProfile(): Promise<any>;
  updateProfile(userData: any): Promise<any>;
  register(userData: any): Promise<any>;
  login(credentials: any): Promise<any>;
  logout(): void;
}

export interface JobRepository {
  getJobs(): Promise<any>;
  getJobById(id: string): Promise<any>;
  searchJobs(query: string): Promise<any>;
  applyToJob(jobId: string): Promise<any>;
}