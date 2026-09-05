import { NextRequest } from "next/server";
import { DiscordUser } from "@/types";

export const USER_COOKIE_NAME = "pokky_user_session";
const SESSION_SECRET = process.env.USER_SESSION_SECRET || process.env.ADMIN_SESSION_SECRET || "pokky_user_oauth_secret_key_2026";
const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID || "";
const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET || "";

// Constant-time comparison
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

async function hmacSign(data: string, secret: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, enc.encode(data));
  const bytes = new Uint8Array(signature);
  let hex = "";
  for (let i = 0; i < bytes.length; i++) {
    hex += bytes[i].toString(16).padStart(2, "0");
  }
  return hex;
}

export function isDiscordConfigured(): boolean {
  return Boolean(DISCORD_CLIENT_ID && DISCORD_CLIENT_SECRET);
}

export function getDiscordOAuthUrl(redirectUri: string, state: string = "pokky_auth"): string {
  if (!DISCORD_CLIENT_ID) {
    return "";
  }
  const params = new URLSearchParams({
    client_id: DISCORD_CLIENT_ID,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "identify email",
    state,
    prompt: "consent",
  });
  return `https://discord.com/api/oauth2/authorize?${params.toString()}`;
}

export function getDiscordAvatarUrl(userId: string, avatarHash?: string | null): string {
  if (avatarHash) {
    const isAnimated = avatarHash.startsWith("a_");
    return `https://cdn.discordapp.com/avatars/${userId}/${avatarHash}.${isAnimated ? "gif" : "png"}?size=128`;
  }
  // Default Discord avatar based on user ID mod 5
  const index = Number(BigInt(userId || "0") % 5n);
  return `https://cdn.discordapp.com/embed/avatars/${index}.png`;
}

export async function exchangeDiscordCode(code: string, redirectUri: string): Promise<string | null> {
  if (!DISCORD_CLIENT_ID || !DISCORD_CLIENT_SECRET) return null;

  const params = new URLSearchParams({
    client_id: DISCORD_CLIENT_ID,
    client_secret: DISCORD_CLIENT_SECRET,
    grant_type: "authorization_code",
    code,
    redirect_uri: redirectUri,
  });

  try {
    const resp = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    });

    if (!resp.ok) return null;
    const data = await resp.json();
    return data.access_token || null;
  } catch {
    return null;
  }
}

export async function fetchDiscordUserProfile(accessToken: string): Promise<DiscordUser | null> {
  try {
    const resp = await fetch("https://discord.com/api/users/@me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!resp.ok) return null;
    const data = await resp.json();
    const avatarUrl = getDiscordAvatarUrl(data.id, data.avatar);

    return {
      id: data.id,
      username: data.username,
      globalName: data.global_name || data.username,
      avatar: data.avatar || undefined,
      avatarUrl,
      email: data.email || undefined,
      role: "user",
    };
  } catch {
    return null;
  }
}

export async function createSignedUserToken(user: DiscordUser): Promise<string> {
  const payload = JSON.stringify({
    ...user,
    exp: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days
  });
  const encodedPayload = Buffer.from(payload, "utf-8").toString("base64url");
  const signature = await hmacSign(encodedPayload, SESSION_SECRET);
  return `${encodedPayload}.${signature}`;
}

export async function verifySignedUserToken(token: string): Promise<DiscordUser | null> {
  if (!token || typeof token !== "string") return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;

  const [encodedPayload, signature] = parts;
  const expectedSig = await hmacSign(encodedPayload, SESSION_SECRET);
  if (!timingSafeEqual(signature, expectedSig)) return null;

  try {
    const raw = Buffer.from(encodedPayload, "base64url").toString("utf-8");
    const user = JSON.parse(raw);
    if (!user || !user.id || !user.username) return null;
    if (user.exp && user.exp < Date.now()) return null; // expired
    return user as DiscordUser;
  } catch {
    return null;
  }
}

export async function getAuthenticatedUser(request: NextRequest): Promise<DiscordUser | null> {
  const cookie = request.cookies.get(USER_COOKIE_NAME);
  if (!cookie || !cookie.value) return null;
  return verifySignedUserToken(cookie.value);
}
