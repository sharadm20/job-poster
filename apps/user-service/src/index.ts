// apps/user-service/src/index.ts
import express, { Application } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import userRoutes from './routes/user';
import { connectDB } from '@ai-job-applier/database';
import { startGrpcServer } from './grpc/server';
import { HTTP_STATUS } from '@ai-job-applier/shared';

const app: Application = express();
const DEFAULT_PORT = parseInt(process.env.PORT || '4001', 10);
const GRPC_PORT = parseInt(process.env.GRPC_PORT || '50051', 10);

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(HTTP_STATUS.OK).json({
    success: true,
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'user-service',
    ports: {
      rest: DEFAULT_PORT,
      grpc: GRPC_PORT
    }
  });
});

// Keep track of both servers for graceful shutdown
let httpServer: any;
let grpcServer: any;

// Function to attempt to start the HTTP server on a given port
const startHttpServer = (port: number) => {
  return new Promise((resolve, reject) => {
    httpServer = app.listen(port, () => {
      console.log(`User Service REST API is running on port ${port}`);
    });

    httpServer.on('error', (err: NodeJS.ErrnoException) => {
      if (err.code === 'EADDRINUSE') {
        console.log(`Port ${port} is already in use. Trying next port...`);
        startHttpServer(port + 1)
          .then(resolve)
          .catch(reject);
      } else {
        reject(err);
      }
    });

    // Set timeout for the server (in milliseconds)
    httpServer.setTimeout(65000); // Slightly higher than proxy timeout

    resolve(httpServer);
  });
};

// Function to start the gRPC server
const startGrpcServerFn = (port: number) => {
  return new Promise((resolve, reject) => {
    try {
      grpcServer = startGrpcServer(port);
      grpcServer.start();
      console.log(`User Service gRPC server is running on port ${port}`);
      resolve(grpcServer);
    } catch (error) {
      reject(error);
    }
  });
};

// Connect to MongoDB and start both servers
connectDB().then(async () => {
  try {
    // Start both servers concurrently
    await Promise.all([
      startHttpServer(DEFAULT_PORT),
      startGrpcServerFn(GRPC_PORT)
    ]);

    console.log(`Both servers started successfully!`);
    console.log(`REST API: http://localhost:${DEFAULT_PORT}`);
    console.log(`gRPC: grpc://localhost:${GRPC_PORT}`);
  } catch (error) {
    console.error('Failed to start User Service:', error);
    process.exit(1);
  }
}).catch(error => {
  console.error('Failed to connect to database:', error);
  process.exit(1);
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  httpServer?.close(() => {
    console.log('HTTP server closed');
  });

  grpcServer?.tryShutdown(() => {
    console.log('gRPC server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  httpServer?.close(() => {
    console.log('HTTP server closed');
  });

  grpcServer?.tryShutdown(() => {
    console.log('gRPC server closed');
    process.exit(0);
  });
});

export default app;