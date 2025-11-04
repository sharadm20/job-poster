// apps/job-discovery-service/src/index.ts
import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import jobRoutes from './routes/job';
import { connectDB } from '@ai-job-applier/database';

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/jobs', jobRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    success: true,
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'job-discovery-service'
  });
});

// Connect to MongoDB and start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Job Discovery Service is running on port ${PORT}`);
  });
}).catch(error => {
  console.error('Failed to start Job Discovery Service:', error);
  process.exit(1);
});

export default app;