import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { uploadPdfToSupabase, SUPABASE_PDF_BUCKET } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Admin privileges required." },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    let storagePath = (formData.get("storagePath") as string | null) || "";

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No PDF file provided." },
        { status: 400 }
      );
    }

    if (!file.name.toLowerCase().endsWith(".pdf") && file.type !== "application/pdf") {
      return NextResponse.json(
        { success: false, error: "Only PDF files are allowed." },
        { status: 400 }
      );
    }

    // Generate path if not supplied
    if (!storagePath.trim()) {
      const cleanFileName = file.name
        .toLowerCase()
        .replace(/[^a-z0-9.-]/g, "-")
        .replace(/-+/g, "-");
      storagePath = `pdfs/${Date.now()}-${cleanFileName}`;
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadRes = await uploadPdfToSupabase(buffer, storagePath, file.type || "application/pdf");

    if (!uploadRes.success) {
      return NextResponse.json(
        { success: false, error: uploadRes.error || "Failed to upload PDF to Supabase storage." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      storagePath: uploadRes.path || storagePath,
      bucket: SUPABASE_PDF_BUCKET,
      fileName: file.name,
      size: file.size,
    });
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : "Error uploading PDF file";
    console.error("[Admin Supabase PDF Upload Error]:", errMsg);
    return NextResponse.json(
      { success: false, error: errMsg },
      { status: 500 }
    );
  }
}
