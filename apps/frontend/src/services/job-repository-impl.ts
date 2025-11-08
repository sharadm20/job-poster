// src/services/job-repository-impl.ts

import { JobRepository } from '@/shared/repository';
import { ApiService } from './api-service';
import { Job, JobSearchParams } from '@/entities/job';

export class JobRepositoryImpl implements JobRepository {
  private apiService: ApiService;

  constructor(apiService: ApiService) {
    this.apiService = apiService;
  }

  async getJobs(): Promise<Job[]> {
    const response = await this.apiService.getJobs();
    return response.data.data || [];
  }

  async getJobById(id: string): Promise<Job> {
    const response = await this.apiService.getJobById(id);
    if (!response.data.data) {
      throw new Error('Job not found');
    }
    return response.data.data;
  }

  async searchJobs(query: string): Promise<Job[]> {
    const response = await this.apiService.searchJobs({ query });
    return response.data.data || [];
  }

  async applyToJob(jobId: string): Promise<void> {
    await this.apiService.applyToJob(jobId);
  }
}