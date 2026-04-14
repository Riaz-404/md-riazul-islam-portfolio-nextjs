"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { SocialLinkButton } from "@/components/shared/social-link-button";
import {
  SocialLink,
  staticNavigationLinks,
  defaultNavigationData,
} from "@/types/navigation";

export function Navigation() {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);
  const [socialLinks, setSocialLinks] = React.useState<SocialLink[]>([]);
  const pathname = usePathname();
  const router = useRouter();

  React.useEffect(() => {
    const fetchSocialLinks = async () => {
      try {
        const response = await fetch("/api/navigation");
        if (response.ok) {
          const data = await response.json();
          const plainLinks =
            data.socialLinks?.map((link: SocialLink) => ({
              id: link.id,
              href: link.href,
              icon: link.icon,
              label: link.label,
              order: link.order,
              isActive: link.isActive,
            })) || [];
          setSocialLinks(plainLinks);
        } else {
          throw new Error("Failed");
        }
      } catch {
        setSocialLinks(defaultNavigationData.socialLinks);
      }
    };
    fetchSocialLinks();
  }, []);

  React.useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  React.useEffect(() => {
    document.body.style.overflow = isMobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileOpen]);

  const handleNavigation = (href: string) => {
    setIsMobileOpen(false);
    if (!href.startsWith("#")) {
      router.push(href);
      return;
    }
    if (pathname !== "/") {
      router.push("/");
      setTimeout(() => {
        document
          .querySelector(href)
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
      return;
    }
    document
      .querySelector(href)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const activeSocialLinks = socialLinks
    .filter((l) => l.isActive)
    .sort((a, b) => a.order - b.order);

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-background/80 backdrop-blur-xl border-b border-border/60 shadow-[0_1px_0_0_var(--border)]"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-6xl mx-auto px-5 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand monogram */}
            <button
              onClick={() => handleNavigation("#home")}
              className="flex items-center gap-2.5 group cursor-pointer"
              aria-label="Go to home"
            >
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm tracking-tight transition-all duration-200 group-hover:scale-110 group-hover:shadow-[0_0_16px_var(--primary)] shadow-sm">
                RI
              </div>
              <span className="hidden sm:block font-semibold text-sm text-foreground/70 group-hover:text-foreground transition-colors duration-200">
                Riazul Islam
              </span>
            </button>

            {/* Desktop navigation links */}
            <nav className="hidden lg:flex items-center gap-0.5">
              {staticNavigationLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => handleNavigation(link.href)}
                  className="px-3.5 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 rounded-lg hover:bg-muted/60 cursor-pointer"
                >
                  {link.label}
                </button>
              ))}
            </nav>

            {/* Right cluster */}
            <div className="flex items-center gap-2">
              {/* Social icons — desktop */}
              <div className="hidden lg:flex items-center gap-0.5">
                {activeSocialLinks.slice(0, 3).map((social) => (
                  <div
                    key={social.id}
                    className="opacity-50 hover:opacity-100 transition-opacity duration-200"
                  >
                    <SocialLinkButton
                      link={social}
                      className="h-8 w-8 rounded-lg"
                    />
                  </div>
                ))}
              </div>

              <ThemeToggle />

              <Button
                size="sm"
                className="hidden lg:inline-flex items-center gap-1.5 h-8 px-3.5 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 shadow-sm"
                onClick={() => handleNavigation("#contact")}
              >
                Hire Me
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Button>

              {/* Mobile hamburger */}
              <button
                className="lg:hidden p-2 -mr-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors cursor-pointer"
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                aria-label={isMobileOpen ? "Close menu" : "Open menu"}
              >
                {isMobileOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile fullscreen menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-background/60 backdrop-blur-sm"
              onClick={() => setIsMobileOpen(false)}
            />

            {/* Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{
                duration: 0.28,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              className="absolute right-0 top-0 bottom-0 w-72 bg-background border-l border-border/60 flex flex-col shadow-2xl"
            >
              {/* Panel header */}
              <div className="flex items-center justify-between p-5 border-b border-border/60">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                    RI
                  </div>
                  <span className="font-semibold text-sm">Riazul Islam</span>
                </div>
                <button
                  onClick={() => setIsMobileOpen(false)}
                  className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Nav links */}
              <nav className="flex-1 p-4 space-y-0.5 overflow-y-auto">
                {staticNavigationLinks.map((link, i) => (
                  <motion.button
                    key={link.id}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.2 }}
                    onClick={() => handleNavigation(link.href)}
                    className="w-full text-left px-4 py-3 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 rounded-xl transition-colors cursor-pointer"
                  >
                    {link.label}
                  </motion.button>
                ))}
              </nav>

              {/* Panel footer */}
              <div className="p-5 border-t border-border/60 space-y-4">
                <div className="flex items-center gap-2">
                  {activeSocialLinks.map((social) => (
                    <div
                      key={social.id}
                      className="opacity-60 hover:opacity-100 transition-opacity"
                    >
                      <SocialLinkButton link={social} />
                    </div>
                  ))}
                </div>
                <Button
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
                  onClick={() => handleNavigation("#contact")}
                >
                  Hire Me
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
