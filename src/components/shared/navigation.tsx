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
  const pathname = usePathname();
  const router = useRouter();

  React.useEffect(() => {
    const fetchSocialLinks = async () => {
      try {
        const response = await fetch("/api/navigation");
        if (response.ok) {
          const data = await response.json();
          const plainSocialLinks =
            data.socialLinks?.map((link: any) => ({
              id: link.id,
              href: link.href,
              icon: link.icon,
              label: link.label,
              order: link.order,
              isActive: link.isActive,
            })) || [];
          setSocialLinks(plainSocialLinks);
        } else {
          throw new Error("Failed to fetch social links");
        }
      } catch {
        const { defaultNavigationData } = await import("@/types/navigation");
        setSocialLinks(defaultNavigationData.socialLinks);
      }
    };
    fetchSocialLinks();
  }, []);

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavigation = (href: string) => {
    if (!href.startsWith("#")) {
      router.push(href);
      return;
    }
    if (pathname !== "/") router.push("/");
    const element = document.querySelector(href);
    if (element) element.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const activeSocialLinks = socialLinks
    .filter((link: SocialLink) => link.isActive)
    .sort((a: SocialLink, b: SocialLink) => a.order - b.order);

  return (
    <motion.nav
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/85 backdrop-blur-xl border-b border-border/50 shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-16 lg:h-[72px]">

          {/* ── Logo ── */}
          <button
            onClick={() => handleNavigation("#home")}
            className="flex items-center gap-2.5 cursor-pointer shrink-0 group"
            aria-label="Go to home"
          >
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold tracking-wide shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all duration-200">
              RI
            </div>
            <span className="font-semibold text-foreground hidden sm:block text-sm tracking-tight">
              Riazul Islam
            </span>
          </button>

          {/* ── Desktop Nav Links (center) ── */}
          <nav className="hidden lg:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
            {staticNavigationLinks.map((link: StaticNavigationLink) => (
              <button
                key={link.id}
                onClick={() => handleNavigation(link.href)}
                className="relative px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 rounded-md hover:bg-muted/60 cursor-pointer"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* ── Right: Social + Theme Toggle ── */}
          <div className="flex items-center gap-2">
            {/* Social Icons (desktop) */}
            <div className="hidden lg:flex items-center gap-1">
              {activeSocialLinks.map((social: SocialLink) => (
                <motion.div
                  key={social.id}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <SocialLinkButton
                    link={social}
                    className="h-8 w-8 rounded-md opacity-70 hover:opacity-100 transition-opacity"
                  />
                </motion.div>
              ))}
            </div>

            <ThemeToggle />

            {/* Mobile Menu */}
            <div className="lg:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-9 w-9">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-72 pt-10">
                  <div className="flex flex-col gap-6">
                    {/* Mobile Logo */}
                    <div className="flex items-center gap-2.5 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
                        RI
                      </div>
                      <span className="font-semibold text-sm">Riazul Islam</span>
                    </div>

                    {/* Mobile Nav Links */}
                    <nav className="flex flex-col gap-1">
                      {staticNavigationLinks.map((link: StaticNavigationLink) => (
                        <button
                          key={link.id}
                          onClick={() => handleNavigation(link.href)}
                          className="px-4 py-3 text-sm font-medium text-left rounded-lg hover:bg-muted hover:text-foreground text-muted-foreground transition-colors duration-200 cursor-pointer"
                        >
                          {link.label}
                        </button>
                      ))}
                    </nav>

                    {/* Mobile Social Links */}
                    <div className="flex gap-3 pt-4 border-t border-border">
                      {activeSocialLinks.map((social: SocialLink) => (
                        <SocialLinkButton key={social.id} link={social} />
                      ))}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
