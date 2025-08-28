"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Menu, X, Facebook, Linkedin, Github } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/shared/theme-toggle";

const navigationLinks = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#skillbar", label: "Expertise" },
  { href: "#projects", label: "Projects" },
  { href: "#contact", label: "Contact" },
];

const socialLinks = [
  {
    href: "https://www.facebook.com/imriaz.cu/",
    icon: Facebook,
    label: "Facebook",
  },
  {
    href: "https://www.linkedin.com/in/md-riazul-islam-891b65194/",
    icon: Linkedin,
    label: "LinkedIn",
  },
  {
    href: "https://github.com/Riaz-404",
    icon: Github,
    label: "GitHub",
  },
];

export function Navigation() {
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (href: string) => {
    if (href.startsWith("#")) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

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
      <div className="container mx-auto px-4">
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
                    {navigationLinks.map((link) => (
                      <Button
                        key={link.href}
                        variant="ghost"
                        className="justify-start text-lg font-medium"
                        onClick={() => scrollToSection(link.href)}
                      >
                        {link.label}
                      </Button>
                    ))}
                  </nav>

                  {/* Social Links */}
                  <div className="flex space-x-4 pt-6 border-t border-border">
                    {socialLinks.map((social) => {
                      const Icon = social.icon;
                      return (
                        <Button
                          key={social.href}
                          variant="ghost"
                          size="icon"
                          asChild
                        >
                          <a
                            href={social.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={social.label}
                          >
                            <Icon className="h-5 w-5" />
                          </a>
                        </Button>
                      );
                    })}
                  </div>

                  {/* Theme Toggle */}
                  <div className="pt-4">
                    <ThemeToggle />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center justify-between w-full">
            {/* Navigation Links */}
            <nav className="flex items-center space-x-8">
              {navigationLinks.map((link) => (
                <motion.button
                  key={link.href}
                  onClick={() => scrollToSection(link.href)}
                  className="text-foreground hover:text-primary transition-colors duration-200 font-medium"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {link.label}
                </motion.button>
              ))}
            </nav>

            {/* Right side - Social Links & Theme Toggle */}
            <div className="flex items-center space-x-4">
              {/* Social Links */}
              <div className="flex items-center space-x-2">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <motion.div
                      key={social.href}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 rounded-full"
                        asChild
                      >
                        <a
                          href={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={social.label}
                        >
                          <Icon className="h-4 w-4" />
                        </a>
                      </Button>
                    </motion.div>
                  );
                })}
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
