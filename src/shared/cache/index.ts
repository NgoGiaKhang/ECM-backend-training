import type { Cache } from "./cache.interface.js";
import { InMemoryCache } from "./node-cache.js";

export const cacheInstance: Cache = new InMemoryCache();
