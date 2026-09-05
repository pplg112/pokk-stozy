import { NextRequest } from "next/server";

// Dynamic In-Memory Ban Jail for offending IPs
interface JailRecord {
  bannedUntil: number;
  reason: string;
}

const ipJail = new Map<string, JailRecord>();

// Cleanup expired bans periodically
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of ipJail.entries()) {
    if (record.bannedUntil <= now) {
      ipJail.delete(ip);
    }
  }
}, 300000); // every 5 minutes

export function isIpBanned(ip: string): { banned: boolean; reason?: string; remainingSeconds?: number } {
  // Loopback / localhost is never banned
  if (ip === "127.0.0.1" || ip === "::1" || ip === "localhost") {
    return { banned: false };
  }

  const record = ipJail.get(ip);
  if (!record) return { banned: false };

  const now = Date.now();
  if (record.bannedUntil > now) {
    const remainingSeconds = Math.ceil((record.bannedUntil - now) / 1000);
    return { banned: true, reason: record.reason, remainingSeconds };
  }

  ipJail.delete(ip);
  return { banned: false };
}

export function jailIp(ip: string, reason: string, durationMs: number = 2 * 60 * 60 * 1000): void {
  if (ip === "127.0.0.1" || ip === "::1" || ip === "localhost") return;

  ipJail.set(ip, {
    bannedUntil: Date.now() + durationMs,
    reason,
  });
}

// 1. Known malicious scanners, fuzzers, and hacking tool signatures
const MALICIOUS_USER_AGENTS = [
  /sqlmap/i,
  /nikto/i,
  /dirbuster/i,
  /nmap/i,
  /acunetix/i,
  /masscan/i,
  /wpscan/i,
  /hydra/i,
  /metasploit/i,
  /havij/i,
  /zgrab/i,
  /nessus/i,
  /gobuster/i,
  /feroxbuster/i,
  /nuclei/i,
  /wfuzz/i,
  /ffuf/i,
  /censys/i,
  /shodan/i,
  /qualys/i,
  /openvas/i,
  /burpcollaborator/i,
  /burp/i,
  /zaproxy/i,
  /commix/i,
  /sqlsub/i,
  /arachni/i,
];

// 2. Honeypot Trap Routes (Instant Auto-Jail when accessed)
const HONEYPOT_TRAP_ROUTES = [
  /^\/wp-admin/i,
  /^\/wp-login\.php/i,
  /^\/xmlrpc\.php/i,
  /^\/\.env/i,
  /^\/\.git/i,
  /^\/phpmyadmin/i,
  /^\/pma/i,
  /^\/cgi-bin/i,
  /^\/actuator/i,
  /^\/solr/i,
  /^\/setup\.php/i,
  /^\/config\.json/i,
  /^\/server-status/i,
  /^\/\.aws/i,
  /^\/id_rsa/i,
  /^\/dump\.sql/i,
  /^\/backup\.sql/i,
  /^\/eval-stdin\.php/i,
  /^\/telescope/i,
  /^\/\.vscode/i,
  /^\/\.idea/i,
  /^\/vendor\//i,
  /^\/node_modules\//i,
  /^\/web\.config/i,
];

// 3. Attack Patterns in Query String / URL
const ATTACK_PATTERNS = [
  // SQL Injection
  /\b(?:union\s+select|drop\s+table|sleep\s*\(|waitfor\s+delay|or\s+1\s*=\s*1|information_schema|benchmark\s*\()/i,
  // Path Traversal / Local File Inclusion
  /(?:\.\.[\/\\]|etc\/passwd|win\.ini|proc\/self)/i,
  // Remote Code Execution / Log4j
  /(?:\$\{jndi:|\$\{env:|\/bin\/(?:sh|bash)|(?:cmd|powershell)\.exe)/i,
  // Cross-Site Scripting (XSS)
  /(?:<script|javascript:|onerror\s*=|onload\s*=|data:text\/html)/i,
];

// 4. Blocked / Dangerous HTTP Methods
const BLOCKED_HTTP_METHODS = new Set(["TRACE", "TRACK", "CONNECT", "DEBUG"]);

export function evaluateWafRules(
  request: NextRequest,
  clientIp: string
): { blocked: boolean; reason?: string; status?: number } {
  // Check if IP is already in Jail
  const jailStatus = isIpBanned(clientIp);
  if (jailStatus.banned) {
    return {
      blocked: true,
      reason: `IP Banned: ${jailStatus.reason}. Please try again later.`,
      status: 403,
    };
  }

  // Check HTTP method
  if (BLOCKED_HTTP_METHODS.has(request.method.toUpperCase())) {
    return {
      blocked: true,
      reason: "Method Not Allowed",
      status: 405,
    };
  }

  const userAgent = request.headers.get("user-agent") || "";
  const { pathname, search } = request.nextUrl;

  // Check Honeypot Traps -> Instant 2h IP Jail
  for (const trap of HONEYPOT_TRAP_ROUTES) {
    if (trap.test(pathname)) {
      jailIp(clientIp, `Honeypot trap triggered on ${pathname}`, 7200000); // 2 hours
      return {
        blocked: true,
        reason: "Access Denied: Security Violation",
        status: 403,
      };
    }
  }

  // Check Malicious User-Agents
  if (userAgent && MALICIOUS_USER_AGENTS.some((pattern) => pattern.test(userAgent))) {
    jailIp(clientIp, `Malicious User-Agent: ${userAgent.slice(0, 50)}`, 3600000); // 1 hour ban
    return {
      blocked: true,
      reason: "Forbidden: Automated scanner or exploitation tool detected.",
      status: 403,
    };
  }

  // Check Query String & Decoded URL for Attack Patterns
  const rawUrl = `${pathname}${search}`;
  let decodedUrl = rawUrl;
  try {
    decodedUrl = decodeURIComponent(rawUrl);
  } catch {
    return {
      blocked: true,
      reason: "Bad Request: Malformed URI Encoding",
      status: 400,
    };
  }

  for (const pattern of ATTACK_PATTERNS) {
    if (pattern.test(decodedUrl) || pattern.test(search)) {
      jailIp(clientIp, `Attack payload detected: ${pattern.toString()}`, 7200000); // 2 hours ban
      return {
        blocked: true,
        reason: "Forbidden: Malicious payload pattern detected.",
        status: 403,
      };
    }
  }

  return { blocked: false };
}
