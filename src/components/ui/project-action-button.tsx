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
      className={`btn btn-main ${className}`}
    >
      <i className={icon} style={{ marginRight: "8px" }}></i>
      {children}
    </a>
  );
}
