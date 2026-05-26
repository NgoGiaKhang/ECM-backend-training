import NodeCacheLib from "node-cache";
import type { Cache } from "./cache.interface.js";

export class NodeCache implements Cache {
  private cache = new NodeCacheLib();

  async get<T>(key: string): Promise<T | null> {
    const value = this.cache.get<T>(key);

    return value ?? null;
  }

  async set<T>(key: string, value: T, ttlSeconds = 60): Promise<void> {
    this.cache.set(key, value, ttlSeconds);
  }

  async setIfNotExists<T>(
    key: string,
    value: T,
    ttlSeconds = 60,
  ): Promise<boolean> {
    const exists = this.cache.has(key);

    if (!exists) {
      this.cache.set(key, value, ttlSeconds);
    }

    return !exists;
  }

  async delete(key: string): Promise<void> {
    this.cache.del(key);
  }

  async clear(): Promise<void> {
    this.cache.flushAll();
  }
}
