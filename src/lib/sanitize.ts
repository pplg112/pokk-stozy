/**
 * Advanced Input Sanitization, Anti-Spam, Anti-XSS, Homoglyph De-obfuscation, and Prototype Pollution Protection
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

/**
 * De-obfuscate text to defeat Thai & international spam evasion tactics
 * (Zero-width spaces, Cyrillic homoglyphs, leetspeak, spaced characters)
 */
export function normalizeSpamText(text: string): { normalized: string; compacted: string } {
  if (!text || typeof text !== "string") return { normalized: "", compacted: "" };

  // 1. Unicode NFKC Normalization
  let normalized = text.normalize("NFKC");

  // 2. Remove zero-width characters, soft hyphens, and directional formatting
  normalized = normalized.replace(/[\u200B-\u200F\u202A-\u202E\u2060-\u206F\uFEFF\u00AD]/g, "");

  // 3. Map common cross-language visual homoglyphs (Cyrillic/Greek lookalikes to Latin)
  const homoglyphs: Record<string, string> = {
    "а": "a", "с": "c", "е": "e", "о": "o", "р": "p", "ѕ": "s",
    "х": "x", "у": "y", "і": "i", "ј": "j", "А": "A", "В": "B",
    "С": "C", "Е": "E", "Н": "H", "І": "I", "Ј": "J", "К": "K",
    "М": "M", "О": "O", "Р": "P", "Т": "T", "Х": "X", "@": "a",
    "$": "s", "0": "o", "1": "i", "!": "i"
  };
  normalized = normalized.replace(/[асeорѕхуіјАВСЕНІЈКМОРТХ@$01!]/g, (char) => homoglyphs[char] || char);

  // 4. Compacted version (strip all spaces and punctuation to defeat spaced evasion e.g. "บ า ค า ร่ า" or "p . g")
  const compacted = normalized.replace(/[\s\.\-_,\/\\~*+:=#|?!()[\]{}'"`]/g, "").toLowerCase();

  return { normalized, compacted };
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
  /เครดิตฟรี/i,
  /สูตรบาคาร่า/i,
  /สล็อตแตก/i,
  /แอดไลน์/i,
  /t\.me\//i,
  /bit\.ly\//i,
  /wa\.me\//i,
  /line\.me\/ti\/p\//i,
  /cutt\.ly\//i,
  /tinyurl\.com\//i,
  /rb\.gy\//i,
  /discord\.gg\/[a-zA-Z0-9]+/i, // block unapproved discord invite links in reviews
];

export function isSpamContent(text: string): boolean {
  if (!text || typeof text !== "string") return false;

  const { normalized, compacted } = normalizeSpamText(text);

  // Check against normalized text
  if (SPAM_PATTERNS.some((pattern) => pattern.test(normalized))) {
    return true;
  }

  // Check against compacted text (defeats "บ า ค า ร่ า", "p.g.s.l.o.t", etc.)
  if (SPAM_PATTERNS.some((pattern) => pattern.test(compacted))) {
    return true;
  }

  return false;
}

export function isValidImageBase64(dataUrl: string): boolean {
  if (!dataUrl || typeof dataUrl !== "string") return false;

  // Maximum size 3 MB
  if (dataUrl.length > 3 * 1024 * 1024) return false;

  // Must start with valid image MIME type
  const validMimePattern = /^data:image\/(jpeg|png|webp|jpg);base64,([A-Za-z0-9+/=\r\n]+)$/;
  return validMimePattern.test(dataUrl);
}
