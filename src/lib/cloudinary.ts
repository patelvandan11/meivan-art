import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from "cloudinary";

/**
 * Server-side Cloudinary Configuration.
 * NEVER import this file in client-side React components!
 */

if (typeof window !== "undefined") {
  throw new Error("src/lib/cloudinary.ts must only be imported in server-side code.");
}

const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
  secure: true,
});

export function isCloudinaryConfigured(): boolean {
  return Boolean(cloudName && apiKey && apiSecret);
}

export interface UploadStreamOptions {
  folder?: string;
  publicId?: string;
  resourceType?: "image" | "video" | "raw" | "auto";
  allowedFormats?: string[];
  transformation?: object | object[];
}

/**
 * Uploads a Buffer (from file upload) directly to Cloudinary using a readable stream.
 */
export async function uploadToCloudinaryBuffer(
  buffer: Buffer,
  options: UploadStreamOptions = {}
): Promise<UploadApiResponse> {
  if (!isCloudinaryConfigured()) {
    throw new Error(
      "Cloudinary credentials are missing. Please configure CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in your environment variables."
    );
  }

  const { folder = "my-app/uploads", publicId, resourceType = "auto", allowedFormats } = options;

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: publicId,
        resource_type: resourceType,
        allowed_formats: allowedFormats,
      },
      (error?: UploadApiErrorResponse, result?: UploadApiResponse) => {
        if (error) {
          return reject(error);
        }
        if (!result) {
          return reject(new Error("Upload succeeded but returned empty result."));
        }
        resolve(result);
      }
    );

    uploadStream.end(buffer);
  });
}

/**
 * Deletes an asset from Cloudinary using its public_id.
 */
export async function deleteFromCloudinary(
  publicId: string,
  resourceType: "image" | "video" | "raw" = "image"
): Promise<{ result: string }> {
  if (!isCloudinaryConfigured()) {
    throw new Error(
      "Cloudinary credentials are missing. Please configure CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in your environment variables."
    );
  }

  if (!publicId || typeof publicId !== "string") {
    throw new Error("A valid publicId string is required for deletion.");
  }

  const result = await cloudinary.uploader.destroy(publicId, {
    resource_type: resourceType,
    invalidate: true,
  });

  return result;
}

export { cloudinary };
