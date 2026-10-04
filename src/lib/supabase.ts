import { createClient, SupabaseClient } from "@supabase/supabase-js";

/**
 * Default Supabase PDF storage bucket name
 */
export const SUPABASE_PDF_BUCKET = process.env.SUPABASE_PDF_BUCKET || "digital-pdfs";

let adminClient: SupabaseClient | null = null;

/**
 * Creates or gets a Supabase Admin client with service_role privileges.
 * This bypasses RLS and allows generating signed download URLs server-side.
 */
export function getSupabaseAdmin(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey || url.includes("your_supabase_url")) {
    console.warn("[Supabase] SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing or unconfigured.");
    return null;
  }

  if (!adminClient) {
    adminClient = createClient(url, serviceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }

  return adminClient;
}

/**
 * Generates a short-lived signed URL for downloading a digital PDF from Supabase storage.
 * 
 * @param storagePath Storage path in bucket e.g. "coloring/animal-coloring-book.pdf"
 * @param expiresInSeconds Time until expiration in seconds (default: 300 = 5 minutes)
 * @returns Temporary signed URL or null if error
 */
export async function generateSignedPdfUrl(
  storagePath: string,
  expiresInSeconds: number = 300
): Promise<{ signedUrl: string | null; error?: string }> {
  if (!storagePath) {
    return { signedUrl: null, error: "No storage path or URL provided." };
  }

  // If storagePath is a direct HTTP/HTTPS URL, return it immediately
  if (storagePath.trim().startsWith("http://") || storagePath.trim().startsWith("https://")) {
    return { signedUrl: storagePath.trim() };
  }

  const supabase = getSupabaseAdmin();

  if (!supabase) {
    return {
      signedUrl: null,
      error: "Supabase storage is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
    };
  }

  try {
    // Clean leading slashes or bucket prefix if present
    let cleanPath = storagePath.trim();
    if (cleanPath.startsWith("/")) {
      cleanPath = cleanPath.slice(1);
    }
    if (cleanPath.startsWith(`${SUPABASE_PDF_BUCKET}/`)) {
      cleanPath = cleanPath.replace(`${SUPABASE_PDF_BUCKET}/`, "");
    }

    const { data, error } = await supabase.storage
      .from(SUPABASE_PDF_BUCKET)
      .createSignedUrl(cleanPath, expiresInSeconds, {
        download: true, // Prompts browser file download
      });

    if (error || !data?.signedUrl) {
      console.error("[Supabase Storage Error]:", error?.message || "Failed to create signed URL");
      return {
        signedUrl: null,
        error: error?.message || "Unable to generate signed URL for this file.",
      };
    }

    return { signedUrl: data.signedUrl };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown Supabase storage error";
    console.error("[Supabase Exception]:", message);
    return { signedUrl: null, error: message };
  }
}

/**
 * Upload a PDF file directly to Supabase storage bucket from server.
 */
export async function uploadPdfToSupabase(
  fileBuffer: Buffer,
  storagePath: string,
  contentType: string = "application/pdf"
): Promise<{ success: boolean; path?: string; error?: string }> {
  const supabase = getSupabaseAdmin();

  if (!supabase) {
    return { success: false, error: "Supabase storage is not configured." };
  }

  try {
    let cleanPath = storagePath.trim();
    if (cleanPath.startsWith("/")) cleanPath = cleanPath.slice(1);

    const { data, error } = await supabase.storage
      .from(SUPABASE_PDF_BUCKET)
      .upload(cleanPath, fileBuffer, {
        contentType,
        upsert: true,
      });

    if (error) {
      console.error("[Supabase Upload Error]:", error.message);
      return { success: false, error: error.message };
    }

    return { success: true, path: data.path };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to upload file to Supabase";
    return { success: false, error: message };
  }
}
