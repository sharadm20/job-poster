import { createClient, RedisClientType } from 'redis';
import { ICacheService } from './interfaces';

// Cache service implementation using Redis
export class RedisCacheService implements ICacheService {
  private client: RedisClientType | null = null;
  private static instance: RedisCacheService;
  
  private constructor() {}

  public static getInstance(): RedisCacheService {
    if (!RedisCacheService.instance) {
      RedisCacheService.instance = new RedisCacheService();
    }
    return RedisCacheService.instance;
  }

  // Connect to Redis
  async connect(): Promise<void> {
    try {
      // Use Redis URL from environment or default to localhost
      const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
      
      this.client = createClient({
        url: redisUrl
      });

      // Add error handling
      this.client.on('error', (err) => {
        console.error('Redis Client Error:', err);
      });

      await this.client.connect();
      console.log('Connected to Redis successfully');
    } catch (error) {
      console.error('Failed to connect to Redis:', error);
      throw error;
    }
  }

  // Disconnect from Redis
  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.disconnect();
      console.log('Disconnected from Redis');
    }
  }

  // Get a value from cache
  async get<T>(key: string): Promise<T | null> {
    if (!this.client) {
      throw new Error('Redis client not initialized');
    }

    try {
      const value = await this.client.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error(`Error getting key ${key} from cache:`, error);
      return null;
    }
  }

  // Set a value in cache
  async set<T>(key: string, value: T, ttl?: number): Promise<boolean> {
    if (!this.client) {
      throw new Error('Redis client not initialized');
    }

    try {
      const serializedValue = JSON.stringify(value);
      
      if (ttl) {
        await this.client.set(key, serializedValue, { EX: ttl });
      } else {
        await this.client.set(key, serializedValue);
      }
      
      return true;
    } catch (error) {
      console.error(`Error setting key ${key} in cache:`, error);
      return false;
    }
  }

  // Delete a value from cache
  async delete(key: string): Promise<boolean> {
    if (!this.client) {
      throw new Error('Redis client not initialized');
    }

    try {
      const deleted = await this.client.del(key);
      return deleted > 0;
    } catch (error) {
      console.error(`Error deleting key ${key} from cache:`, error);
      return false;
    }
  }

  // Check if a key exists in cache
  async exists(key: string): Promise<boolean> {
    if (!this.client) {
      throw new Error('Redis client not initialized');
    }

    try {
      const exists = await this.client.exists(key);
      return exists === 1;
    } catch (error) {
      console.error(`Error checking existence of key ${key}:`, error);
      return false;
    }
  }

  // Clear all keys in cache
  async clear(): Promise<boolean> {
    if (!this.client) {
      throw new Error('Redis client not initialized');
    }

    try {
      await this.client.flushAll();
      return true;
    } catch (error) {
      console.error('Error clearing cache:', error);
      return false;
    }
  }

  // Get all keys matching a pattern
  async getKeys(pattern: string = '*'): Promise<string[]> {
    if (!this.client) {
      throw new Error('Redis client not initialized');
    }

    try {
      return await this.client.keys(pattern);
    } catch (error) {
      console.error(`Error getting keys with pattern ${pattern}:`, error);
      return [];
    }
  }
}

// Export a singleton instance
export const cacheService = RedisCacheService.getInstance();