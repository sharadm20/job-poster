// packages/shared/src/interfaces.ts
// This file contains shared interfaces used across services

// Cache service interface
export interface ICacheService {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttl?: number): Promise<boolean>;
  delete(key: string): Promise<boolean>;
  exists(key: string): Promise<boolean>;
  clear(): Promise<boolean>;
  getKeys(pattern?: string): Promise<string[]>;
}

export interface IBaseService {
  // Base interface for services
}

export interface IBaseController {
  // Base interface for controllers
}