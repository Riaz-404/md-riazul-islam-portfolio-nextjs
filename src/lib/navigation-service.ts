import { mongoDBConnection } from "@/databases/db-connection";
import Navigation from "@/models/Navigation";
import { NavigationData } from "@/types/navigation";

export class NavigationService {
  static async getNavigation(): Promise<NavigationData | null> {
    try {
      await mongoDBConnection();
      const navigation = await Navigation.findOne()
        .sort({ createdAt: -1 })
        .lean();

      if (!navigation) {
        return null;
      }

      // Type assertion for lean query result
      const navigationData = navigation as any;

      return {
        id: navigationData.id,
        socialLinks: navigationData.socialLinks.map((link: any) => ({
          id: link.id,
          href: link.href,
          icon: link.icon,
          label: link.label,
          order: link.order,
          isActive: link.isActive,
        })),
        createdAt: navigationData.createdAt,
        updatedAt: navigationData.updatedAt,
      };
    } catch (error) {
      console.error("Error fetching navigation:", error);
      return null;
    }
  }

  static async createNavigation(
    navigationData: Omit<NavigationData, "id" | "createdAt" | "updatedAt">
  ): Promise<NavigationData> {
    try {
      await mongoDBConnection();
      const newNavigation = new Navigation({
        id: `navigation-${Date.now()}`,
        ...navigationData,
      });

      await newNavigation.save();

      return {
        id: newNavigation.id,
        socialLinks: newNavigation.socialLinks.map((link: any) => ({
          id: link.id,
          href: link.href,
          icon: link.icon,
          label: link.label,
          order: link.order,
          isActive: link.isActive,
        })),
        createdAt: newNavigation.createdAt,
        updatedAt: newNavigation.updatedAt,
      };
    } catch (error) {
      console.error("Error creating navigation:", error);
      throw error;
    }
  }

  static async updateNavigation(
    navigationData: Omit<NavigationData, "createdAt" | "updatedAt">
  ): Promise<NavigationData> {
    try {
      await mongoDBConnection();

      const updatedNavigation = await Navigation.findOneAndUpdate(
        { id: navigationData.id },
        navigationData,
        { new: true, upsert: true }
      );

      if (!updatedNavigation) {
        throw new Error("Failed to update navigation");
      }

      return {
        id: updatedNavigation.id,
        socialLinks: updatedNavigation.socialLinks.map((link: any) => ({
          id: link.id,
          href: link.href,
          icon: link.icon,
          label: link.label,
          order: link.order,
          isActive: link.isActive,
        })),
        createdAt: updatedNavigation.createdAt,
        updatedAt: updatedNavigation.updatedAt,
      };
    } catch (error) {
      console.error("Error updating navigation:", error);
      throw error;
    }
  }

  static async deleteNavigation(id: string): Promise<boolean> {
    try {
      await mongoDBConnection();
      const result = await Navigation.deleteOne({ id });
      return result.deletedCount > 0;
    } catch (error) {
      console.error("Error deleting navigation:", error);
      return false;
    }
  }
}
