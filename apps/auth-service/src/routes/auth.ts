// apps/auth-service/src/routes/auth.ts
import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';

const router = Router();
const authController = new AuthController();

// User registration
router.post('/register', (req, res) => authController.register(req, res));

// User login
router.post('/login', (req, res) => authController.login(req, res));

// Token verification
router.get('/verify', (req, res) => authController.verifyToken(req, res));

export default router;