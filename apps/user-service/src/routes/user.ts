// apps/user-service/src/routes/user.ts
import { Router } from 'express';
import { UserController } from '../controllers/UserController';

const router = Router();

// User registration
router.post('/register', UserController.createUser);

// Get user by ID
router.get('/:id', UserController.getUserById);

// Get user by email (alternative endpoint)
router.get('/email/:email', UserController.getUserByEmail);

// Update user
router.put('/:id', UserController.updateUser);

// Delete user
router.delete('/:id', UserController.deleteUser);

export default router;