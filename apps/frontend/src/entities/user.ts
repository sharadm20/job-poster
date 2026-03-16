// src/entities/user.ts

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  bio?: string;
  skills?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface UserCredentials {
  email: string;
  password: string;
}

export interface UserRegistrationData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}