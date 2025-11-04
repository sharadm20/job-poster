// apps/job-discovery-service/src/services/JobService.ts
import { Job } from '@ai-job-applier/database';
import { IJob, IScrapeRequest, IScrapeResponse, IJobService } from '@ai-job-applier/types';
import Joi from 'joi';
import { ERROR_MESSAGES } from '@ai-job-applier/shared';

// Define the validation schema for scraping
const scrapeValidationSchema = Joi.object({
  source: Joi.string().valid('linkedin', 'indeed', 'glassdoor', 'ziprecruiter', 'other').required(),
  keywords: Joi.array().items(Joi.string()).min(1).required(),
  location: Joi.string().required(),
  maxResults: Joi.number().integer().min(1).max(100).optional().default(20)
});

export class JobService implements IJobService {
  /**
   * Get all jobs
   * @returns List of jobs
   */
  public static async getAllJobs(): Promise<Omit<IJob, 'description'>[]> {
    try {
      const jobs = await Job.find({}, { description: 0 }) // Exclude description for performance
        .sort({ postedDate: -1 }) // Sort by newest first
        .limit(50); // Limit to 50 jobs for performance

      // Transform jobs to exclude password-like fields if any exist and return with virtual id
      return jobs.map(job => {
        const jobObj = job.toJSON() as Omit<IJob, 'description'>;
        return jobObj;
      });
    } catch (error) {
      throw new Error(`Failed to fetch jobs: ${(error as Error).message}`);
    }
  }

  /**
   * Start job scraping process
   * @param scrapeData - The scraping parameters
   * @returns Result of the scraping process
   */
  public static async startScraping(scrapeData: IScrapeRequest): Promise<IScrapeResponse> {
    // Validate input data
    const { error } = scrapeValidationSchema.validate(scrapeData);
    if (error) {
      throw new Error(`${ERROR_MESSAGES.VALIDATION_ERROR}: ${error.details[0].message}`);
    }

    // In a real implementation, we would call the scraper here
    // For now, we'll simulate the scraping process
    try {
      // Simulate scraping process
      const simulatedJobs = await this.simulateScraping(scrapeData);
      
      return {
        message: 'Scraping started successfully',
        jobCount: simulatedJobs.length,
        jobs: simulatedJobs
      };
    } catch (error) {
      throw new Error(`Scraping failed: ${(error as Error).message}`);
    }
  }

  /**
   * Simulate scraping process (in real implementation, this would call actual scrapers)
   * @param scrapeData - The scraping parameters 
   * @returns Simulated job data
   */
  private static async simulateScraping(scrapeData: IScrapeRequest): Promise<IJob[]> {
    // This is a simulation - in a real implementation, we would scrape actual job boards
    const { source, keywords, location, maxResults = 20 } = scrapeData;
    
    // Create simulated jobs
    const jobs: IJob[] = [];
    for (let i = 0; i < Math.min(maxResults, 10); i++) { // Limit for simulation
      const job = new Job({
        title: `${keywords[0]} Position ${i+1}`,
        company: `Company ${i+1}`,
        location: location,
        description: `This is a sample job description for ${keywords[0]} position. This company is looking for a qualified ${keywords[0]} with experience in the field.`,
        postedDate: new Date(Date.now() - Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000), // Random date within last week
        url: `https://${source}.com/jobs/${i+1}`,
        source: source,
        remote: Math.random() > 0.5,
        jobType: ['full-time', 'part-time', 'contract'][Math.floor(Math.random() * 3)],
        experienceLevel: ['entry', 'mid', 'senior'][Math.floor(Math.random() * 3)],
        skills: keywords.slice(0, 3), // Use keywords as skills for simulation
        benefits: ['Health Insurance', '401k', 'PTO'][Math.floor(Math.random() * 3)]
      });
      
      // For simulation, we won't save to DB but return the objects
      jobs.push(job as IJob);
    }
    
    return jobs;
  }

  /**
   * Save jobs to database
   * @param jobs - Jobs to save
   * @returns Number of jobs saved
   */
  public static async saveJobs(jobs: IJob[]): Promise<number> {
    try {
      const savedJobs = await Job.insertMany(jobs);
      return savedJobs.length;
    } catch (error) {
      throw new Error(`Failed to save jobs: ${(error as Error).message}`);
    }
  }
}