"use client";

import React from "react";
import Image, { ImageProps } from "next/image";
import { buildCloudinaryUrl, CloudinaryTransformOptions } from "@/lib/cloudinary-utils";

export interface CloudinaryImageProps extends Omit<ImageProps, "src"> {
  src: string; // Cloudinary publicId OR full Cloudinary URL
  alt: string;
  preset?: "thumbnail" | "avatar" | "medium" | "large" | "custom";
  transformations?: CloudinaryTransformOptions;
  cloudName?: string;
}

/**
 * Optimized Cloudinary Image Component built on top of Next.js <Image />.
 * Applies automatic format selection (f_auto) and quality optimization (q_auto).
 */
export function CloudinaryImage({
  src,
  alt,
  preset = "custom",
  transformations = {},
  cloudName,
  width,
  height,
  className = "",
  fill = false,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  ...props
}: CloudinaryImageProps) {
  // Determine transformation options based on preset
  let options: CloudinaryTransformOptions = {
    quality: "auto",
    format: "auto",
    ...transformations,
  };

  switch (preset) {
    case "thumbnail":
      options = {
        width: 150,
        height: 150,
        crop: "fill",
        gravity: "auto",
        ...options,
      };
      break;
    case "avatar":
      options = {
        width: 300,
        height: 300,
        crop: "fill",
        gravity: "face",
        ...options,
      };
      break;
    case "medium":
      options = {
        width: 600,
        crop: "limit",
        ...options,
      };
      break;
    case "large":
      options = {
        width: 1200,
        crop: "limit",
        ...options,
      };
      break;
    case "custom":
    default:
      if (typeof width === "number" && !options.width) options.width = width;
      if (typeof height === "number" && !options.height) options.height = height;
      break;
  }

  // Construct Cloudinary URL with transformations
  const transformedUrl = buildCloudinaryUrl(src, options, cloudName);

  // Fallback dimensions if fill is false and width/height not explicit
  const finalWidth = fill ? undefined : Number(width || options.width || 800);
  const finalHeight = fill ? undefined : Number(height || options.height || 600);

  return (
    <Image
      src={transformedUrl}
      alt={alt}
      width={finalWidth}
      height={finalHeight}
      fill={fill}
      sizes={fill ? sizes : undefined}
      className={className}
      {...props}
    />
  );
}
