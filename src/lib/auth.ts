import type { NextRequest } from "next/server";

export const ADMIN_COOKIE_NAME = "pokky_admin_token";
export const ADMIN_SECRET_TOKEN = process.env.ADMIN_SESSION_SECRET || "pokky_admin_session_auth_sec_2026";
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "pgm2551dd";

/**
 * Constant-time string comparison that runs in constant time
 * regardless of content or matching prefixes, preventing timing side-channel attacks.
 * Compatible with Edge Runtime and standard Node.js.
 */
export function timingSafeCompare(a: string, b: string): boolean {
  if (typeof a !== "string" || typeof b !== "string") return false;

  let mismatch = a.length === b.length ? 0 : 1;
  const len = Math.max(a.length, b.length);
  for (let i = 0; i < len; i++) {
    const charA = i < a.length ? a.charCodeAt(i) : 0;
    const charB = i < b.length ? b.charCodeAt(i) : 0;
    mismatch |= charA ^ charB;
  }
  return mismatch === 0;
}

function toHex(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let hex = "";
  for (let i = 0; i < bytes.length; i++) {
    hex += bytes[i].toString(16).padStart(2, "0");
  }
  return hex;
}

export async function sha256Hex(message: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return toHex(hashBuffer);
}

export async function hmacSha256(message: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const messageData = encoder.encode(message);

  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signatureBuffer = await crypto.subtle.sign("HMAC", cryptoKey, messageData);
  return toHex(signatureBuffer);
}

/**
 * Create a cryptographically signed dynamic session token
 * Format: <timestamp>.<nonce>.<ipHash>.<signature>
 */
export async function createSessionToken(clientIp: string = ""): Promise<string> {
  const timestamp = Date.now().toString();
  const randomBytes = new Uint8Array(16);
  crypto.getRandomValues(randomBytes);
  const nonce = Array.from(randomBytes).map((b) => b.toString(16).padStart(2, "0")).join("");
  const ipHash = (await sha256Hex(clientIp || "unknown")).slice(0, 16);

  const payload = `${timestamp}.${nonce}.${ipHash}`;
  const signature = await hmacSha256(payload, ADMIN_SECRET_TOKEN);

  return `${payload}.${signature}`;
}

/**
 * Verify a cryptographic session token
 * Returns true if valid and within 7-day lifespan.
 */
export async function verifySessionToken(token: string | undefined | null, clientIp?: string): Promise<boolean> {
  if (!token || typeof token !== "string") return false;

  // Backwards compatibility with static token via constant-time compare
  if (timingSafeCompare(token, ADMIN_SECRET_TOKEN)) {
    return true;
  }

  const parts = token.split(".");
  if (parts.length !== 4) return false;

  const [timestampStr, nonce, ipHash, signature] = parts;
  const timestamp = parseInt(timestampStr, 10);
  if (isNaN(timestamp)) return false;

  // Expiration check: 7 days
  const maxAgeMs = 7 * 24 * 60 * 60 * 1000;
  if (Date.now() - timestamp > maxAgeMs || timestamp > Date.now() + 60000) {
    return false;
  }

  const payload = `${timestampStr}.${nonce}.${ipHash}`;
  const expectedSig = await hmacSha256(payload, ADMIN_SECRET_TOKEN);

  if (!timingSafeCompare(signature, expectedSig)) {
    return false;
  }

  if (clientIp) {
    const expectedIpHash = (await sha256Hex(clientIp)).slice(0, 16);
    if (!timingSafeCompare(ipHash, expectedIpHash)) {
      return false;
    }
  }

  return true;
}

/**
 * Check if incoming NextRequest is authenticated by an active admin session
 */
export async function isAuthenticatedRequest(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value || request.headers.get("x-admin-token");
  const forwarded = request.headers.get("x-forwarded-for");
  const clientIp = forwarded ? forwarded.split(",")[0].trim() : request.headers.get("x-real-ip") || "";
  return verifySessionToken(token, clientIp);
}
