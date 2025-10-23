"use client";

import React from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { Button } from "./button";
import { DraggableList } from "./draggable-list";
import { ProjectImage } from "@/types/project";

interface ImageItem {
  id: string;
  file?: File;
  existing?: ProjectImage;
  preview: string;
  name: string;
}

interface ImagePreviewGridProps {
  images: ImageItem[];
  onReorder: (newImages: ImageItem[]) => void;
  onRemove: (id: string) => void;
  className?: string;
}

export function ImagePreviewGrid({
  images,
  onReorder,
  onRemove,
  className = "",
}: ImagePreviewGridProps) {
  if (images.length === 0) return null;

  return (
    <div className={className}>
      <DraggableList
        items={images}
        onReorder={onReorder}
        renderItem={(item) => (
          <div className="relative group bg-gray-50 dark:bg-gray-800 rounded-lg p-2">
            <div className="flex items-center gap-3">
              <div className="relative w-20 h-20 flex-shrink-0 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden">
                <Image
                  src={item.preview}
                  alt={item.name}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{item.name}</p>
                {item.existing && (
                  <p className="text-xs text-gray-500">Existing image</p>
                )}
                {item.file && (
                  <p className="text-xs text-gray-500">
                    {(item.file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                )}
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onRemove(item.id)}
                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      />
    </div>
  );
}

interface SingleImagePreviewProps {
  image?: {
    file?: File;
    existing?: ProjectImage;
  };
  onRemove: () => void;
  label: string;
}

export function SingleImagePreview({
  image,
  onRemove,
  label,
}: SingleImagePreviewProps) {
  if (!image || (!image.file && !image.existing)) return null;

  const preview = image.file
    ? URL.createObjectURL(image.file)
    : image.existing?.url || "";
  const name = image.file
    ? image.file.name
    : image.existing?.filename || "Image";

  return (
    <div className="relative group bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
      <div className="flex items-center gap-3">
        <div className="relative w-20 h-20 flex-shrink-0 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden">
          <Image
            src={preview}
            alt={label}
            fill
            className="object-cover"
            sizes="80px"
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{name}</p>
          {image.existing && (
            <p className="text-xs text-gray-500">Existing image</p>
          )}
          {image.file && (
            <p className="text-xs text-gray-500">
              {(image.file.size / 1024 / 1024).toFixed(2)} MB
            </p>
          )}
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onRemove}
          className="h-8 w-8 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
