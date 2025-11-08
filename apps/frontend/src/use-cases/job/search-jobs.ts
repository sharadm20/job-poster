// src/use-cases/job/search-jobs.ts

import { JobRepository } from '@/shared/repository';
import { Job, JobSearchParams } from '@/entities/job';

export class SearchJobsUseCase {
  private jobRepository: JobRepository;

  constructor(jobRepository: JobRepository) {
    this.jobRepository = jobRepository;
  }

  async execute(params: JobSearchParams): Promise<Job[]> {
    // For now, we'll just use the query parameter
    // In a real implementation, we would call a dedicated search endpoint
    if (params.query) {
      // This assumes the job repository has search functionality
      // Since our API service only has a searchJobs method, we'll use that
      // In our implementation, searchJobs just uses the query parameter
      const response = await this.jobRepository.searchJobs(params.query);
      return response;
    }
    
    // If no query, return all jobs
    return this.jobRepository.getJobs();
  }
}