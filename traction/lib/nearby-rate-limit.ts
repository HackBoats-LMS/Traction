export class RateLimiter {
  private cache: Map<string, { count: number; resetTime: number }>;
  private limit: number;
  private windowMs: number;

  constructor(options: { limit?: number; windowMs?: number } = {}) {
    this.cache = new Map();
    this.limit = options.limit || 60; // default 60 requests
    this.windowMs = options.windowMs || 60 * 1000; // default 1 minute
  }

  public check(ip: string): { success: boolean; limit: number; remaining: number; reset: number } {
    const now = Date.now();
    const record = this.cache.get(ip);

    if (!record) {
      this.cache.set(ip, { count: 1, resetTime: now + this.windowMs });
      return { success: true, limit: this.limit, remaining: this.limit - 1, reset: now + this.windowMs };
    }

    if (now > record.resetTime) {
      // Window expired, reset
      record.count = 1;
      record.resetTime = now + this.windowMs;
      return { success: true, limit: this.limit, remaining: this.limit - 1, reset: record.resetTime };
    }

    record.count += 1;

    if (record.count > this.limit) {
      return { success: false, limit: this.limit, remaining: 0, reset: record.resetTime };
    }

    return { success: true, limit: this.limit, remaining: this.limit - record.count, reset: record.resetTime };
  }
}

// Global instance for the application
export const apiRateLimiter = new RateLimiter({ limit: 100, windowMs: 60 * 1000 }); // 100 requests per minute
