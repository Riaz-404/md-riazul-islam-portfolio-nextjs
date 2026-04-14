import { mongoDBConnection } from "@/databases/db-connection";
import { Publication } from "@/models/Publication";
import { PublicationData } from "@/types/publication";
import { toPlain } from "./serialize";

export class PublicationService {
  private serialize(pub: any): PublicationData {
    return toPlain(pub);
  }

  async getPublications(includeInactive = false): Promise<PublicationData[]> {
    await mongoDBConnection();
    try {
      const query = includeInactive ? {} : { isActive: { $ne: false } };
      const pubs = await Publication.find(query)
        .sort({ year: -1, order: 1 })
        .lean();
      return pubs.map((p: any) =>
        this.serialize(p)
      );
    } catch (error) {
      console.error("Error fetching publications:", error);
      throw new Error("Failed to fetch publications");
    }
  }

  async getPublicationCount(): Promise<number> {
    await mongoDBConnection();
    try {
      return await Publication.countDocuments({});
    } catch (error) {
      console.error("Error counting publications:", error);
      return 0;
    }
  }

  async getPublicationById(id: string): Promise<PublicationData | null> {
    await mongoDBConnection();
    try {
      const pub: any = await Publication.findById(id).lean();
      if (!pub) return null;
      return this.serialize(pub);
    } catch (error) {
      throw new Error("Failed to fetch publication");
    }
  }

  async createPublication(
    data: Omit<PublicationData, "_id" | "createdAt" | "updatedAt">
  ): Promise<PublicationData> {
    await mongoDBConnection();
    try {
      const pub = new Publication(data);
      await pub.save();
      return this.serialize(pub.toObject());
    } catch (error) {
      console.error("Error creating publication:", error);
      throw new Error("Failed to create publication");
    }
  }

  async updatePublication(
    id: string,
    data: Partial<PublicationData>
  ): Promise<PublicationData | null> {
    await mongoDBConnection();
    try {
      const updated: any = await Publication.findByIdAndUpdate(id, data, {
        new: true,
      }).lean();
      if (!updated) return null;
      return this.serialize(updated);
    } catch (error) {
      throw new Error("Failed to update publication");
    }
  }

  async toggleActive(id: string, isActive: boolean): Promise<PublicationData | null> {
    await mongoDBConnection();
    const updated: any = await Publication.findByIdAndUpdate(id, { isActive }, { new: true }).lean();
    if (!updated) return null;
    return this.serialize(updated);
  }

  async deletePublication(id: string): Promise<boolean> {
    await mongoDBConnection();
    try {
      const result = await Publication.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      throw new Error("Failed to delete publication");
    }
  }
}
