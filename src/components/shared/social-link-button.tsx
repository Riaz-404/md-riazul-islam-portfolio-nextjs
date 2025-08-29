"use client";

import { Button } from "@/components/ui/button";
import type { SocialLink } from "@/types/navigation";
import Image from "next/image";
import { useState } from "react";

interface SocialLinkButtonProps {
  link: SocialLink;
  className?: string;
}

export function SocialLinkButton({ link, className }: SocialLinkButtonProps) {
  const [imageError, setImageError] = useState(false);

  const handleClick = () => {
    window.open(link.href, "_blank", "noopener,noreferrer");
  };

  const renderIcon = () => {
    if (imageError || !link.icon) {
      // Fallback to a simple placeholder if image fails to load
      return (
        <div className="bg-muted rounded flex items-center justify-center text-xs text-muted-foreground">
          ?
        </div>
      );
    }

    // Check if this icon might need a background for dark mode visibility
    const needsBackground =
      link.label.toLowerCase().includes("github") ||
      link.icon.includes("github") ||
      link.icon.includes("monochrome") ||
      link.icon.includes("material-outlined") ||
      link.icon.includes("material-filled");

    return (
      <Image
        src={link.icon}
        alt={link.label}
        height={32}
        width={32}
        className={
          needsBackground
            ? "bg-white dark:bg-white rounded-full w-8 h-8 object-contain"
            : "w-8 h-8 object-contain"
        }
        onError={() => setImageError(true)}
      />
    );
  };

  return (
    <button
      onClick={handleClick}
      className={`${className} flex cursor-pointer`}
      title={link.label}
    >
      {renderIcon()}
    </button>
  );
}
