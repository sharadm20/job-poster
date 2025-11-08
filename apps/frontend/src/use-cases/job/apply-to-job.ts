// src/use-cases/job/apply-to-job.ts

import { JobRepository } from '@/shared/repository';

export class ApplyToJobUseCase {
  private jobRepository: JobRepository;

  constructor(jobRepository: JobRepository) {
    this.jobRepository = jobRepository;
  }

  async execute(jobId: string): Promise<void> {
    return this.jobRepository.applyToJob(jobId);
  }
}