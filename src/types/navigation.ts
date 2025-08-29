// Navigation link type
export interface NavigationLink {
  id: string;
  label: string;
  href: string;
  order: number;
  isActive: boolean;
}

// Social link type
export interface SocialLink {
  id: string;
  href: string;
  icon: string; // Icon name from Lucide React
  label: string;
  order: number;
  isActive: boolean;
}

// Navigation data type
export interface NavigationData {
  id: string;
  navigationLinks: NavigationLink[];
  socialLinks: SocialLink[];
  createdAt?: Date;
  updatedAt?: Date;
}

// Default navigation data
export const defaultNavigationData: Omit<
  NavigationData,
  "id" | "createdAt" | "updatedAt"
> = {
  navigationLinks: [
    { id: "1", label: "Home", href: "#home", order: 1, isActive: true },
    { id: "2", label: "About", href: "#about", order: 2, isActive: true },
    {
      id: "3",
      label: "Expertise",
      href: "#expertise",
      order: 3,
      isActive: true,
    },
    { id: "4", label: "Projects", href: "#projects", order: 4, isActive: true },
    { id: "5", label: "Contact", href: "#contact", order: 5, isActive: true },
  ],
  socialLinks: [
    {
      id: "1",
      href: "https://www.facebook.com/imriaz.cu/",
      icon: "Facebook",
      label: "Facebook",
      order: 1,
      isActive: true,
    },
    {
      id: "2",
      href: "https://www.linkedin.com/in/md-riazul-islam-891b65194/",
      icon: "Linkedin",
      label: "LinkedIn",
      order: 2,
      isActive: true,
    },
    {
      id: "3",
      href: "https://github.com/Riaz-404",
      icon: "Github",
      label: "GitHub",
      order: 3,
      isActive: true,
    },
  ],
};
