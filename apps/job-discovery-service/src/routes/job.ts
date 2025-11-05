// apps/job-discovery-service/src/routes/job.ts
import { Router } from 'express';
import { JobController } from '../controllers/JobController';

const router = Router();
const jobController = new JobController();

// Get all jobs
router.get('/', jobController.getAllJobs.bind(jobController));

// Get jobs by user (authenticated)
router.get('/user', jobController.getJobsByUser.bind(jobController));

// Get specific job by ID
router.get('/:id', jobController.getJobById.bind(jobController));

// Start job scraping
router.post('/scrape', jobController.startScraping.bind(jobController));

export default router;