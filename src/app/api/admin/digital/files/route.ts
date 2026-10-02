import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { getSupabaseAdmin, SUPABASE_PDF_BUCKET } from "@/lib/supabase";

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const supabase = getSupabaseAdmin();
    if (!supabase) {
      return NextResponse.json({ success: false, error: "Supabase not configured" }, { status: 500 });
    }

    const { data: files, error } = await supabase.storage.from(SUPABASE_PDF_BUCKET).list();

    if (error) {
      console.error("[Supabase List Files Error]:", error.message);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    const fileList = (files || []).map((f) => ({
      name: f.name,
      path: f.name,
      size: f.metadata?.size || 0,
      createdAt: f.created_at,
    }));

    return NextResponse.json({ success: true, files: fileList, bucket: SUPABASE_PDF_BUCKET });
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : "Error listing files";
    return NextResponse.json({ success: false, error: errMsg }, { status: 500 });
  }
}
