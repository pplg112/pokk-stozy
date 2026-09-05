/**
 * Advanced Input Sanitization, Anti-Spam, Anti-XSS, and Prototype Pollution Protection
 */

export function sanitizeText(str: string): string {
  if (!str || typeof str !== "string") return "";

  return str
    .replace(/\0/g, "") // remove null bytes
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "") // remove script tags
    .replace(/<[^>]+>/g, "") // remove all HTML tags
    .replace(/javascript:/gi, "") // strip pseudo-protocol
    .replace(/on\w+\s*=/gi, "") // strip event handlers like onerror=, onclick=
    .replace(/[<>'"&]/g, (char) => {
      // Escape HTML entities
      switch (char) {
        case "<": return "&lt;";
        case ">": return "&gt;";
        case "'": return "&#39;";
        case '"': return "&quot;";
        case "&": return "&amp;";
        default: return char;
      }
    })
    .trim();
}

/**
 * Protect against JSON Object Prototype Pollution
 */
export function containsPrototypePollution(obj: any): boolean {
  if (!obj || typeof obj !== "object") return false;

  const dangerousKeys = ["__proto__", "constructor", "prototype"];
  
  for (const key of Object.keys(obj)) {
    if (dangerousKeys.includes(key.toLowerCase())) {
      return true;
    }
    if (typeof obj[key] === "object" && obj[key] !== null) {
      if (containsPrototypePollution(obj[key])) {
        return true;
      }
    }
  }

  return false;
}

const SPAM_PATTERNS = [
  /pgslot/i,
  /slot\s*auto/i,
  /เว็บตรง/i,
  /บาคาร่า/i,
  /แทงบอล/i,
  /ufabet/i,
  /sexybaccarat/i,
  /gclub/i,
  /ruay/i,
  /หวยออนไลน์/i,
  /ปั่นบาคาร่า/i,
  /คาสิโน/i,
  /ฝาก\s*ถอน/i,
  /แจกเครดิตฟรี/i,
  /t\.me\//i,
  /bit\.ly\//i,
  /wa\.me\//i,
  /line\.me\/ti\/p\//i,
  /cutt\.ly\//i,
  /tinyurl\.com\//i,
  /rb\.gy\//i,
];

export function isSpamContent(text: string): boolean {
  if (!text) return false;
  return SPAM_PATTERNS.some((pattern) => pattern.test(text));
}

export function isValidImageBase64(dataUrl: string): boolean {
  if (!dataUrl || typeof dataUrl !== "string") return false;

  // Maximum size 3 MB
  if (dataUrl.length > 3 * 1024 * 1024) return false;

  // Must start with valid image MIME type
  const validMimePattern = /^data:image\/(jpeg|png|webp|jpg);base64,([A-Za-z0-9+/=\r\n]+)$/;
  return validMimePattern.test(dataUrl);
}
