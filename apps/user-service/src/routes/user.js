"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// apps/user-service/src/routes/user.ts
const express_1 = require("express");
const UserController_1 = require("../controllers/UserController");
const router = (0, express_1.Router)();
// User registration
router.post('/register', UserController_1.UserController.createUser);
// Get user by ID
router.get('/:id', UserController_1.UserController.getUserById);
// Get user by email (alternative endpoint)
router.get('/email/:email', UserController_1.UserController.getUserByEmail);
// Update user
router.put('/:id', UserController_1.UserController.updateUser);
// Delete user
router.delete('/:id', UserController_1.UserController.deleteUser);
exports.default = router;
