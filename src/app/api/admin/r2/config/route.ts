import { NextRequest, NextResponse } from "next/server";
import { isAuthenticatedRequest } from "@/lib/auth";
import { getR2Config, setDynamicR2Config, isR2Configured, R2Config } from "@/lib/r2";
import { getSupabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const SYS_R2_CONFIG_ID = "sys_r2_config";

async function loadR2ConfigFromDb(): Promise<R2Config | null> {
  const supabase = getSupabase();
  if (!supabase) return null;
  try {
    const { data } = await supabase
      .from("products")
      .select("description")
      .eq("id", SYS_R2_CONFIG_ID)
      .maybeSingle();

    if (data?.description) {
      const parsed = JSON.parse(data.description);
      if (parsed.accountId && parsed.accessKeyId) {
        return parsed as R2Config;
      }
    }
  } catch {}
  return null;
}

async function saveR2ConfigToDb(config: R2Config): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) return false;
  try {
    await supabase.from("products").upsert(
      {
        id: SYS_R2_CONFIG_ID,
        name: "[SYSTEM] Cloudflare R2 Config",
        tagline: "Internal storage configuration for Cloudflare R2",
        description: JSON.stringify(config),
        category: "bundles",
        active: false,
        updatedAt: new Date().toISOString(),
      },
      { onConflict: "id" }
    );
    return true;
  } catch {
    return false;
  }
}

export async function GET(request: NextRequest) {
  if (!(await isAuthenticatedRequest(request))) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  // Check DB if memory config is not yet loaded
  let current = getR2Config();
  if (!current) {
    const fromDb = await loadR2ConfigFromDb();
    if (fromDb) {
      setDynamicR2Config(fromDb);
      current = fromDb;
    }
  }

  return NextResponse.json({
    success: true,
    isConfigured: isR2Configured(),
    config: current
      ? {
          accountId: current.accountId,
          accessKeyId: current.accessKeyId,
          // Mask secret key
          secretAccessKey: current.secretAccessKey ? "••••••••••••••••••••••••" : "",
          bucketName: current.bucketName,
          publicDomain: current.publicDomain || "",
        }
      : null,
  });
}

export async function POST(request: NextRequest) {
  if (!(await isAuthenticatedRequest(request))) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { accountId, accessKeyId, secretAccessKey, bucketName, publicDomain } = body;

    if (!accountId || !accessKeyId || !bucketName) {
      return NextResponse.json(
        { success: false, error: "กรุณากรอก Account ID, Access Key ID และ Bucket Name ให้ครบถ้วน" },
        { status: 400 }
      );
    }

    // If secretAccessKey wasn't updated (still masked), retain existing
    let finalSecret = secretAccessKey;
    const current = getR2Config();
    if ((!finalSecret || finalSecret.includes("••••")) && current?.secretAccessKey) {
      finalSecret = current.secretAccessKey;
    }

    if (!finalSecret) {
      return NextResponse.json(
        { success: false, error: "กรุณากรอก Secret Access Key" },
        { status: 400 }
      );
    }

    const newConfig: R2Config = {
      accountId: accountId.trim(),
      accessKeyId: accessKeyId.trim(),
      secretAccessKey: finalSecret.trim(),
      bucketName: bucketName.trim(),
      publicDomain: publicDomain ? publicDomain.trim() : undefined,
    };

    setDynamicR2Config(newConfig);
    await saveR2ConfigToDb(newConfig);

    return NextResponse.json({
      success: true,
      message: "บันทึกการตั้งค่า Cloudflare R2 เรียบร้อยแล้ว",
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to save R2 config";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
