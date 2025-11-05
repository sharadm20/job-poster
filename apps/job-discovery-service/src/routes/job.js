"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// apps/job-discovery-service/src/routes/job.ts
const express_1 = require("express");
const JobController_1 = require("../controllers/JobController");
const router = (0, express_1.Router)();
const jobController = new JobController_1.JobController();
// Get all jobs
router.get('/', jobController.getAllJobs.bind(jobController));
// Get jobs by user (authenticated)
router.get('/user', jobController.getJobsByUser.bind(jobController));
// Get specific job by ID
router.get('/:id', jobController.getJobById.bind(jobController));
// Start job scraping
router.post('/scrape', jobController.startScraping.bind(jobController));
exports.default = router;
