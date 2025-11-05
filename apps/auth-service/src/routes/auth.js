"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// apps/auth-service/src/routes/auth.ts
const express_1 = require("express");
const AuthController_1 = require("../controllers/AuthController");
const router = (0, express_1.Router)();
const authController = new AuthController_1.AuthController();
// User registration
router.post('/register', (req, res) => authController.register(req, res));
// User login
router.post('/login', (req, res) => authController.login(req, res));
// Token verification
router.get('/verify', (req, res) => authController.verifyToken(req, res));
exports.default = router;
