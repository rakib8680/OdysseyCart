"use client";

import { useState, useRef } from "react";
import { useUploadThing } from "@/hooks/useUploadThing";
import { useAuth } from "@/contexts/AuthContext";
import { handleImageError } from "@/hooks/useImageFallback";
import { toast } from "sonner";
import {
  UploadCloud,
  Plus,
  Trash2,
  Star,
  Loader2,
  Image as ImageIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ProductImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
  disabled?: boolean;
}

/**
 * Modern Hybrid Product Image Uploader.
 * Supports direct file upload via Uploadthing (drag-and-drop or file browser)
 * and direct external image URL addition (Unsplash / supplier CDNs).
 * Includes 1-click primary cover reordering and individual image deletion.
 */
export function ProductImageUploader({
  images = [],
  onChange,
  maxImages = 6,
  disabled = false,
}: ProductImageUploaderProps) {
  const { user } = useAuth();
  const [urlInput, setUrlInput] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const remainingSlots = Math.max(0, maxImages - images.length);
  const isAtCapacity = images.length >= maxImages;

  // Uploadthing Client Hook
  const { startUpload, isUploading } = useUploadThing("productImageUploader", {
    headers: async () => {
      const token = await user?.getIdToken();
      return token ? { Authorization: `Bearer ${token}` } : {};
    },
    onClientUploadComplete: (res) => {
      if (res && res.length > 0) {
        const uploadedUrls = res.map(
          (item) => item.ufsUrl || (item as any).url,
        );
        const updated = [...images, ...uploadedUrls].slice(0, maxImages);
        onChange(updated);
        toast.success(
          `${res.length} image${res.length > 1 ? "s" : ""} uploaded successfully!`,
        );
      }
    },
    onUploadError: (error) => {
      toast.error(error.message || "Failed to upload image. Please try again.");
    },
  });

  // Handle file selection from input or drop
  const handleFiles = async (files: FileList | File[]) => {
    if (disabled || isUploading || isAtCapacity) return;

    const fileArray = Array.from(files).filter((file) =>
      file.type.startsWith("image/"),
    );

    if (fileArray.length === 0) {
      toast.error("Please select valid image files (PNG, JPG, WEBP).");
      return;
    }

    if (fileArray.length > remainingSlots) {
      toast.warning(
        `Only ${remainingSlots} more image${remainingSlots > 1 ? "s" : ""} can be added. Uploading the first ${remainingSlots}.`,
      );
    }

    const filesToUpload = fileArray.slice(0, remainingSlots);
    await startUpload(filesToUpload);
  };

  // Drag-and-drop event handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled && !isUploading && !isAtCapacity) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  // Add external URL directly
  const handleAddUrl = () => {
    if (disabled || isAtCapacity) return;
    const trimmed = urlInput.trim();

    if (!trimmed) return;

    try {
      const parsed = new URL(trimmed);
      if (!["http:", "https:"].includes(parsed.protocol)) {
        throw new Error("Invalid protocol");
      }
    } catch {
      toast.error("Please enter a valid HTTP or HTTPS image URL.");
      return;
    }

    if (images.includes(trimmed)) {
      toast.warning("This image URL is already in the list.");
      return;
    }

    onChange([...images, trimmed]);
    setUrlInput("");
    toast.success("Image URL added to gallery!");
  };

  // 1-Click Set as Primary (reorder to index 0)
  const handleSetPrimary = (index: number) => {
    if (index === 0 || disabled) return;
    const updated = [...images];
    const [selected] = updated.splice(index, 1);
    updated.unshift(selected);
    onChange(updated);
    toast.success("Primary cover image updated!");
  };

  // Remove image
  const handleRemove = (index: number) => {
    if (disabled) return;
    const updated = images.filter((_, i) => i !== index);
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      {/* Header & Capacity Indicator */}
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-slate-700">
          Product Images & Media
        </label>
        <Badge
          variant={isAtCapacity ? "secondary" : "outline"}
          className={cn(
            "text-xs font-semibold px-2.5 py-0.5",
            isAtCapacity
              ? "bg-amber-100 text-amber-800 border-amber-200"
              : "bg-slate-100 text-slate-600 border-slate-200",
          )}
        >
          {images.length} / {maxImages} Images
        </Badge>
      </div>

      {/* 1. Drag & Drop Uploadzone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => {
          if (!disabled && !isUploading && !isAtCapacity) {
            fileInputRef.current?.click();
          }
        }}
        className={cn(
          "relative border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer select-none",
          isDragging
            ? "border-emerald-500 bg-emerald-50/50 scale-[1.005]"
            : "border-slate-300 hover:border-slate-400 bg-slate-50/50 hover:bg-slate-50",
          (disabled || isAtCapacity) &&
            "opacity-60 cursor-not-allowed hover:border-slate-300 hover:bg-slate-50/50",
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/png, image/jpeg, image/webp"
          className="hidden"
          disabled={disabled || isUploading || isAtCapacity}
          onChange={(e) => {
            if (e.target.files) {
              handleFiles(e.target.files);
              e.target.value = "";
            }
          }}
        />

        {isUploading ? (
          <div className="flex flex-col items-center justify-center py-4 space-y-2">
            <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
            <p className="text-sm font-medium text-slate-700">
              Uploading images to CDN...
            </p>
            <p className="text-xs text-slate-400">Please wait a moment</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-emerald-100/80 text-emerald-600 flex items-center justify-center mb-1 shadow-xs">
              <UploadCloud className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">
                {isAtCapacity ? (
                  "Maximum image capacity reached"
                ) : (
                  <>
                    <span className="text-emerald-600 underline underline-offset-2 hover:text-emerald-700">
                      Click to upload
                    </span>{" "}
                    or drag and drop images here
                  </>
                )}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                PNG, JPG, or WEBP up to 8MB each (up to {maxImages} total)
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 2. Direct External URL Adder */}
      <div className="flex items-center gap-2">
        <Input
          type="url"
          placeholder="Or paste external image URL (e.g. Unsplash, CDN)..."
          value={urlInput}
          disabled={disabled || isAtCapacity}
          onChange={(e) => setUrlInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAddUrl();
            }
          }}
          className="h-9 bg-white text-xs sm:text-sm"
        />
        <Button
          type="button"
          size="sm"
          onClick={handleAddUrl}
          disabled={disabled || isAtCapacity || !urlInput.trim()}
          className="h-9 gap-1.5 bg-slate-800 hover:bg-slate-900 text-white shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add URL</span>
        </Button>
      </div>

      {/* 3. Interactive Thumbnail Preview Grid */}
      {images.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-2">
          {images.map((url, idx) => {
            const isPrimary = idx === 0;
            return (
              <div
                key={`${url}-${idx}`}
                className={cn(
                  "group relative aspect-square rounded-xl overflow-hidden border bg-slate-100 shadow-xs transition-all",
                  isPrimary
                    ? "border-emerald-500 ring-2 ring-emerald-500/20"
                    : "border-slate-200 hover:border-slate-300",
                )}
              >
                {/* Image */}
                <img
                  src={url}
                  alt={`Product media ${idx + 1}`}
                  onError={handleImageError}
                  className="w-full h-full object-cover"
                />

                {/* Primary Cover Badge */}
                {isPrimary ? (
                  <Badge className="absolute top-2 left-2 z-10 gap-1 bg-emerald-600 text-white px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider shadow-sm border-none">
                    <Star className="w-3 h-3 fill-white text-white" />
                    <span>Cover</span>
                  </Badge>
                ) : (
                  <Button
                    type="button"
                    size="xs"
                    onClick={() => handleSetPrimary(idx)}
                    title="Make primary cover image"
                    className="absolute top-2 left-2 z-10 opacity-0 group-hover:opacity-100 focus:opacity-100 bg-black/60 hover:bg-black/80 text-white text-[10px] font-medium transition-all cursor-pointer backdrop-blur-xs h-6 px-2"
                  >
                    Set Cover
                  </Button>
                )}

                {/* Delete / Remove Action Button */}
                <button
                  type="button"
                  onClick={() => handleRemove(idx)}
                  disabled={disabled}
                  aria-label={`Remove image ${idx + 1}`}
                  title="Remove image"
                  className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 focus:opacity-100 p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all cursor-pointer shadow-sm"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>

                {/* Bottom Index Tag */}
                <div className="absolute bottom-1.5 right-2 bg-black/50 text-white text-[10px] font-medium px-1.5 py-0.5 rounded backdrop-blur-xs select-none">
                  #{idx + 1}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-xs">
          <ImageIcon className="w-4 h-4 shrink-0 text-amber-600" />
          <span>
            No product images added yet. Add at least one image to list this
            item.
          </span>
        </div>
      )}

      {/* Helper Guidance */}
      <p className="text-[11px] text-slate-400">
        Tip: The image marked{" "}
        <strong className="text-slate-600">Cover (#1)</strong> will be displayed
        on the storefront catalog cards and social media preview cards.
      </p>
    </div>
  );
}
