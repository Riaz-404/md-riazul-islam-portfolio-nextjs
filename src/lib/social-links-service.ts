import { SocialLink, defaultNavigationData } from "@/types/navigation";
import { NavigationService } from "./navigation-service";

export class SocialLinksService {
  static async getSocialLinks(): Promise<SocialLink[]> {
    try {
      const navigation = await NavigationService.getNavigation();
      return navigation?.socialLinks || defaultNavigationData.socialLinks;
    } catch (error) {
      console.error("Error fetching social links:", error);
      return defaultNavigationData.socialLinks;
    }
  }
}
