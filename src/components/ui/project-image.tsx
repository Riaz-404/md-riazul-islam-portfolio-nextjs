"use client";

import { useState } from "react";
import Image from "next/image";
import { ProjectImage } from "@/types/project";

interface ProjectImageDisplayProps {
  image: ProjectImage;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
}

export function ProjectImageDisplay({
  image,
  alt,
  className = "",
  width = 400,
  height = 300,
  priority = false,
}: ProjectImageDisplayProps) {
  const [imageError, setImageError] = useState(false);

  // Use Cloudinary URL directly
  const imageUrl = image.url;

  if (imageError) {
    return (
      <div
        className={`bg-gray-200 dark:bg-gray-700 flex items-center justify-center ${className}`}
        style={{ width, height }}
      >
        <span className="text-gray-500 dark:text-gray-400 text-sm">
          Failed to load image
        </span>
      </div>
    );
  }

  return (
    <Image
      src={imageUrl}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
      onError={() => setImageError(true)}
      style={{
        objectFit: "cover",
      }}
    />
  );
}
