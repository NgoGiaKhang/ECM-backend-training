export interface Cache {
  get<T>(key: string): Promise<T | null>;

  set<T>(key: string, value: T, ttlSeconds?: number): Promise<void>;

  delete(key: string): Promise<void>;

  clear(): Promise<void>;

  setIfNotExists<T>(
    key: string,
    value: T,
    ttlSeconds?: number,
  ): Promise<boolean>;
}
