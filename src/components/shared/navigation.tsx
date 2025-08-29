"use client";

import * as React from "react";
import { motion } from "motion/react";
import { Menu } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { SocialLinkButton } from "@/components/shared/social-link-button";
import {
  SocialLink,
  staticNavigationLinks,
  StaticNavigationLink,
} from "@/types/navigation";

export function Navigation() {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [socialLinks, setSocialLinks] = React.useState<SocialLink[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const pathname = usePathname();
  const router = useRouter();

  // Fetch social links data
  React.useEffect(() => {
    const fetchSocialLinks = async () => {
      try {
        const response = await fetch("/api/navigation");
        if (response.ok) {
          const data = await response.json();
          // Ensure plain objects
          const plainSocialLinks =
            data.socialLinks?.map((link: any) => ({
              id: link.id,
              href: link.href,
              icon: link.icon,
              label: link.label,
              order: link.order,
              isActive: link.isActive,
              iconType: link.iconType || "lucide",
              imageUrl: link.imageUrl || "",
            })) || [];
          setSocialLinks(plainSocialLinks);
        } else {
          throw new Error("Failed to fetch social links");
        }
      } catch (error) {
        console.error("Error fetching social links:", error);
        // Set default social links as fallback
        const { defaultNavigationData } = await import("@/types/navigation");
        setSocialLinks(defaultNavigationData.socialLinks);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSocialLinks();
  }, []);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavigation = (href: string) => {
    if (pathname !== "/") {
      router.push("/");
    }

    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  if (isLoading) {
    return (
      <nav className="fixed top-0 w-full z-50 bg-transparent">
        <div className="container">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <div className="w-6 h-6 bg-gray-300 animate-pulse rounded"></div>
            <div className="hidden lg:flex space-x-8">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="w-16 h-4 bg-gray-300 animate-pulse rounded"
                ></div>
              ))}
            </div>
            <ThemeToggle />
          </div>
        </div>
      </nav>
    );
  }

  // Filter and sort active social links
  const activeSocialLinks = socialLinks
    .filter((link: SocialLink) => link.isActive)
    .sort((a: SocialLink, b: SocialLink) => a.order - b.order);
  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/95 backdrop-blur-md border-b border-border"
          : "bg-transparent"
      }`}
    >
      <div className="container">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Mobile Menu */}
          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-10 w-10">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80">
                <div className="flex flex-col space-y-6 mt-8">
                  <nav className="flex flex-col space-y-4">
                    {staticNavigationLinks.map((link: StaticNavigationLink) => (
                      <button
                        key={link.id}
                        className="relative text-foreground hover:text-primary transition-colors duration-200 font-medium text-lg py-3 group text-center"
                        onClick={() => handleNavigation(link.href)}
                      >
                        {link.label}
                        {/* Bottom border on hover */}
                        <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-primary transition-all duration-200 group-hover:w-full"></span>
                      </button>
                    ))}
                  </nav>

                  {/* Social Links */}
                  <div className="flex justify-center space-x-4 pt-6 border-t border-border">
                    {activeSocialLinks.map((social: SocialLink) => (
                      <SocialLinkButton key={social.id} link={social} />
                    ))}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center justify-between w-full">
            {/* Navigation Links */}
            <nav className="flex items-center space-x-4">
              {staticNavigationLinks.map((link: StaticNavigationLink) => (
                <motion.button
                  key={link.id}
                  onClick={() => handleNavigation(link.href)}
                  className="relative text-foreground hover:text-primary transition-colors duration-200 font-medium cursor-pointer pb-2 group text-lg px-4 py-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {link.label}
                  {/* Bottom border on hover */}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-200 group-hover:w-full"></span>
                </motion.button>
              ))}
            </nav>

            {/* Right side - Social Links & Theme Toggle */}
            <div className="flex items-center space-x-4">
              {/* Social Links */}
              <div className="flex items-center space-x-2">
                {activeSocialLinks.map((social: SocialLink) => (
                  <motion.div
                    key={social.id}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <SocialLinkButton
                      link={social}
                      className="h-9 w-9 rounded-full"
                    />
                  </motion.div>
                ))}
              </div>

              {/* Theme Toggle */}
              <ThemeToggle />
            </div>
          </div>

          {/* Mobile Theme Toggle */}
          <div className="lg:hidden">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
