import Link from "next/link";
import { SocialLink, defaultNavigationData } from "@/types/navigation";
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
  } catch (error) {
    console.error("Error fetching social links:", error);
    return defaultNavigationData.socialLinks.filter((link) => link.isActive);
  }
}

const footerLinks = [
  { label: "About", href: "#about" },
  { label: "Expertise", href: "#expertise" },
  { label: "Projects", href: "#projects" },
  { label: "Blog", href: "#blog" },
  { label: "Contact", href: "#contact" },
];

export async function Footer() {
  const currentYear = new Date().getFullYear();
  const socialLinks = await getSocialLinks();

  return (
    <footer className="border-t border-border/60 bg-card/50 py-12">
      <div className="container">
        <div className="max-w-6xl mx-auto">
          {/* Top row */}
          <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8 mb-8">
            {/* Brand */}
            <div className="flex flex-col items-center md:items-start gap-3">
              <Link href="/" className="flex items-center gap-2.5 group">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold shadow-sm">
                  RI
                </div>
                <span className="font-semibold text-sm text-foreground">
                  Riazul Islam
                </span>
              </Link>
              <p className="text-xs text-muted-foreground max-w-[200px] text-center md:text-left">
                Full-stack developer building fast, beautiful web experiences.
              </p>
            </div>

            {/* Nav Links */}
            <nav className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2">
              {footerLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Social Links */}
            <ul className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <li key={social.id}>
                  <SocialLinkButton link={social} />
                </li>
              ))}
            </ul>
          </div>

          {/* Bottom row */}
          <div className="border-t border-border/40 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
            <p>
              &copy; {currentYear}{" "}
              <Link
                href="/"
                className="text-foreground hover:text-primary transition-colors duration-200 font-medium"
              >
                Md. Riazul Islam
              </Link>
              . All rights reserved.
            </p>
            <p>Built with Next.js &amp; Tailwind CSS</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
