import type { Cache } from "./cache.interface.js";
import { NodeCache } from "./node-cache.js";

export const cacheInstance: Cache = new NodeCache();
