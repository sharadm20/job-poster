"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// apps/api-gateway/src/index.ts
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const http_proxy_middleware_1 = require("http-proxy-middleware");
const auth_middleware_1 = require("./middlewares/auth.middleware");
const shared_1 = require("@ai-job-applier/shared");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 8080;
// Environment variables for service URLs
// In Docker, services are accessible by their service names
const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://user-service:3000';
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://auth-service:3000';
const JOB_DISCOVERY_SERVICE_URL = process.env.JOB_DISCOVERY_SERVICE_URL || 'http://job-discovery-service:3000';
// Middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Health check endpoint
app.get('/health', (req, res) => {
    res.status(shared_1.HTTP_STATUS.OK).json({
        success: true,
        status: 'OK',
        timestamp: new Date().toISOString(),
        services: {
            user: USER_SERVICE_URL,
            auth: AUTH_SERVICE_URL,
            jobDiscovery: JOB_DISCOVERY_SERVICE_URL
        }
    });
});
// Proxy middleware for user service
app.use('/api/users', (0, http_proxy_middleware_1.createProxyMiddleware)({
    target: USER_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
        '^/api': '', // Remove the /api prefix when forwarding to service
    },
}));
// Proxy middleware for auth service
app.use('/api/auth', (0, http_proxy_middleware_1.createProxyMiddleware)({
    target: AUTH_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
        '^/api': '', // Remove the /api prefix when forwarding to service
    },
}));
// Proxy middleware for job discovery service
// Only authenticated users can access job endpoints
app.use('/api/jobs', auth_middleware_1.authMiddleware, (0, http_proxy_middleware_1.createProxyMiddleware)({
    target: JOB_DISCOVERY_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
        '^/api': '', // Remove the /api prefix when forwarding to service
    },
}));
// Catch-all route for any other endpoints
app.all('*', (req, res) => {
    res.status(shared_1.HTTP_STATUS.NOT_FOUND).json({
        success: false,
        error: 'Route not found',
        message: `The route ${req.method} ${req.url} was not found`
    });
});
app.listen(PORT, () => {
    console.log(`API Gateway is running on port ${PORT}`);
    console.log(`User Service Proxy: ${USER_SERVICE_URL}`);
    console.log(`Auth Service Proxy: ${AUTH_SERVICE_URL}`);
    console.log(`Job Discovery Service Proxy: ${JOB_DISCOVERY_SERVICE_URL}`);
});
exports.default = app;
