// src/entities/user.ts

export interface User {
  id: string;
  name: string;
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

export interface UserRegistrationData extends UserCredentials {
  name: string;
}