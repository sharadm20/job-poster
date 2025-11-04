// apps/job-discovery-service/src/routes/job.ts
import { Router } from 'express';
import { JobController } from '../controllers/JobController';

const router = Router();

// Get all jobs
router.get('/', JobController.getAllJobs);

// Get jobs by user (authenticated)
router.get('/user', JobController.getJobsByUser);

// Get specific job by ID
router.get('/:id', JobController.getJobById);

// Start job scraping
router.post('/scrape', JobController.startScraping);

export default router;