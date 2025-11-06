// apps/api-gateway/src/index.ts
import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
const proxy = require('http-proxy-middleware');
import { authMiddleware } from './middlewares/auth.middleware';
import { HTTP_STATUS } from '@ai-job-applier/shared';

const app: Application = express();
const PORT = process.env.PORT || 8080;

// Environment variables for service URLs
// In Docker, services are accessible by their service names
const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://user-service:3000';
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://auth-service:3000';
const JOB_DISCOVERY_SERVICE_URL = process.env.JOB_DISCOVERY_SERVICE_URL || 'http://job-discovery-service:3000';

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
app.use('/api/users', proxy({
  target: USER_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: {
    '^/api': '', // Remove the /api prefix when forwarding to service
  },
}));

// Proxy middleware for auth service
app.use('/api/auth', proxy({
  target: AUTH_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: {
    '^/api': '', // Remove the /api prefix when forwarding to service
  },
}));

// Proxy middleware for job discovery service
// Only authenticated users can access job endpoints
app.use('/api/jobs', authMiddleware, proxy({
  target: JOB_DISCOVERY_SERVICE_URL,
  changeOrigin: true,
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

app.listen(PORT, () => {
  console.log(`API Gateway is running on port ${PORT}`);
  console.log(`User Service Proxy: ${USER_SERVICE_URL}`);
  console.log(`Auth Service Proxy: ${AUTH_SERVICE_URL}`);
  console.log(`Job Discovery Service Proxy: ${JOB_DISCOVERY_SERVICE_URL}`);
});

export default app;