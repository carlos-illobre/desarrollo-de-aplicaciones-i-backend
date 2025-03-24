import { Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.TRANSIENT })
export class InMemoryCache {
  private cache: Map<string, { value: unknown; expiresAt: number }> = new Map();

  // Save a key with a value and TTL (in milliseconds)
  set(key: string, value: unknown, ttl: number): void {
    const expiresAt = Date.now() + ttl;

    // Save the key-value pair with expiration time
    this.cache.set(key, { value, expiresAt });

    // Schedule removal of the key after TTL
    setTimeout(() => {
      this.cache.delete(key);
    }, ttl);
  }

  // Retrieve a key's value if it hasn't expired
  get(key: string): unknown {
    const entry = this.cache.get(key);

    if (!entry) {
      return null; // Key not found
    }

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key); // Key expired, remove it
      return null;
    }

    return entry.value; // Return the value
  }

  // Check if a key exists and hasn't expired
  has(key: string): boolean {
    const entry = this.cache.get(key);

    if (!entry) {
      return false;
    }

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key); // Key expired, remove it
      return false;
    }

    return true;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }
}
