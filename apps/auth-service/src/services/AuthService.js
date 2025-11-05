"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
// apps/auth-service/src/services/AuthService.ts
const database_1 = require("@ai-job-applier/database");
const utils_1 = require("@ai-job-applier/utils");
const auth_1 = require("@ai-job-applier/auth");
const joi_1 = __importDefault(require("joi"));
const shared_1 = require("@ai-job-applier/shared");
// Define the validation schema for registration
const registerValidationSchema = joi_1.default.object({
    firstName: joi_1.default.string().max(50).required(),
    lastName: joi_1.default.string().max(50).required(),
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().min(8).max(128).required()
});
// Define the validation schema for login
const loginValidationSchema = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().required()
});
class AuthService {
    constructor() {
        this.jwtAuthService = new auth_1.AuthService();
    }
    /**
     * Register a new user
     * @param userData - The user data to register
     * @returns The created user and JWT token
     */
    async register(userData) {
        // Validate input data
        const { error } = registerValidationSchema.validate(userData);
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
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            password: hashedPassword
        };
        // Create and save the user
        const user = new database_1.User(userObject);
        const savedUser = await user.save();
        // Generate JWT token
        const token = this.jwtAuthService.generateToken(savedUser);
        // Return user without password and the token
        const userObjectWithoutPassword = savedUser.toJSON();
        delete userObjectWithoutPassword.password;
        return { user: userObjectWithoutPassword, token };
    }
    /**
     * Login user with credentials
     * @param credentials - The login credentials (email and password)
     * @returns The user and JWT token if credentials are valid
     */
    async login(credentials) {
        // Validate input data
        const { error } = loginValidationSchema.validate(credentials);
        if (error) {
            throw new Error(`${shared_1.ERROR_MESSAGES.VALIDATION_ERROR}: ${error.details[0].message}`);
        }
        const { email, password } = credentials;
        // Find the user by email
        const user = await database_1.User.findOne({ email });
        if (!user) {
            throw new Error(shared_1.ERROR_MESSAGES.USER_NOT_FOUND);
        }
        // Verify the password
        if (!user.password) {
            throw new Error(shared_1.ERROR_MESSAGES.INVALID_CREDENTIALS);
        }
        const isPasswordValid = await (0, utils_1.verifyPassword)(password, user.password);
        if (!isPasswordValid) {
            throw new Error(shared_1.ERROR_MESSAGES.INVALID_CREDENTIALS);
        }
        // Generate JWT token
        const token = this.jwtAuthService.generateToken(user);
        // Return user without password and the token
        const userObjectWithoutPassword = user.toJSON();
        delete userObjectWithoutPassword.password;
        return { user: userObjectWithoutPassword, token };
    }
}
exports.AuthService = AuthService;
