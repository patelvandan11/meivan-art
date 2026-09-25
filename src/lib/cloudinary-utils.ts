/**
 * Cloudinary Transformation Utilities & Helpers
 * Can be safely imported in both Client and Server components.
 */

export interface CloudinaryTransformOptions {
  width?: number;
  height?: number;
  crop?: "fill" | "fit" | "limit" | "thumb" | "crop" | "scale" | "pad";
  gravity?: "auto" | "face" | "faces" | "center" | "north" | "south" | "east" | "west";
  quality?: "auto" | number | string;
  format?: "auto" | "webp" | "jpg" | "png" | "avif";
  aspectRatio?: string;
  zoom?: number;
  effect?: string;
}

const DEFAULT_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME || "demo";

/**
 * Builds a Cloudinary URL with dynamic transformation parameters.
 * Example input: buildCloudinaryUrl("my-app/avatars/user1", { width: 200, height: 200, crop: "fill", gravity: "face" })
 */
export function buildCloudinaryUrl(
  publicIdOrUrl: string,
  options: CloudinaryTransformOptions = {},
  cloudName: string = DEFAULT_CLOUD_NAME
): string {
  if (!publicIdOrUrl) return "";

  // If it's already a full URL, extract the publicId if possible, or insert transformations before /v1/ or /upload/
  if (publicIdOrUrl.startsWith("http://") || publicIdOrUrl.startsWith("https://")) {
    const uploadIndex = publicIdOrUrl.indexOf("/upload/");
    if (uploadIndex !== -1) {
      const transformStr = buildTransformationString(options);
      const prefix = publicIdOrUrl.slice(0, uploadIndex + 8); // includes '/upload/'
      const suffix = publicIdOrUrl.slice(uploadIndex + 8);
      
      // If suffix already has transformations, replace or prepend
      return transformStr ? `${prefix}${transformStr}/${suffix}` : publicIdOrUrl;
    }
    return publicIdOrUrl;
  }

  // Construct URL from publicId
  const transformStr = buildTransformationString(options);
  const transformPath = transformStr ? `${transformStr}/` : "";
  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformPath}${publicIdOrUrl}`;
}

/**
 * Formats options into a Cloudinary URL transformation string (e.g. "c_fill,g_face,w_200,h_200,q_auto,f_auto")
 */
export function buildTransformationString(options: CloudinaryTransformOptions): string {
  const parts: string[] = [];

  const {
    width,
    height,
    crop = "limit",
    gravity,
    quality = "auto",
    format = "auto",
    aspectRatio,
    zoom,
    effect,
  } = options;

  if (crop) parts.push(`c_${crop}`);
  if (gravity) parts.push(`g_${gravity}`);
  if (width) parts.push(`w_${width}`);
  if (height) parts.push(`h_${height}`);
  if (aspectRatio) parts.push(`ar_${aspectRatio}`);
  if (zoom) parts.push(`z_${zoom}`);
  if (effect) parts.push(`e_${effect}`);
  if (quality) parts.push(`q_${quality}`);
  if (format) parts.push(`f_${format}`);

  return parts.join(",");
}

/**
 * Preset Transformations
 */
export const CloudinaryPresets = {
  /** Small square thumbnail (150x150 fill) */
  thumbnail: (publicIdOrUrl: string) =>
    buildCloudinaryUrl(publicIdOrUrl, { width: 150, height: 150, crop: "fill", gravity: "auto", quality: "auto", format: "auto" }),

  /** Circular or square face profile avatar (300x300 face detection) */
  avatar: (publicIdOrUrl: string) =>
    buildCloudinaryUrl(publicIdOrUrl, { width: 300, height: 300, crop: "fill", gravity: "face", quality: "auto", format: "auto" }),

  /** Medium card or post preview image (600px max width) */
  medium: (publicIdOrUrl: string) =>
    buildCloudinaryUrl(publicIdOrUrl, { width: 600, crop: "limit", quality: "auto", format: "auto" }),

  /** Large hero / product gallery image (1200px max width) */
  large: (publicIdOrUrl: string) =>
    buildCloudinaryUrl(publicIdOrUrl, { width: 1200, crop: "limit", quality: "auto", format: "auto" }),
};

/**
 * Extracts publicId from a full Cloudinary URL.
 */
export function extractPublicIdFromUrl(url: string): string | null {
  if (!url) return null;
  const match = url.match(/\/upload\/(?:v\d+\/)?(?:[a-zA-Z_0-9,]+\/)?(.+)\.[a-zA-Z0-9]+$/);
  return match ? match[1] : null;
}
