import crypto from "crypto";

export interface R2Config {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucketName: string;
  publicDomain?: string;
}

// In-memory cache for dynamic admin-configured R2 credentials during serverless lifecycle
let dynamicR2Config: R2Config | null = null;

export function setDynamicR2Config(cfg: R2Config | null) {
  dynamicR2Config = cfg;
}

export function getR2Config(): R2Config | null {
  if (dynamicR2Config && dynamicR2Config.accountId && dynamicR2Config.accessKeyId) {
    return dynamicR2Config;
  }

  const accountId = (process.env.R2_ACCOUNT_ID || "").trim();
  const accessKeyId = (process.env.R2_ACCESS_KEY_ID || "").trim();
  const secretAccessKey = (process.env.R2_SECRET_ACCESS_KEY || "").trim();
  const bucketName = (process.env.R2_BUCKET_NAME || "pokky-packages").trim();
  const publicDomain = (process.env.R2_PUBLIC_DOMAIN || "").trim();

  if (accountId && accessKeyId && secretAccessKey && bucketName) {
    return {
      accountId,
      accessKeyId,
      secretAccessKey,
      bucketName,
      publicDomain: publicDomain || undefined,
    };
  }

  return null;
}

export function isR2Configured(): boolean {
  return Boolean(getR2Config());
}

function hmac(key: Buffer | string, data: string): Buffer {
  return crypto.createHmac("sha256", key).update(data, "utf8").digest();
}

function hash(data: string | Buffer): string {
  return crypto.createHash("sha256").update(data).digest("hex");
}

/**
 * Pure AWS Signature Version 4 (SigV4) Presigned URL Generator
 * Fully compatible with Cloudflare R2, zero external AWS SDK dependencies, zero bundle bloat.
 */
export function generateR2PresignedUrl(options: {
  method: "GET" | "PUT";
  key: string;
  expiresInSeconds?: number;
  contentType?: string;
  config?: R2Config;
}): string {
  const config = options.config || getR2Config();
  if (!config) {
    throw new Error("Cloudflare R2 is not configured");
  }

  const { accountId, accessKeyId, secretAccessKey, bucketName } = config;
  const method = options.method.toUpperCase();
  const expiresIn = options.expiresInSeconds || (method === "PUT" ? 1800 : 300); // 30 min for PUT, 5 min for GET

  // Clean object key
  const cleanKey = options.key.replace(/^\/+/, "");
  const host = `${accountId}.r2.cloudflarestorage.com`;
  const canonicalUri = `/${encodeURIComponent(bucketName)}/${cleanKey.split("/").map(encodeURIComponent).join("/")}`;

  const now = new Date();
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, ""); // YYYYMMDDTHHMMSSZ
  const dateStamp = amzDate.substring(0, 8); // YYYYMMDD
  const credentialScope = `${dateStamp}/auto/s3/aws4_request`;

  const queryParams: Record<string, string> = {
    "X-Amz-Algorithm": "AWS4-HMAC-SHA256",
    "X-Amz-Credential": `${accessKeyId}/${credentialScope}`,
    "X-Amz-Date": amzDate,
    "X-Amz-Expires": expiresIn.toString(),
    "X-Amz-SignedHeaders": "host",
  };

  // Canonical Query String must be sorted by key
  const sortedKeys = Object.keys(queryParams).sort();
  const canonicalQueryString = sortedKeys
    .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(queryParams[k])}`)
    .join("&");

  const canonicalHeaders = `host:${host}\n`;
  const signedHeaders = "host";
  const payloadHash = "UNSIGNED-PAYLOAD";

  const canonicalRequest = [
    method,
    canonicalUri,
    canonicalQueryString,
    canonicalHeaders,
    signedHeaders,
    payloadHash,
  ].join("\n");

  const stringToSign = [
    "AWS4-HMAC-SHA256",
    amzDate,
    credentialScope,
    hash(canonicalRequest),
  ].join("\n");

  // Derive signing key: HMAC-SHA256(HMAC-SHA256(HMAC-SHA256(HMAC-SHA256("AWS4" + secret, date), "auto"), "s3"), "aws4_request")
  const kDate = hmac(`AWS4${secretAccessKey}`, dateStamp);
  const kRegion = hmac(kDate, "auto");
  const kService = hmac(kRegion, "s3");
  const kSigning = hmac(kService, "aws4_request");

  const signature = crypto.createHmac("sha256", kSigning).update(stringToSign, "utf8").digest("hex");

  return `https://${host}${canonicalUri}?${canonicalQueryString}&X-Amz-Signature=${signature}`;
}

/**
 * Test R2 connection by performing a lightweight HEAD/GET presigned check
 */
export async function testR2Connection(config?: R2Config): Promise<{ success: boolean; message: string }> {
  try {
    const targetConfig = config || getR2Config();
    if (!targetConfig) {
      return { success: false, message: "ยังไม่ได้กรอกข้อมูลการตั้งค่า Cloudflare R2" };
    }

    // Try generating presigned URL and pinging bucket root
    const testUrl = generateR2PresignedUrl({
      method: "GET",
      key: "connection_test.txt",
      expiresInSeconds: 60,
      config: targetConfig,
    });

    const res = await fetch(testUrl, { method: "HEAD" });
    // 200 (file exists) or 404 (file not found but bucket is accessible and credentials are valid)
    if (res.status === 200 || res.status === 404) {
      return {
        success: true,
        message: `เชื่อมต่อ Cloudflare R2 สำเร็จ! เข้าถึง Bucket "${targetConfig.bucketName}" ได้อย่างถูกต้อง`,
      };
    }

    if (res.status === 403) {
      return {
        success: false,
        message: "การยืนยันตัวตนล้มเหลว (403 Forbidden): Access Key ID หรือ Secret Access Key ไม่ถูกต้อง หรือไม่มีสิทธิ์เข้าถึง Bucket นี้",
      };
    }

    return {
      success: false,
      message: `ไม่สามารถเชื่อมต่อ R2 ได้ (HTTP Status ${res.status}): ตรวจสอบ Account ID และชื่อ Bucket`,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Connection failed";
    return { success: false, message: `เกิดข้อผิดพลาด: ${msg}` };
  }
}
