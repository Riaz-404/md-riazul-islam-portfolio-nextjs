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
      iconType: link.iconType || "lucide",
      imageUrl: link.imageUrl || "",
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
    <footer className="footer">
      <div className="container">
        <div className="row align-items-center text-center text-lg-left">
          <div className="col-lg-4">
            <ul className="list-inline footer-socials">
              {socialLinks.map((social) => (
                <li key={social.id} className="list-inline-item mx-3">
                  <SocialLinkButton link={social} />
                </li>
              ))}
            </ul>
          </div>
          <div className="col-lg-4">
            <div>
              <p>
                Designed by{" "}
                <Link href="#top" className="smoth-scroll">
                  <span>Md. Riazul Islam</span>
                </Link>
              </p>
            </div>
          </div>
          <div className="col-lg-4">
            <p>&copy; {currentYear} All Rights Reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
