import { NextRequest, NextResponse } from "next/server";
import { uploadToCloudinaryBuffer, isCloudinaryConfigured } from "@/lib/cloudinary";
import { getSessionUser } from "@/lib/auth";

// Allowed MIME types & file extension maps
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];
const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"];

const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
const MAX_VIDEO_SIZE_BYTES = 50 * 1024 * 1024; // 50MB

// Whitelisted folders to prevent directory traversal
const ALLOWED_FOLDERS = ["users", "posts", "products", "avatars", "gallery", "uploads"];
const BASE_APP_FOLDER = "my-app";

export async function POST(req: NextRequest) {
  try {
    // 1. Check Cloudinary Configuration
    if (!isCloudinaryConfigured()) {
      return NextResponse.json(
        {
          success: false,
          error: "Cloudinary storage is not configured. Please set Cloudinary environment variables.",
        },
        { status: 500 }
      );
    }

    // 2. Authentication Check (Optional strictness; allowing session user or admin)
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Please log in to upload files." },
        { status: 401 }
      );
    }

    // 3. Parse FormData
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const requestedFolder = (formData.get("folder") as string) || "uploads";

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file uploaded. Please attach a valid file." },
        { status: 400 }
      );
    }

    // 4. Validate Folder Name (Sanitize & Whitelist)
    const sanitizedFolder = requestedFolder.toLowerCase().replace(/[^a-z0-9_-]/g, "");
    const safeFolder = ALLOWED_FOLDERS.includes(sanitizedFolder) ? sanitizedFolder : "uploads";
    const fullFolderPath = `${BASE_APP_FOLDER}/${safeFolder}`;

    // 5. Validate File Type
    const mimeType = file.type.toLowerCase();
    const isImage = ALLOWED_IMAGE_TYPES.includes(mimeType);
    const isVideo = ALLOWED_VIDEO_TYPES.includes(mimeType);

    if (!isImage && !isVideo) {
      return NextResponse.json(
        {
          success: false,
          error: `Unsupported file format '${mimeType}'. Allowed formats: JPG, PNG, WEBP, GIF, AVIF, MP4, WEBM, MOV.`,
        },
        { status: 415 }
      );
    }

    // 6. Validate File Size
    const maxSize = isVideo ? MAX_VIDEO_SIZE_BYTES : MAX_IMAGE_SIZE_BYTES;
    if (file.size > maxSize) {
      const limitMb = Math.round(maxSize / (1024 * 1024));
      return NextResponse.json(
        {
          success: false,
          error: `File size exceeds the maximum limit of ${limitMb}MB.`,
        },
        { status: 413 }
      );
    }

    // 7. Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 8. Upload to Cloudinary
    const resourceType = isVideo ? "video" : "image";
    const result = await uploadToCloudinaryBuffer(buffer, {
      folder: fullFolderPath,
      resourceType,
    });

    // 9. Return Structured Response
    return NextResponse.json(
      {
        success: true,
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format,
        resourceType: result.resource_type,
        bytes: result.bytes,
        createdAt: result.created_at,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Cloudinary upload error:", err);
    return NextResponse.json(
      {
        success: false,
        error: err.message || "An error occurred while uploading the asset to Cloudinary.",
      },
      { status: 500 }
    );
  }
}
