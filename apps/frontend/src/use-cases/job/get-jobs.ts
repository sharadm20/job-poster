// src/use-cases/job/get-jobs.ts

import { JobRepository } from '@/shared/repository';
import { Job } from '@/entities/job';

export class GetJobsUseCase {
  private jobRepository: JobRepository;

  constructor(jobRepository: JobRepository) {
    this.jobRepository = jobRepository;
  }

  async execute(): Promise<Job[]> {
    return this.jobRepository.getJobs();
  }
}