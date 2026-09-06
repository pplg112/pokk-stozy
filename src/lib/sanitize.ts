/**
 * Advanced Input Sanitization, Anti-Spam, Anti-XSS, Homoglyph De-obfuscation, and Prototype Pollution Protection
 */

export function sanitizeText(str: string): string {
  if (!str || typeof str !== "string") return "";

  return str
    .replace(/\0/g, "") // remove null bytes
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "") // remove script tags
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "") // remove style tags
    .replace(/<[^>]+>/g, "") // remove all HTML tags
    .replace(/javascript:/gi, "") // strip pseudo-protocol
    .replace(/data:text\/html/gi, "") // strip html data uris
    .replace(/on\w+\s*=/gi, "") // strip event handlers like onerror=, onclick=
    .replace(/[&<>"']/g, (char) => {
      switch (char) {
        case "&": return "&amp;";
        case "<": return "&lt;";
        case ">": return "&gt;";
        case '"': return "&quot;";
        case "'": return "&#39;";
        default: return char;
      }
    })
    .trim();
}

/**
 * Protect against JSON Object Prototype Pollution with maximum recursion depth to prevent stack overflow
 */
export function containsPrototypePollution(obj: unknown, depth = 0): boolean {
  if (!obj || typeof obj !== "object") return false;
  if (depth > 10) return true; // Reject deeply nested structures as potential DoS exploit

  const dangerousKeys = ["__proto__", "constructor", "prototype"];
  const record = obj as Record<string, unknown>;
  
  for (const key of Object.keys(record)) {
    if (dangerousKeys.includes(key.toLowerCase())) {
      return true;
    }
    const val = record[key];
    if (typeof val === "object" && val !== null) {
      if (containsPrototypePollution(val, depth + 1)) {
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
    "\u0430": "a", // Cyrillic small a
    "\u0441": "c", // Cyrillic small es
    "\u0435": "e", // Cyrillic small ie
    "\u043E": "o", // Cyrillic small o
    "\u0440": "p", // Cyrillic small er
    "\u0455": "s", // Cyrillic small dze
    "\u0445": "x", // Cyrillic small ha
    "\u0443": "y", // Cyrillic small u
    "\u0456": "i", // Cyrillic small i
    "\u0458": "j", // Cyrillic small je
    "\u0410": "A", // Cyrillic capital A
    "\u0412": "B", // Cyrillic capital Ve
    "\u0421": "C", // Cyrillic capital Es
    "\u0415": "E", // Cyrillic capital Ie
    "\u041D": "H", // Cyrillic capital En
    "\u0406": "I", // Cyrillic capital I
    "\u0408": "J", // Cyrillic capital Je
    "\u041A": "K", // Cyrillic capital Ka
    "\u041C": "M", // Cyrillic capital Em
    "\u041E": "O", // Cyrillic capital O
    "\u0420": "P", // Cyrillic capital Er
    "\u0422": "T", // Cyrillic capital Te
    "\u0425": "X", // Cyrillic capital Ha
    "@": "a",
    "$": "s",
    "0": "o",
    "1": "i",
    "!": "i"
  };
  const homoglyphRegex = /[\u0406\u0408\u0410\u0412\u0415\u041A\u041C\u041D\u041E\u0420\u0421\u0422\u0425\u0430\u0431\u0435\u043E\u0440\u0441\u0443\u0445\u0455\u0456\u0458@$01!]/g;
  normalized = normalized.replace(homoglyphRegex, (char) => homoglyphs[char] || char);

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
