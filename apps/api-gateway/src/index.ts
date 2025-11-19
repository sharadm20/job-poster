// apps/api-gateway/src/index.ts
import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { authMiddleware } from './middlewares/auth.middleware';
import { HTTP_STATUS, cacheService, observabilityService } from '@ai-job-applier/shared';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { typeDefs } from './graphql/schema';
import { resolvers } from './graphql/resolvers';

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

// Initialize Apollo Server
async function startApolloServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();

  // Apply Apollo GraphQL middleware
  app.use(
    '/graphql',
    expressMiddleware(server, {
      context: async ({ req }: { req: Request }) => {
        // Extract token from headers
        const authHeader = req.headers.authorization || '';
        const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : '';

        return { token } as any; // Using any to bypass strict typing for now
      },
    })
  );
}

// Proxy middleware for user service
app.use('/api/users', (req, res, next) => {
  const logger = observabilityService.getChildLogger({
    service: 'user-proxy',
    method: req.method,
    url: req.url
  });
  logger.info('Proxying request to user service', {
    target: USER_SERVICE_URL,
    originalUrl: req.originalUrl
  });
  next();
}, createProxyMiddleware({
  target: USER_SERVICE_URL,
  changeOrigin: true,
  proxyTimeout: 60000, // 60 seconds for proxy request timeout
  pathRewrite: {
    '^/api': '', // Remove the /api prefix when forwarding to service
  },
}));

// Proxy middleware for auth service
app.use('/api/auth', (req, res, next) => {
  const logger = observabilityService.getChildLogger({
    service: 'auth-proxy',
    method: req.method,
    url: req.url
  });
  logger.info('Proxying request to auth service', {
    target: AUTH_SERVICE_URL,
    originalUrl: req.originalUrl
  });
  next();
}, createProxyMiddleware({
  target: AUTH_SERVICE_URL,
  changeOrigin: true,
  proxyTimeout: 60000, // 60 seconds for proxy request timeout
  pathRewrite: {
    '^/api': '', // Remove the /api prefix when forwarding to service
  },
}));

// Proxy middleware for job discovery service
// Only authenticated users can access job endpoints
app.use('/api/jobs', authMiddleware, (req, res, next) => {
  const logger = observabilityService.getChildLogger({
    service: 'job-proxy',
    method: req.method,
    url: req.url
  });
  logger.info('Proxying request to job discovery service', {
    target: JOB_DISCOVERY_SERVICE_URL,
    originalUrl: req.originalUrl
  });
  next();
}, createProxyMiddleware({
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
const startServer = async (port: number) => {
  // Initialize observability services
  await observabilityService.initialize('api-gateway');
  const logger = observabilityService.getLogger();

  // Initialize Apollo Server
  await startApolloServer();

  // Initialize cache service
  try {
    await cacheService.connect();
    logger.info('Cache service connected successfully');
  } catch (error) {
    logger.error('Failed to connect to cache service:', error);
  }

  return new Promise((resolve, reject) => {
    const server = app.listen(port, async () => {
      logger.info('API Gateway started', {
        port,
        graphqlEndpoint: `http://localhost:${port}/graphql`,
        userServiceProxy: USER_SERVICE_URL,
        authServiceProxy: AUTH_SERVICE_URL,
        jobDiscoveryServiceProxy: JOB_DISCOVERY_SERVICE_URL
      });
    });

    server.on('error', (err: NodeJS.ErrnoException) => {
      if (err.code === 'EADDRINUSE') {
        logger.warn(`Port ${port} is already in use. Trying next port...`);
        startServer(port + 1)
          .then(resolve)
          .catch(reject);
      } else {
        logger.error('Server error occurred:', err);
        reject(err);
      }
    });

    // Set timeout for the server (in milliseconds)
    server.setTimeout(65000); // Slightly higher than proxy timeout

    // Graceful shutdown handling
    process.on('SIGTERM', async () => {
      logger.info('SIGTERM received, shutting down gracefully');
      try {
        await cacheService.disconnect();
        logger.info('Cache service disconnected');
      } catch (error) {
        logger.error('Error disconnecting cache service:', error);
      }
      try {
        await observabilityService.shutdown();
        logger.info('Observability services shut down');
      } catch (error) {
        logger.error('Error shutting down observability services:', error);
      }
      server.close(() => {
        logger.info('Process terminated');
        process.exit(0);
      });
    });

    process.on('SIGINT', async () => {
      logger.info('SIGINT received, shutting down gracefully');
      try {
        await cacheService.disconnect();
        logger.info('Cache service disconnected');
      } catch (error) {
        logger.error('Error disconnecting cache service:', error);
      }
      try {
        await observabilityService.shutdown();
        logger.info('Observability services shut down');
      } catch (error) {
        logger.error('Error shutting down observability services:', error);
      }
      server.close(() => {
        logger.info('Process terminated');
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