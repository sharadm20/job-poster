import mongoose from 'mongoose';
import { IUser, IJob } from '@ai-job-applier/types';
export declare const User: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser> & IUser & {
    _id: mongoose.Types.ObjectId;
}, any>;
export declare const Job: mongoose.Model<IJob, {}, {}, {}, mongoose.Document<unknown, {}, IJob> & IJob & {
    _id: mongoose.Types.ObjectId;
}, any>;
export declare function connectDB(): Promise<void>;
export declare function disconnectDB(): Promise<void>;
//# sourceMappingURL=index.d.ts.map