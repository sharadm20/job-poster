// apps/job-discovery-service/src/controllers/JobController.ts
import { Request, Response } from 'express';
import { JobService } from '../services/JobService';
import { ERROR_MESSAGES, HTTP_STATUS } from '@ai-job-applier/shared';
import { IApiResponse } from '@ai-job-applier/types';

export class JobController {
  private jobService: JobService;

  constructor() {
    this.jobService = new JobService();
  }

  /**
   * Get all jobs
   */
  public async getAllJobs(req: Request, res: Response): Promise<void> {
    try {
      const jobs = await this.jobService.getAllJobs();
      res.status(HTTP_STATUS.OK).json({ 
        success: true,
        data: jobs,
        message: 'Jobs retrieved successfully'
      });
    } catch (error: any) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ 
        success: false,
        error: ERROR_MESSAGES.INTERNAL_ERROR,
        message: error.message
      });
    }
  }

  /**
   * Start job scraping process
   */
  public async startScraping(req: Request, res: Response): Promise<void> {
    try {
      const scrapeData = req.body;

      const result = await this.jobService.startScraping(scrapeData);

      res.status(HTTP_STATUS.OK).json({ 
        success: true,
        data: result,
        message: 'Scraping started successfully'
      });
    } catch (error: any) {
      if (error.message.includes(ERROR_MESSAGES.VALIDATION_ERROR)) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({ 
          success: false,
          error: ERROR_MESSAGES.VALIDATION_ERROR,
          message: error.message
        });
        return;
      }
      
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ 
        success: false,
        error: ERROR_MESSAGES.INTERNAL_ERROR,
        message: error.message
      });
    }
  }

  /**
   * Get jobs by user ID (for authenticated users)
   */
  public async getJobsByUser(req: Request, res: Response): Promise<void> {
    try {
      // Implementation would filter jobs by userId
      // For now returning all jobs
      const jobs = await this.jobService.getAllJobs();
      res.status(HTTP_STATUS.OK).json({ 
        success: true,
        data: jobs,
        message: 'User jobs retrieved successfully'
      });
    } catch (error: any) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ 
        success: false,
        error: ERROR_MESSAGES.INTERNAL_ERROR,
        message: error.message
      });
    }
  }

  /**
   * Get a specific job by ID
   */
  public async getJobById(req: Request, res: Response): Promise<void> {
    try {
      // Implementation will be added later
      res.status(HTTP_STATUS.NOT_FOUND).json({ 
        success: false,
        error: 'Not implemented',
        message: 'Endpoint not implemented yet'
      });
    } catch (error: any) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ 
        success: false,
        error: ERROR_MESSAGES.INTERNAL_ERROR,
        message: error.message
      });
    }
  }
}