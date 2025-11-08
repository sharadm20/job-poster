// packages/database/src/index.ts
import mongoose from 'mongoose';
import { IUser, IJob } from '@ai-job-applier/types';

// User schema and model
const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  location: String,
  experience: Number,
  skills: [String],
  preferences: {
    location: String,
    remote: Boolean,
    jobTypes: [String],
    salary: Number
  }
}, { timestamps: true });

UserSchema.virtual('id').get(function() {
  return (this._id as mongoose.Types.ObjectId).toHexString();
});

UserSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

export const User = mongoose.model<IUser>('User', UserSchema);

// Job schema and model
const JobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  postedDate: { type: Date, required: true },
  url: { type: String, required: true },
  source: { type: String, required: true },
  remote: { type: Boolean, default: false },
  salary: String,
  jobType: String,
  experienceLevel: String,
  skills: [String],
  benefits: [String],
  applicationStatus: { 
    type: String, 
    enum: ['not-applied', 'applied', 'interview', 'rejected', 'offered'],
    default: 'not-applied'
  },
  userId: String
}, { timestamps: true });

JobSchema.virtual('id').get(function() {
  return (this._id as mongoose.Types.ObjectId).toHexString();
});

JobSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

export const Job = mongoose.model<IJob>('Job', JobSchema);

export async function connectDB(): Promise<void> {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-job-applier';
  
  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 30000, // 30 seconds to select the server
      socketTimeoutMS: 45000,          // 45 seconds of inactivity before closing the connection
      maxPoolSize: 10,                 // Maintain up to 10 socket connections
      bufferCommands: false            // Disable mongoose buffering
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
}

export async function disconnectDB(): Promise<void> {
  await mongoose.disconnect();
}