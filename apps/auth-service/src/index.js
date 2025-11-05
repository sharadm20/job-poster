"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// apps/auth-service/src/index.ts
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const auth_1 = __importDefault(require("./routes/auth"));
const database_1 = require("@ai-job-applier/database");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Routes
app.use('/api/auth', auth_1.default);
// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        status: 'OK',
        timestamp: new Date().toISOString(),
        service: 'auth-service'
    });
});
// Connect to MongoDB and start server
(0, database_1.connectDB)().then(() => {
    app.listen(PORT, () => {
        console.log(`Auth Service is running on port ${PORT}`);
    });
}).catch(error => {
    console.error('Failed to start Auth Service:', error);
    process.exit(1);
});
exports.default = app;
