// apps/job-discovery-service/src/index.ts
import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import jobRoutes from './routes/job';
import { connectDB } from '@ai-job-applier/database';

const app: Application = express();
const DEFAULT_PORT = parseInt(process.env.PORT || '4003', 10);

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

// Function to attempt to start the server on a given port
const startServer = (port: number) => {
  return new Promise((resolve, reject) => {
    const server = app.listen(port, () => {
      console.log(`Job Discovery Service is running on port ${port}`);
    });

    server.on('error', (err: NodeJS.ErrnoException) => {
      if (err.code === 'EADDRINUSE') {
        console.log(`Port ${port} is already in use. Trying next port...`);
        startServer(port + 1)
          .then(resolve)
          .catch(reject);
      } else {
        reject(err);
      }
    });

    // Graceful shutdown handling
    process.on('SIGTERM', () => {
      console.log('SIGTERM received, shutting down gracefully');
      server.close(() => {
        console.log('Process terminated');
        process.exit(0);
      });
    });
    
    process.on('SIGINT', () => {
      console.log('SIGINT received, shutting down gracefully');
      server.close(() => {
        console.log('Process terminated');
        process.exit(0);
      });
    });
  });
};

// Connect to MongoDB and start server
connectDB().then(async () => {
  try {
    await startServer(DEFAULT_PORT);
  } catch (error) {
    console.error('Failed to start Job Discovery Service:', error);
    process.exit(1);
  }
}).catch(error => {
  console.error('Failed to start Job Discovery Service:', error);
  process.exit(1);
});

export default app;