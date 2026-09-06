import { NextRequest, NextResponse } from "next/server";
import { isAuthenticatedRequest } from "@/lib/auth";
import { testR2Connection, getR2Config, R2Config } from "@/lib/r2";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  if (!(await isAuthenticatedRequest(request))) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    let configToTest: R2Config | undefined = undefined;

    if (body.accountId && body.accessKeyId) {
      let secretKey = body.secretAccessKey;
      if ((!secretKey || secretKey.includes("••••")) && getR2Config()?.secretAccessKey) {
        secretKey = getR2Config()!.secretAccessKey;
      }
      configToTest = {
        accountId: body.accountId.trim(),
        accessKeyId: body.accessKeyId.trim(),
        secretAccessKey: (secretKey || "").trim(),
        bucketName: (body.bucketName || "pokky-packages").trim(),
        publicDomain: body.publicDomain ? body.publicDomain.trim() : undefined,
      };
    }

    const result = await testR2Connection(configToTest);
    return NextResponse.json(result);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Test failed";
    return NextResponse.json({ success: false, message: `เกิดข้อผิดพลาด: ${msg}` });
  }
}
