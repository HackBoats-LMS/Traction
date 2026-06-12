export class AtlasCache<T> {
  private cache: Map<string, { data: T; expiresAt: number }> = new Map();
  private ttlMs: number;

  constructor(ttlMs: number = 30000) { // default 30 seconds
    this.ttlMs = ttlMs;
  }

  get(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;
    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    return item.data;
  }

  set(key: string, data: T, customTtlMs?: number): void {
    const expiresAt = Date.now() + (customTtlMs || this.ttlMs);
    this.cache.set(key, { data, expiresAt });
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }
}

// Global instances for API routes
export const geocodingCache = new AtlasCache<any>(1000 * 60 * 60 * 24); // 24 hours for geocoding
export const membersCache = new AtlasCache<any>(1000 * 30); // 30 seconds for atlas members
