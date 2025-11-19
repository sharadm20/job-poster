import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';

// Define the path to the proto files
const PROTO_PATH = path.join(__dirname, '../../shared/proto');

// Options for loading the proto files
const packageDefinitionOptions: protoLoader.Options = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
};

// Function to create a gRPC client for a specific service
export function createGrpcClient(serviceName: string, protoFileName: string, port: number) {
  // Load the proto file
  const packageDefinition = protoLoader.loadSync(
    path.join(PROTO_PATH, protoFileName),
    packageDefinitionOptions
  );
  
  // Load the proto object
  const protoObject = grpc.loadPackageDefinition(packageDefinition);
  
  // Extract the service from the proto object
  // The structure is protoObject[packageName][serviceName]
  const [packageName] = protoFileName.split('.');
  const service = (protoObject as any)[packageName][serviceName];
  
  // Create the client
  const client = new service(
    `localhost:${port}`,
    grpc.credentials.createInsecure()
  );
  
  return client;
}

// Specific client creation functions for each service
export function createUserClient(port: number = 50051) {
  return createGrpcClient('UserService', 'user.proto', port);
}

export function createAuthClient(port: number = 50052) {
  return createGrpcClient('AuthService', 'auth.proto', port);
}

export function createJobClient(port: number = 50053) {
  return createGrpcClient('JobService', 'job.proto', port);
}