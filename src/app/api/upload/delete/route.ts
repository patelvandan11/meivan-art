import { NextRequest, NextResponse } from "next/server";
import { deleteFromCloudinary, isCloudinaryConfigured } from "@/lib/cloudinary";
import { getSessionUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  return handleDelete(req);
}

export async function DELETE(req: NextRequest) {
  return handleDelete(req);
}

async function handleDelete(req: NextRequest) {
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

    // 2. Authentication & Authorization Check
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Please log in to delete assets." },
        { status: 401 }
      );
    }

    // 3. Parse JSON Body or SearchParams
    let publicId: string | null = null;
    let resourceType: "image" | "video" | "raw" = "image";

    if (req.method === "DELETE") {
      const { searchParams } = new URL(req.url);
      publicId = searchParams.get("publicId");
      const resType = searchParams.get("resourceType");
      if (resType === "video" || resType === "raw" || resType === "image") {
        resourceType = resType;
      }
    }

    if (!publicId) {
      try {
        const body = await req.json();
        publicId = body.publicId;
        if (body.resourceType === "video" || body.resourceType === "raw" || body.resourceType === "image") {
          resourceType = body.resourceType;
        }
      } catch {
        // body wasn't JSON or was empty
      }
    }

    // 4. Validate publicId presence & format
    if (!publicId || typeof publicId !== "string" || publicId.trim() === "") {
      return NextResponse.json(
        { success: false, error: "A valid 'publicId' parameter is required for deletion." },
        { status: 400 }
      );
    }

    // Prevent malicious path injection (e.g. starting with ../ or containing system paths)
    if (publicId.includes("..") || publicId.startsWith("/")) {
      return NextResponse.json(
        { success: false, error: "Invalid publicId format." },
        { status: 400 }
      );
    }

    // 5. Perform Cloudinary Deletion
    const response = await deleteFromCloudinary(publicId, resourceType);

    if (response.result !== "ok" && response.result !== "not found") {
      return NextResponse.json(
        { success: false, error: `Cloudinary deletion failed with result: ${response.result}` },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Asset deleted successfully",
        publicId,
        result: response.result,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Cloudinary delete error:", err);
    return NextResponse.json(
      {
        success: false,
        error: err.message || "An error occurred while deleting the asset from Cloudinary.",
      },
      { status: 500 }
    );
  }
}
