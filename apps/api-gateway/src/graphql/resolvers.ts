import { IResolvers } from '@graphql-tools/utils';
import axios from 'axios';
import { AuthService } from '@ai-job-applier/auth';
import { createUserClient, createAuthClient, createJobClient } from '@ai-job-applier/shared/grpc/client';
import { cacheService } from '@ai-job-applier/shared';

// Environment variables for gRPC services
const USER_SERVICE_PORT = parseInt(process.env.USER_SERVICE_GRPC_PORT || '50051', 10);
const AUTH_SERVICE_PORT = parseInt(process.env.AUTH_SERVICE_GRPC_PORT || '50052', 10);
const JOB_SERVICE_PORT = parseInt(process.env.JOB_SERVICE_GRPC_PORT || '50053', 10);

// Environment variables for REST services (for fallback)
const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://localhost:4001';
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://localhost:4002';
const JOB_DISCOVERY_SERVICE_URL = process.env.JOB_DISCOVERY_SERVICE_URL || 'http://localhost:4003';

const authService = new AuthService();

// Create gRPC clients
const userClient = createUserClient(USER_SERVICE_PORT);
const authClient = createAuthClient(AUTH_SERVICE_PORT);
const jobClient = createJobClient(JOB_SERVICE_PORT);

// Initialize cache service
try {
  cacheService.connect();
} catch (error) {
  console.error('Failed to connect to Redis:', error);
}

// GraphQL resolvers
export const resolvers: IResolvers = {
  Query: {
    me: async (_parent, _args, context) => {
      const token = context.token;
      if (!token) {
        throw new Error('Authentication token required');
      }

      try {
        const decoded = authService.verifyToken(token);
        if (!decoded) {
          throw new Error('Invalid token');
        }

        // Use gRPC to get user by ID
        return new Promise((resolve, reject) => {
          userClient.getUserById({ id: decoded.userId }, (error: any, response: any) => {
            if (error) {
              reject(new Error('Failed to fetch user'));
            } else if (!response.success) {
              reject(new Error(response.error || 'Failed to fetch user'));
            } else {
              resolve(response.user);
            }
          });
        });
      } catch (error) {
        throw new Error('Failed to fetch user');
      }
    },

    user: async (_parent, { id }) => {
      try {
        // First, try to get user from cache
        const cachedUser = await cacheService.get(`user:${id}`);
        if (cachedUser) {
          console.log(`Cache hit for user: ${id}`);
          return cachedUser;
        }

        // Use gRPC to get user by ID
        return new Promise(async (resolve, reject) => {
          userClient.getUserById({ id }, async (error: any, response: any) => {
            if (error) {
              reject(new Error('Failed to fetch user'));
            } else if (!response.success) {
              reject(new Error(response.error || 'Failed to fetch user'));
            } else {
              // Cache the user data for future requests (10 minutes TTL)
              await cacheService.set(`user:${id}`, response.user, 600);
              resolve(response.user);
            }
          });
        });
      } catch (error) {
        throw new Error('Failed to fetch user');
      }
    },

    users: async () => {
      // For getting all users, we'll continue to use the REST API
      // since gRPC doesn't support this operation yet
      try {
        const response = await axios.get(`${USER_SERVICE_URL}/api/users`);
        return response.data.data;
      } catch (error) {
        throw new Error('Failed to fetch users');
      }
    },

    jobs: async (_parent, _args, context) => {
      const token = context.token;
      if (!token) {
        throw new Error('Authentication token required');
      }

      try {
        const decoded = authService.verifyToken(token);
        if (!decoded) {
          throw new Error('Invalid token');
        }

        // Create cache key based on user ID
        const cacheKey = `jobs:user:${decoded.userId}`;

        // First, try to get jobs from cache
        const cachedJobs = await cacheService.get(cacheKey);
        if (cachedJobs) {
          console.log(`Cache hit for jobs for user: ${decoded.userId}`);
          return cachedJobs;
        }

        // Use gRPC to get jobs
        return new Promise(async (resolve, reject) => {
          jobClient.getJobs({ userId: decoded.userId }, async (error: any, response: any) => {
            if (error) {
              reject(new Error('Failed to fetch jobs'));
            } else if (!response.success) {
              reject(new Error(response.error || 'Failed to fetch jobs'));
            } else {
              // Cache the jobs data for future requests (5 minutes TTL)
              await cacheService.set(cacheKey, response.jobs, 300);
              resolve(response.jobs);
            }
          });
        });
      } catch (error) {
        throw new Error('Failed to fetch jobs');
      }
    },

    job: async (_parent, { id }, context) => {
      const token = context.token;
      if (!token) {
        throw new Error('Authentication token required');
      }

      try {
        const decoded = authService.verifyToken(token);
        if (!decoded) {
          throw new Error('Invalid token');
        }

        // Create cache key for the job
        const cacheKey = `job:${id}`;

        // First, try to get job from cache
        const cachedJob = await cacheService.get(cacheKey);
        if (cachedJob) {
          console.log(`Cache hit for job: ${id}`);
          return cachedJob;
        }

        // Use gRPC to get job by ID
        return new Promise(async (resolve, reject) => {
          jobClient.getJobById({ id }, async (error: any, response: any) => {
            if (error) {
              reject(new Error('Failed to fetch job'));
            } else if (!response.success) {
              reject(new Error(response.error || 'Failed to fetch job'));
            } else {
              // Cache the job data for future requests (15 minutes TTL)
              await cacheService.set(cacheKey, response.job, 900);
              resolve(response.job);
            }
          });
        });
      } catch (error) {
        throw new Error('Failed to fetch job');
      }
    },

    userJobs: async (_parent, _args, context) => {
      const token = context.token;
      if (!token) {
        throw new Error('Authentication token required');
      }

      try {
        const decoded = authService.verifyToken(token);
        if (!decoded) {
          throw new Error('Invalid token');
        }

        // Use gRPC to get user's jobs
        return new Promise((resolve, reject) => {
          jobClient.getUserJobs({ userId: decoded.userId }, (error: any, response: any) => {
            if (error) {
              reject(new Error('Failed to fetch user jobs'));
            } else if (!response.success) {
              reject(new Error(response.error || 'Failed to fetch user jobs'));
            } else {
              resolve(response.jobs);
            }
          });
        });
      } catch (error) {
        throw new Error('Failed to fetch user jobs');
      }
    },
  },

  Mutation: {
    register: async (_parent, args) => {
      try {
        // Use gRPC to register user
        return new Promise((resolve, reject) => {
          userClient.createUser(args, (error: any, response: any) => {
            if (error) {
              reject(new Error('Registration failed'));
            } else if (!response.success) {
              reject(new Error(response.error || 'Registration failed'));
            } else {
              resolve(response.user);
            }
          });
        });
      } catch (error: any) {
        throw new Error('Registration failed');
      }
    },

    login: async (_parent, { email, password }) => {
      try {
        // Use gRPC to login user
        return new Promise((resolve, reject) => {
          authClient.login({ email, password }, (error: any, response: any) => {
            if (error) {
              reject(new Error('Login failed'));
            } else if (!response.success) {
              reject(new Error(response.error || 'Login failed'));
            } else {
              resolve(response);
            }
          });
        });
      } catch (error: any) {
        throw new Error('Login failed');
      }
    },

    scrapeJobs: async (_parent, args, context) => {
      const token = context.token;
      if (!token) {
        throw new Error('Authentication token required');
      }

      try {
        const decoded = authService.verifyToken(token);
        if (!decoded) {
          throw new Error('Invalid token');
        }

        // Add userId to the args for the gRPC call
        const grpcArgs = {
          ...args,
          userId: decoded.userId
        };

        // Use gRPC to scrape jobs
        return new Promise((resolve, reject) => {
          jobClient.scrapeJobs(grpcArgs, (error: any, response: any) => {
            if (error) {
              reject(new Error('Failed to scrape jobs'));
            } else if (!response.success) {
              reject(new Error(response.error || 'Failed to scrape jobs'));
            } else {
              resolve(response.jobs);
            }
          });
        });
      } catch (error: any) {
        throw new Error('Failed to scrape jobs');
      }
    },
  },
};