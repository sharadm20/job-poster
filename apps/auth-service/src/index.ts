// apps/auth-service/src/index.ts
import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from './routes/auth';
import { connectDB } from '@ai-job-applier/database';

const app: Application = express();
const DEFAULT_PORT = parseInt(process.env.PORT || '4002', 10);

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({
  // Increase the request body size limit if needed for large requests
  limit: '10mb'
}));

// Routes
app.use('/api/auth', authRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'auth-service'
  });
});

// Function to attempt to start the server on a given port
const startServer = (port: number) => {
  return new Promise((resolve, reject) => {
    const server = app.listen(port, () => {
      console.log(`Auth Service is running on port ${port}`);
      resolve(server);
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

    // Set timeout for the server (in milliseconds)
    server.setTimeout(120000); // 120 seconds for request timeout
    
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
    console.error('Failed to start Auth Service:', error);
    process.exit(1);
  }
}).catch(error => {
  console.error('Failed to connect to database:', error);
  process.exit(1);
});

export default app;