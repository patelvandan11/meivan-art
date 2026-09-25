"use client";

import React, { useState, useRef, useCallback, ChangeEvent, DragEvent } from "react";
import Image from "next/image";
import { Upload, X, CheckCircle, AlertCircle, Loader2, Trash2, RefreshCw } from "lucide-react";
import type { UploadResult } from "@/types";

export interface ImageUploadProps {
  folder?: "posts" | "users" | "products" | "avatars" | "gallery" | "uploads";
  onUpload?: (result: {
    url: string;
    publicId: string;
    width?: number;
    height?: number;
    format?: string;
    resourceType?: string;
  }) => void;
  onRemove?: (publicId?: string) => void;
  maxSizeMb?: number;
  allowedTypes?: string[];
  defaultValue?: string;
  defaultPublicId?: string;
  className?: string;
  disabled?: boolean;
  label?: string;
}

export function ImageUpload({
  folder = "posts",
  onUpload,
  onRemove,
  maxSizeMb = 10,
  allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/avif"],
  defaultValue = "",
  defaultPublicId = "",
  className = "",
  disabled = false,
  label = "Upload Image",
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [previewUrl, setPreviewUrl] = useState<string>(defaultValue);
  const [currentPublicId, setCurrentPublicId] = useState<string>(defaultPublicId);
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(Boolean(defaultValue));
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const validateFile = useCallback((file: File): string | null => {
    // 1. Validate File Type
    if (!allowedTypes.includes(file.type.toLowerCase())) {
      return `Invalid format (${file.type || "unknown"}). Allowed formats: JPG, PNG, WEBP, AVIF.`;
    }

    // 2. Validate File Size
    const maxSizeBytes = maxSizeMb * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return `File size (${(file.size / (1024 * 1024)).toFixed(1)}MB) exceeds limit of ${maxSizeMb}MB.`;
    }

    return null;
  }, [allowedTypes, maxSizeMb]);

  const uploadFile = useCallback(async (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    setErrorMessage(null);
    setIsUploading(true);
    setProgress(10);

    // Set immediate local blob preview
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      setProgress(40);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      setProgress(80);

      const data: UploadResult = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to upload image.");
      }

      setProgress(100);
      setPreviewUrl(data.url);
      setCurrentPublicId(data.publicId);
      setUploadSuccess(true);
      setIsUploading(false);

      if (onUpload) {
        onUpload({
          url: data.url,
          publicId: data.publicId,
          width: data.width,
          height: data.height,
          format: data.format,
          resourceType: data.resourceType,
        });
      }
    } catch (err: unknown) {
      const error = err as Error;
      console.error("Upload error:", error);
      setErrorMessage(error.message || "Upload failed. Please try again.");
      setIsUploading(false);
      setProgress(0);
      setUploadSuccess(false);
    }
  }, [folder, onUpload, validateFile]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      uploadFile(e.target.files[0]);
    }
  };

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragging(true);
  }, [disabled]);

  const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      uploadFile(e.dataTransfer.files[0]);
    }
  }, [disabled, uploadFile]);

  const handleRemove = async () => {
    const targetPublicId = currentPublicId;

    setPreviewUrl("");
    setCurrentPublicId("");
    setUploadSuccess(false);
    setErrorMessage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    if (onRemove) {
      onRemove(targetPublicId);
    }

    // Optionally attempt server deletion if publicId exists
    if (targetPublicId) {
      try {
        await fetch("/api/upload/delete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ publicId: targetPublicId }),
        });
      } catch (err) {
        console.warn("Could not auto-delete asset from Cloudinary:", err);
      }
    }
  };

  return (
    <div className={`w-full font-sans ${className}`}>
      {label && (
        <label className="block text-sm font-semibold text-neutral-800 dark:text-neutral-200 mb-2">
          {label}
        </label>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={allowedTypes.join(",")}
        onChange={handleFileChange}
        disabled={disabled || isUploading}
        className="hidden"
        id={`cloudinary-upload-input-${folder}`}
      />

      {/* Upload Zone or Preview */}
      {!previewUrl ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !disabled && fileInputRef.current?.click()}
          className={`relative group cursor-pointer border-2 border-dashed rounded-2xl p-6 transition-all duration-200 text-center flex flex-col items-center justify-center min-h-[200px] ${
            isDragging
              ? "border-amber-500 bg-amber-50/50 dark:bg-amber-950/20 scale-[0.99]"
              : "border-neutral-300 hover:border-amber-500/70 dark:border-neutral-700 dark:hover:border-amber-400 bg-neutral-50/80 hover:bg-white dark:bg-neutral-900/60 dark:hover:bg-neutral-900"
          } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Upload className="w-6 h-6" />
          </div>

          <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
            <span className="text-amber-600 dark:text-amber-400 font-semibold underline underline-offset-2">
              Click to upload
            </span>{" "}
            or drag & drop
          </p>

          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            JPG, PNG, WEBP, or AVIF (max {maxSizeMb}MB)
          </p>
        </div>
      ) : (
        /* Image Preview Box */
        <div className="relative rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-900 group shadow-md min-h-[220px] flex items-center justify-center">
          <Image
            src={previewUrl}
            alt="Upload Preview"
            fill
            className={`object-contain transition-opacity duration-300 ${
              isUploading ? "opacity-40 blur-xs" : "opacity-100"
            }`}
          />

          {/* Uploading Overlay & Progress */}
          {isUploading && (
            <div className="absolute inset-0 bg-neutral-950/60 backdrop-blur-xs flex flex-col items-center justify-center p-4 z-10">
              <Loader2 className="w-8 h-8 text-amber-400 animate-spin mb-3" />
              <p className="text-sm font-medium text-white mb-2">Uploading to Cloudinary...</p>
              <div className="w-48 bg-neutral-700 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-amber-500 h-2 transition-all duration-300 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Controls Bar on Hover or Idle */}
          {!isUploading && (
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end justify-between p-4 z-10">
              <div className="flex items-center space-x-2">
                {uploadSuccess && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/90 text-white backdrop-blur-xs">
                    <CheckCircle className="w-3.5 h-3.5" /> Uploaded
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  title="Replace Image"
                  className="p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white backdrop-blur-md transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleRemove}
                  title="Remove Image"
                  className="p-2 rounded-xl bg-red-500/80 hover:bg-red-600 text-white backdrop-blur-md transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Error Message Alert */}
      {errorMessage && (
        <div className="mt-2.5 p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="ml-auto text-red-400 hover:text-red-600"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
