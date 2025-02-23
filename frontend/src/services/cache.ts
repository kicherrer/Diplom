class CacheService {
  private cache = new Map<string, any>();
  private expirationTimes = new Map<string, number>();
  private defaultTTL = 5 * 60 * 1000; // 5 minutes

  set(key: string, value: any, ttl: number = this.defaultTTL) {
    this.cache.set(key, value);
    this.expirationTimes.set(key, Date.now() + ttl);
  }

  get(key: string) {
    if (!this.cache.has(key)) return null;
    if (Date.now() > (this.expirationTimes.get(key) || 0)) {
      this.delete(key);
      return null;
    }
    return this.cache.get(key);
  }

  delete(key: string) {
    this.cache.delete(key);
    this.expirationTimes.delete(key);
  }

  clear() {
    this.cache.clear();
    this.expirationTimes.clear();
  }
}

export const cacheService = new CacheService();
