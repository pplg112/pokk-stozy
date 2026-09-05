/**
 * Input sanitization & Anti-Spam / Anti-XSS utilities
 */

export function sanitizeText(str: string): string {
  if (!str || typeof str !== "string") return "";

  return str
    .replace(/\0/g, "") // remove null bytes
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "") // remove script tags
    .replace(/<[^>]+>/g, "") // remove all HTML tags
    .replace(/javascript:/gi, "") // strip pseudo-protocol
    .replace(/on\w+\s*=/gi, "") // strip event handlers like onerror=, onclick=
    .trim();
}

const SPAM_PATTERNS = [
  /pgslot/i,
  /slot\s*auto/i,
  /เว็บตรง/i,
  /บาคาร่า/i,
  /แทงบอล/i,
  /ufabet/i,
  /คาสิโน/i,
  /ฝาก\s*ถอน/i,
  /แจกเครดิตฟรี/i,
  /t\.me\//i,
  /bit\.ly\//i,
  /wa\.me\//i,
  /line\.me\/ti\/p\//i,
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
