"use client";

interface ProjectActionButtonProps {
  href: string;
  icon: string;
  children: React.ReactNode;
  className?: string;
}

export function ProjectActionButton({
  href,
  icon,
  children,
  className = "",
}: ProjectActionButtonProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-md text-sm font-medium transition-all duration-200 bg-primary text-primary-foreground hover:bg-primary/85 ${className}`}
    >
      <i className={icon}></i>
      {children}
    </a>
  );
}
