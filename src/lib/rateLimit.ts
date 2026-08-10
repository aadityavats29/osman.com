import "server-only";

/**
 * Minimal in-memory rate limiter (per key, sliding window).
 * Suitable for a single-instance deployment; swap for a Redis/Upstash-backed
 * implementation behind the same function signature when scaling out.
 */

const g = globalThis as typeof globalThis & {
  __osmanRate?: Map<string, number[]>;
};

export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  if (!g.__osmanRate) g.__osmanRate = new Map();
  const now = Date.now();
  const hits = (g.__osmanRate.get(key) ?? []).filter((t) => now - t < windowMs);
  if (hits.length >= limit) {
    g.__osmanRate.set(key, hits);
    return false;
  }
  hits.push(now);
  g.__osmanRate.set(key, hits);
  return true;
}
