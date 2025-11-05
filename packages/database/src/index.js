"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Job = exports.User = void 0;
exports.connectDB = connectDB;
exports.disconnectDB = disconnectDB;
// packages/database/src/index.ts
const mongoose_1 = __importDefault(require("mongoose"));
// User schema and model
const UserSchema = new mongoose_1.default.Schema({
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
UserSchema.virtual('id').get(function () {
    return this._id.toHexString();
});
UserSchema.set('toJSON', {
    virtuals: true,
    transform: function (doc, ret) {
        delete ret._id;
        delete ret.__v;
        return ret;
    }
});
exports.User = mongoose_1.default.model('User', UserSchema);
// Job schema and model
const JobSchema = new mongoose_1.default.Schema({
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
JobSchema.virtual('id').get(function () {
    return this._id.toHexString();
});
JobSchema.set('toJSON', {
    virtuals: true,
    transform: function (doc, ret) {
        delete ret._id;
        delete ret.__v;
        return ret;
    }
});
exports.Job = mongoose_1.default.model('Job', JobSchema);
async function connectDB() {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-job-applier';
    try {
        await mongoose_1.default.connect(uri);
        console.log('Connected to MongoDB');
    }
    catch (error) {
        console.error('Database connection error:', error);
        process.exit(1);
    }
}
async function disconnectDB() {
    await mongoose_1.default.disconnect();
}
