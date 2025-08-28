import { mongoDBConnection } from "@/databases/db-connection";
import Hero from "@/models/Hero";
import { HeroData } from "@/types/hero";

export async function getHeroData(): Promise<HeroData | null> {
  try {
    await mongoDBConnection();
    const hero = await Hero.findOne().sort({ createdAt: -1 }).lean();

    if (!hero) {
      return null;
    }

    // Type assertion for lean query result
    const heroData = hero as any;

    return {
      id: heroData.id,
      name: heroData.name,
      rotatingTexts: heroData.rotatingTexts,
      description: heroData.description,
      profileImage: heroData.profileImage,
      cvDownloadUrl: heroData.cvDownloadUrl,
      techIcons: heroData.techIcons,
      createdAt: heroData.createdAt,
      updatedAt: heroData.updatedAt,
    };
  } catch (error) {
    console.error("Error fetching hero data:", error);
    return null;
  }
}

export async function updateHeroData(
  data: Omit<HeroData, "id" | "createdAt" | "updatedAt">
): Promise<HeroData | null> {
  try {
    await mongoDBConnection();

    // Find existing hero or create new one
    let hero = await Hero.findOne().sort({ createdAt: -1 });

    if (hero) {
      // Update existing hero
      hero.name = data.name;
      hero.rotatingTexts = data.rotatingTexts;
      hero.description = data.description;
      hero.profileImage = data.profileImage;
      hero.cvDownloadUrl = data.cvDownloadUrl;
      hero.techIcons = data.techIcons;
      await hero.save();
    } else {
      // Create new hero
      hero = new Hero({
        id: "hero-1",
        ...data,
      });
      await hero.save();
    }

    return {
      id: hero.id,
      name: hero.name,
      rotatingTexts: hero.rotatingTexts,
      description: hero.description,
      profileImage: hero.profileImage,
      cvDownloadUrl: hero.cvDownloadUrl,
      techIcons: hero.techIcons,
      createdAt: hero.createdAt,
      updatedAt: hero.updatedAt,
    };
  } catch (error) {
    console.error("Error updating hero data:", error);
    return null;
  }
}
