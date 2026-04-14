import Link from "next/link";
import { SocialLink, defaultNavigationData, staticNavigationLinks } from "@/types/navigation";
import { NavigationService } from "@/lib/navigation-service";
import { SocialLinkButton } from "./social-link-button";

async function getSocialLinks(): Promise<SocialLink[]> {
  try {
    const navigation = await NavigationService.getNavigation();
    const links =
      navigation?.socialLinks?.filter((link: SocialLink) => link.isActive) ||
      defaultNavigationData.socialLinks;
    return links.map((link) => ({
      id: link.id,
      href: link.href,
      icon: link.icon,
      label: link.label,
      order: link.order,
      isActive: link.isActive,
    }));
  } catch {
    return defaultNavigationData.socialLinks.filter((l) => l.isActive);
  }
}

export async function Footer() {
  const currentYear = new Date().getFullYear();
  const socialLinks = await getSocialLinks();

  return (
    <footer className="bg-background border-t border-border/60">
      <div className="max-w-6xl mx-auto px-5 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                RI
              </div>
              <span className="font-semibold text-foreground">Riazul Islam</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Full Stack Engineer building scalable web applications with a
              focus on performance and clean architecture.
            </p>
            <div className="flex items-center gap-2">
              {socialLinks.map((social) => (
                <div
                  key={social.id}
                  className="opacity-50 hover:opacity-100 transition-opacity duration-200"
                >
                  <SocialLinkButton link={social} className="h-8 w-8 rounded-lg" />
                </div>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
              Navigation
            </h4>
            <ul className="space-y-2.5">
              {staticNavigationLinks.map((link) => (
                <li key={link.id}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Availability card */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
              Status
            </h4>
            <div className="rounded-xl border border-border/60 bg-card p-4 space-y-3">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                </span>
                <span className="text-sm font-semibold text-foreground">
                  Available for hire
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Open to full-time roles, contract work, and freelance projects.
                Remote-first.
              </p>
              <Link
                href="#contact"
                className="inline-flex items-center text-xs font-semibold text-primary hover:underline underline-offset-2"
              >
                Get in touch →
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>
            &copy; {currentYear}{" "}
            <Link
              href="/"
              className="text-foreground font-medium hover:text-primary transition-colors"
            >
              Md. Riazul Islam
            </Link>
            . All rights reserved.
          </p>
          <p className="text-muted-foreground/60">
            Designed & built with Next.js + Tailwind
          </p>
        </div>
      </div>
    </footer>
  );
}
