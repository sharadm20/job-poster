import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';
import { UserService } from '../services/UserService';
import { IUser } from '@ai-job-applier/types';

// Define the path to the proto file
const PROTO_PATH = path.join(__dirname, '../../../../packages/shared/proto/user.proto');

// Options for loading the proto file
const packageDefinitionOptions: protoLoader.Options = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
};

// Load the proto file
const packageDefinition = protoLoader.loadSync(PROTO_PATH, packageDefinitionOptions);

// Load the proto object
const protoObject = grpc.loadPackageDefinition(packageDefinition);

// Extract the proto definition for the user service
const userProto = (protoObject as any).user;

// Define the service implementation type for gRPC
type GrpcUserServiceImpl = {
  [key: string]: grpc.handleUnaryCall<any, any>;
};

// Create the service implementation object
const createGrpcUserServiceImpl = (): GrpcUserServiceImpl => ({
  async createUser(call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>): Promise<void> {
    try {
      const userData = {
        firstName: call.request.firstName,
        lastName: call.request.lastName,
        email: call.request.email,
        password: call.request.password,
        location: call.request.location,
        experience: call.request.experience,
        skills: call.request.skills,
        preferences: call.request.preferences,
      };

      // Create the user using the service layer
      const user = await UserService.createUser(userData);

      if (!user) {
        callback(null, {
          success: false,
          message: 'Failed to create user',
          error: 'INTERNAL_ERROR'
        });
        return;
      }

      callback(null, {
        success: true,
        user: convertUserToGrpcFormat(user),
        message: 'User created successfully'
      });
    } catch (error: any) {
      if (error.message?.includes('Email already exists')) {
        callback(null, {
          success: false,
          message: 'Email already exists',
          error: 'EMAIL_EXISTS'
        });
      } else if (error.message?.includes('Validation error')) {
        callback(null, {
          success: false,
          message: error.message,
          error: 'VALIDATION_ERROR'
        });
      } else {
        callback(null, {
          success: false,
          message: 'Internal server error',
          error: 'INTERNAL_ERROR'
        });
      }
    }
  },

  async getUserById(call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>): Promise<void> {
    try {
      const userId = call.request.id;
      const user = await UserService.findById(userId);

      if (!user) {
        callback(null, {
          success: false,
          message: 'User not found',
          error: 'USER_NOT_FOUND'
        });
        return;
      }

      callback(null, {
        success: true,
        user: convertUserToGrpcFormat(user),
        message: 'User retrieved successfully'
      });
    } catch (error: any) {
      callback(null, {
        success: false,
        message: 'Internal server error',
        error: 'INTERNAL_ERROR'
      });
    }
  },

  async getUserByEmail(call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>): Promise<void> {
    try {
      const email = call.request.email;
      const user = await UserService.findByEmail(email);

      if (!user) {
        callback(null, {
          success: false,
          message: 'User not found',
          error: 'USER_NOT_FOUND'
        });
        return;
      }

      callback(null, {
        success: true,
        user: convertUserToGrpcFormat(user),
        message: 'User retrieved successfully'
      });
    } catch (error: any) {
      callback(null, {
        success: false,
        message: 'Internal server error',
        error: 'INTERNAL_ERROR'
      });
    }
  },

  async updateUser(call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>): Promise<void> {
    try {
      const userId = call.request.id;
      // The updateUser method is not fully implemented in the service yet
      // For now, return a not implemented response
      callback(null, {
        success: false,
        message: 'Update user is not implemented yet',
        error: 'NOT_IMPLEMENTED'
      });
    } catch (error: any) {
      callback(null, {
        success: false,
        message: 'Internal server error',
        error: 'INTERNAL_ERROR'
      });
    }
  },

  async deleteUser(call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>): Promise<void> {
    try {
      const userId = call.request.id;
      // The deleteUser method is not fully implemented in the service yet
      // For now, return a not implemented response
      callback(null, {
        success: false,
        message: 'Delete user is not implemented yet',
        error: 'NOT_IMPLEMENTED'
      });
    } catch (error: any) {
      callback(null, {
        success: false,
        message: 'Internal server error',
        error: 'INTERNAL_ERROR'
      });
    }
  }
});

// Helper function to convert user object to gRPC format
const convertUserToGrpcFormat = (user: IUser): any => {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    location: user.location || '',
    experience: user.experience || 0,
    skills: user.skills || [],
    preferences: user.preferences ? {
      location: user.preferences.location || '',
      remote: user.preferences.remote || false,
      jobTypes: user.preferences.jobTypes || [],
      salary: user.preferences.salary || 0
    } : null,
    createdAt: user.createdAt?.toISOString() || '',
    updatedAt: user.updatedAt?.toISOString() || ''
  };
};

// Function to start the gRPC server
export function startGrpcServer(port: number = 50051): grpc.Server {
  // Create a new gRPC server
  const server = new grpc.Server();

  // Get the service implementation
  const serviceImpl = createGrpcUserServiceImpl();

  // Add the service to the server
  server.addService(userProto.UserService.service, serviceImpl);

  // Bind the server to the specified port
  server.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure(), (err, port) => {
    if (err) {
      console.error('Error starting gRPC server:', err);
      process.exit(1);
    }
    console.log(`gRPC User Service server running on port ${port}`);
  });

  return server;
}