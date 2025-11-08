// src/entities/job.ts

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary?: string;
  description?: string;
  requirements?: string[];
  type?: string;
  experience?: string;
  applied: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface JobSearchParams {
  query?: string;
  location?: string;
  salaryMin?: number;
  jobType?: string;
}