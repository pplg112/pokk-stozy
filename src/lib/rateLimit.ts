import { NextRequest } from "next/server";

interface RateLimitRecord {
  count: number;
  resetTime: number;
  lockedUntil?: number;
}

// In-memory rate limiting cache
const adminAuthStore = new Map<string, RateLimitRecord>();
const reviewStore = new Map<string, RateLimitRecord>();
const downloadStore = new Map<string, RateLimitRecord>();

// Periodic cleanup to avoid memory leak
function cleanStore(store: Map<string, RateLimitRecord>) {
  const now = Date.now();
  for (const [key, val] of store.entries()) {
    if (val.resetTime < now && (!val.lockedUntil || val.lockedUntil < now)) {
      store.delete(key);
    }
  }
}

setInterval(() => {
  cleanStore(adminAuthStore);
  cleanStore(reviewStore);
  cleanStore(downloadStore);
}, 60000);

export function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }
  return "127.0.0.1";
}

/**
 * Admin Login Brute-Force Protection
 * Rule: Max 5 failed attempts per 15 minutes. Lockout for 15 minutes.
 */
export function checkAdminBruteForce(ip: string): { allowed: boolean; remainingAttempts: number; lockoutSeconds?: number } {
  const now = Date.now();
  const record = adminAuthStore.get(ip);

  if (record && record.lockedUntil && record.lockedUntil > now) {
    const lockoutSeconds = Math.ceil((record.lockedUntil - now) / 1000);
    return { allowed: false, remainingAttempts: 0, lockoutSeconds };
  }

  const attempts = record && record.resetTime > now ? record.count : 0;
  const remaining = Math.max(0, 5 - attempts);
  return { allowed: true, remainingAttempts: remaining };
}

export function recordAdminAuthAttempt(ip: string, success: boolean): void {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes

  if (success) {
    adminAuthStore.delete(ip);
    return;
  }

  let record = adminAuthStore.get(ip);
  if (!record || record.resetTime <= now) {
    record = { count: 1, resetTime: now + windowMs };
  } else {
    record.count += 1;
  }

  // If 5 failed attempts reached, lock out for 15 minutes
  if (record.count >= 5) {
    record.lockedUntil = now + windowMs;
  }

  adminAuthStore.set(ip, record);
}

/**
 * Review Spam Rate Limiting
 * Rule: Max 2 reviews per 60 seconds per IP
 */
export function checkReviewRateLimit(ip: string): { allowed: boolean; retryAfterSeconds?: number } {
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const maxLimit = 2;

  let record = reviewStore.get(ip);
  if (!record || record.resetTime <= now) {
    reviewStore.set(ip, { count: 1, resetTime: now + windowMs });
    return { allowed: true };
  }

  if (record.count >= maxLimit) {
    const retryAfterSeconds = Math.ceil((record.resetTime - now) / 1000);
    return { allowed: false, retryAfterSeconds };
  }

  record.count += 1;
  reviewStore.set(ip, record);
  return { allowed: true };
}

/**
 * Download Flood Rate Limiting
 * Rule: Max 15 download requests per 60 seconds per IP
 */
export function checkDownloadRateLimit(ip: string): { allowed: boolean; retryAfterSeconds?: number } {
  const now = Date.now();
  const windowMs = 60 * 1000;
  const maxLimit = 15;

  let record = downloadStore.get(ip);
  if (!record || record.resetTime <= now) {
    downloadStore.set(ip, { count: 1, resetTime: now + windowMs });
    return { allowed: true };
  }

  if (record.count >= maxLimit) {
    const retryAfterSeconds = Math.ceil((record.resetTime - now) / 1000);
    return { allowed: false, retryAfterSeconds };
  }

  record.count += 1;
  downloadStore.set(ip, record);
  return { allowed: true };
}
