"use client";

import { Button } from "@/components/ui/button";
import type { SocialLink } from "@/types/navigation";
import * as LucideIcons from "lucide-react";
import Image from "next/image";

interface SocialLinkButtonProps {
  link: SocialLink;
  className?: string;
}

export function SocialLinkButton({ link, className }: SocialLinkButtonProps) {
  const handleClick = () => {
    window.open(link.href, "_blank", "noopener,noreferrer");
  };

  const renderIcon = () => {
    if (link.iconType === "image") {
      return (
        <Image
          src={link.icon}
          alt={link.label}
          width={20}
          height={20}
          className="w-5 h-5 object-contain"
          unoptimized // For external images
        />
      );
    }

    // Lucide icon
    const IconComponent = (LucideIcons as any)[link.icon];
    if (!IconComponent) {
      const ExternalLink = LucideIcons.ExternalLink;
      return <ExternalLink className="w-5 h-5" />;
    }
    return <IconComponent className="w-5 h-5" />;
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleClick}
      className={className}
      title={link.label}
    >
      {renderIcon()}
    </Button>
  );
}
