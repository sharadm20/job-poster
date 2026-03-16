// apps/auth-service/tests/setup.ts
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { connectDB, disconnectDB } from '@ai-job-applier/database';

let mongoServer: MongoMemoryServer;

export const connect = async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  
  await mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: 30000,
    maxPoolSize: 10,
    bufferCommands: false
  });
};

export const clearDatabase = async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
};

export const closeDatabase = async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
};
