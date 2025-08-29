// Static navigation links
export interface StaticNavigationLink {
  id: string;
  label: string;
  href: string;
  order: number;
}

// Social link type
export interface SocialLink {
  id: string;
  href: string;
  icon: string; // External image URL (e.g., Icons8, Simple Icons, etc.)
  label: string;
  order: number;
  isActive: boolean;
}

// Navigation data type (now only contains social links)
export interface NavigationData {
  id: string;
  socialLinks: SocialLink[];
  createdAt?: Date;
  updatedAt?: Date;
}

// Static navigation links (these won't be in database)
export const staticNavigationLinks: StaticNavigationLink[] = [
  { id: "1", label: "Home", href: "#home", order: 1 },
  { id: "2", label: "About", href: "#about", order: 2 },
  { id: "3", label: "Expertise", href: "#expertise", order: 3 },
  { id: "4", label: "Projects", href: "#projects", order: 4 },
  { id: "5", label: "Contact", href: "#contact", order: 5 },
];

// Default navigation data (only social links)
export const defaultNavigationData: Omit<
  NavigationData,
  "id" | "createdAt" | "updatedAt"
> = {
  socialLinks: [
    {
      id: "1",
      href: "https://www.facebook.com/imriaz.cu/",
      icon: "https://img.icons8.com/fluency/48/facebook-new.png",
      label: "Facebook",
      order: 1,
      isActive: true,
    },
    {
      id: "2",
      href: "https://www.linkedin.com/in/md-riazul-islam-891b65194/",
      icon: "https://img.icons8.com/fluency/48/linkedin.png",
      label: "LinkedIn",
      order: 2,
      isActive: true,
    },
    {
      id: "3",
      href: "https://github.com/Riaz-404",
      icon: "https://img.icons8.com/fluency/48/github.png",
      label: "GitHub",
      order: 3,
      isActive: true,
    },
  ],
};
