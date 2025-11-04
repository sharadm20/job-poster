// packages/utils/src/index.ts
// Utility functions

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/<[^>]*>/g, '');
};

export const hashPassword = async (password: string): Promise<string> => {
  // In a real implementation, use bcrypt or similar
  // For now, return a simple "hash" for the refactor
  return `hashed_${password}_${Date.now()}`;
};

export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  // In a real implementation, use bcrypt.compare or similar
  return hash === `hashed_${password}_${hash.split('_')[2]}`;
};

export const generateRandomString = (length: number): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};