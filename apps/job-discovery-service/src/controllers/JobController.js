"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobController = void 0;
const JobService_1 = require("../services/JobService");
const shared_1 = require("@ai-job-applier/shared");
class JobController {
    constructor() {
        this.jobService = new JobService_1.JobService();
    }
    /**
     * Get all jobs
     */
    async getAllJobs(req, res) {
        try {
            const jobs = await this.jobService.getAllJobs();
            res.status(shared_1.HTTP_STATUS.OK).json({
                success: true,
                data: jobs,
                message: 'Jobs retrieved successfully'
            });
        }
        catch (error) {
            res.status(shared_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: shared_1.ERROR_MESSAGES.INTERNAL_ERROR,
                message: error.message
            });
        }
    }
    /**
     * Start job scraping process
     */
    async startScraping(req, res) {
        try {
            const scrapeData = req.body;
            const result = await this.jobService.startScraping(scrapeData);
            res.status(shared_1.HTTP_STATUS.OK).json({
                success: true,
                data: result,
                message: 'Scraping started successfully'
            });
        }
        catch (error) {
            if (error.message.includes(shared_1.ERROR_MESSAGES.VALIDATION_ERROR)) {
                res.status(shared_1.HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    error: shared_1.ERROR_MESSAGES.VALIDATION_ERROR,
                    message: error.message
                });
                return;
            }
            res.status(shared_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: shared_1.ERROR_MESSAGES.INTERNAL_ERROR,
                message: error.message
            });
        }
    }
    /**
     * Get jobs by user ID (for authenticated users)
     */
    async getJobsByUser(req, res) {
        try {
            // Implementation would filter jobs by userId
            // For now returning all jobs
            const jobs = await this.jobService.getAllJobs();
            res.status(shared_1.HTTP_STATUS.OK).json({
                success: true,
                data: jobs,
                message: 'User jobs retrieved successfully'
            });
        }
        catch (error) {
            res.status(shared_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: shared_1.ERROR_MESSAGES.INTERNAL_ERROR,
                message: error.message
            });
        }
    }
    /**
     * Get a specific job by ID
     */
    async getJobById(req, res) {
        try {
            // Implementation will be added later
            res.status(shared_1.HTTP_STATUS.NOT_FOUND).json({
                success: false,
                error: 'Not implemented',
                message: 'Endpoint not implemented yet'
            });
        }
        catch (error) {
            res.status(shared_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: shared_1.ERROR_MESSAGES.INTERNAL_ERROR,
                message: error.message
            });
        }
    }
}
exports.JobController = JobController;
