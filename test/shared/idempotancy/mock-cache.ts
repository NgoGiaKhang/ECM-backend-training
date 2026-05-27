import { Cache } from "@/shared/cache/cache.interface.js";

export class MockCache implements Cache {
  private store = new Map<string, any>();

  async get<T>(key: string): Promise<T | null> {
    return (this.store.get(key) ?? null) as T;
  }

  async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    this.store.set(key, value);

    // optional TTL simulation (basic)
    if (ttlSeconds) {
      setTimeout(() => {
        this.store.delete(key);
      }, ttlSeconds * 1000);
    }
  }

  async setIfNotExists<T>(
    key: string,
    value: T,
    ttlSeconds?: number,
  ): Promise<boolean> {
    if (this.store.has(key)) {
      return false;
    }

    this.store.set(key, value);

    if (ttlSeconds) {
      setTimeout(() => {
        this.store.delete(key);
      }, ttlSeconds * 1000);
    }

    return true;
  }

  async delete(key: string): Promise<void> {
    this.store.delete(key);
  }

  async clear(): Promise<void> {
    this.store.clear();
  }
}
