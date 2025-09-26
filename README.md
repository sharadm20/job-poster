
# AI Job Applier with Redis Queue & Rust Worker

This package adds a Redis-backed queue and a Rust worker that consumes jobs and runs the Playwright TypeScript script, then stores results into Postgres.

How to run locally (quick):
1. Ensure Docker is running.
2. From project root: `docker-compose up --build`
3. Create DB migrations and apply (ensure uuid-ossp extension present).
4. Use backend endpoints to upload resumes and enqueue apply jobs.
