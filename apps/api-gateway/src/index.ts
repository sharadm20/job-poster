// apps/api-gateway/src/index.ts
import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { authMiddleware } from './middlewares/auth.middleware';
import { HTTP_STATUS } from '@ai-job-applier/shared';

const app: Application = express();
const DEFAULT_PORT = parseInt(process.env.PORT || '4000', 10);

// Environment variables for service URLs
// For local development, use localhost with predetermined ports
// For Docker, services are accessible by their service names
const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://localhost:4001';
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://localhost:4002';
const JOB_DISCOVERY_SERVICE_URL = process.env.JOB_DISCOVERY_SERVICE_URL || 'http://localhost:4003';

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(HTTP_STATUS.OK).json({
    success: true,
    status: 'OK',
    timestamp: new Date().toISOString(),
    services: {
      user: USER_SERVICE_URL,
      auth: AUTH_SERVICE_URL,
      jobDiscovery: JOB_DISCOVERY_SERVICE_URL
    }
  });
});

// Proxy middleware for user service
app.use('/api/users', createProxyMiddleware({
  target: USER_SERVICE_URL,
  changeOrigin: true,
  proxyTimeout: 60000, // 60 seconds for proxy request timeout
  pathRewrite: {
    '^/api': '', // Remove the /api prefix when forwarding to service
  },
}));

// Proxy middleware for auth service
app.use('/api/auth', createProxyMiddleware({
  target: AUTH_SERVICE_URL,
  changeOrigin: true,
  proxyTimeout: 60000, // 60 seconds for proxy request timeout
  pathRewrite: {
    '^/api': '', // Remove the /api prefix when forwarding to service
  },
}));

// Proxy middleware for job discovery service
// Only authenticated users can access job endpoints
app.use('/api/jobs', authMiddleware, createProxyMiddleware({
  target: JOB_DISCOVERY_SERVICE_URL,
  changeOrigin: true,
  proxyTimeout: 60000, // 60 seconds for proxy request timeout
  pathRewrite: {
    '^/api': '', // Remove the /api prefix when forwarding to service
  },
}));

// Catch-all route for any other endpoints
app.all('*', (req: Request, res: Response) => {
  res.status(HTTP_STATUS.NOT_FOUND).json({
    success: false,
    error: 'Route not found',
    message: `The route ${req.method} ${req.url} was not found`
  });
});

// Function to attempt to start the server on a given port
const startServer = (port: number) => {
  return new Promise((resolve, reject) => {
    const server = app.listen(port, () => {
      console.log(`API Gateway is running on port ${port}`);
      console.log(`User Service Proxy: ${USER_SERVICE_URL}`);
      console.log(`Auth Service Proxy: ${AUTH_SERVICE_URL}`);
      console.log(`Job Discovery Service Proxy: ${JOB_DISCOVERY_SERVICE_URL}`);
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
    server.setTimeout(65000); // Slightly higher than proxy timeout
    
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

startServer(DEFAULT_PORT).catch(error => {
  console.error('Failed to start API Gateway:', error);
  process.exit(1);
});

export default app;