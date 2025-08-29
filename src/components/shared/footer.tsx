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

    // Ensure plain objects
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

export async function Footer() {
  const currentYear = new Date().getFullYear();
  const socialLinks = await getSocialLinks();

  return (
    <footer className="bg-card border-t border-border py-20 lg:py-16 transition-colors">
      <div className="container-custom">
        <div className="flex flex-col lg:flex-row items-center justify-between text-center lg:text-left gap-8 lg:gap-4">
          <div className="lg:flex-1">
            <ul className="flex justify-center lg:justify-start items-center gap-4">
              {socialLinks.map((social) => (
                <li key={social.id}>
                  <SocialLinkButton
                    link={social}
                  />
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:flex-1 lg:text-center">
            <p className="text-muted-foreground">
              Designed by{" "}
              <Link
                href="#top"
                className="text-primary hover:text-accent transition-colors duration-300 font-medium"
              >
                Md. Riazul Islam
              </Link>
            </p>
          </div>
          <div className="lg:flex-1 lg:text-right">
            <p className="text-muted-foreground">
              &copy; {currentYear} All Rights Reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
