"use strict";
// packages/utils/src/index.ts
// Utility functions
Object.defineProperty(exports, "__esModule", { value: true });
exports.delay = exports.isValidUrl = exports.generateRandomString = exports.verifyPassword = exports.hashPassword = exports.sanitizeInput = exports.validateEmail = void 0;
const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};
exports.validateEmail = validateEmail;
const sanitizeInput = (input) => {
    return input.trim().replace(/<[^>]*>/g, '');
};
exports.sanitizeInput = sanitizeInput;
const hashPassword = async (password) => {
    // In a real implementation, use bcrypt or similar
    // For now, return a simple "hash" for the refactor
    return `hashed_${password}_${Date.now()}`;
};
exports.hashPassword = hashPassword;
const verifyPassword = async (password, hash) => {
    // In a real implementation, use bcrypt.compare or similar
    return hash === `hashed_${password}_${hash.split('_')[2]}`;
};
exports.verifyPassword = verifyPassword;
const generateRandomString = (length) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};
exports.generateRandomString = generateRandomString;
const isValidUrl = (url) => {
    try {
        new URL(url);
        return true;
    }
    catch {
        return false;
    }
};
exports.isValidUrl = isValidUrl;
const delay = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};
exports.delay = delay;
