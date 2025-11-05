"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
// apps/user-service/src/services/UserService.ts
const database_1 = require("@ai-job-applier/database");
const utils_1 = require("@ai-job-applier/utils");
const joi_1 = __importDefault(require("joi"));
const shared_1 = require("@ai-job-applier/shared");
// Define the validation schema for user input
const userValidationSchema = joi_1.default.object({
    firstName: joi_1.default.string().max(50).required(),
    lastName: joi_1.default.string().max(50).required(),
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().min(8).max(128).required(),
    location: joi_1.default.string().optional(),
    experience: joi_1.default.number().min(0).optional(),
    skills: joi_1.default.array().items(joi_1.default.string()).optional(),
    preferences: joi_1.default.object({
        location: joi_1.default.string().optional(),
        remote: joi_1.default.boolean().optional(),
        jobTypes: joi_1.default.array().items(joi_1.default.string()).optional(),
        salary: joi_1.default.number().optional()
    }).optional()
});
class UserService {
    /**
     * Create a new user
     * @param userData - The user data to create
     * @returns The created user (without password)
     */
    static async createUser(userData) {
        // Validate input data
        const { error } = userValidationSchema.validate(userData);
        if (error) {
            throw new Error(`${shared_1.ERROR_MESSAGES.VALIDATION_ERROR}: ${error.details[0].message}`);
        }
        // Check if user already exists
        const existingUser = await database_1.User.findOne({ email: userData.email });
        if (existingUser) {
            throw new Error(shared_1.ERROR_MESSAGES.EMAIL_EXISTS);
        }
        // Hash the password
        const hashedPassword = await (0, utils_1.hashPassword)(userData.password);
        // Create the user object with hashed password
        const userObject = {
            ...userData,
            password: hashedPassword
        };
        // Create and save the user
        const user = new database_1.User(userObject);
        const savedUser = await user.save();
        // Return user without password
        const userObjectWithoutPassword = savedUser.toJSON();
        delete userObjectWithoutPassword.password;
        return userObjectWithoutPassword;
    }
    /**
     * Find a user by email
     * @param email - The email to search for
     * @returns The user or null if not found
     */
    static async findByEmail(email) {
        const user = await database_1.User.findOne({ email });
        if (!user) {
            return null;
        }
        // Return user without password
        const userObject = user.toJSON();
        delete userObject.password;
        return userObject;
    }
    /**
     * Find a user by ID
     * @param id - The ID to search for
     * @returns The user or null if not found
     */
    static async findById(id) {
        const user = await database_1.User.findById(id);
        if (!user) {
            return null;
        }
        // Return user without password
        const userObject = user.toJSON();
        delete userObject.password;
        return userObject;
    }
}
exports.UserService = UserService;
