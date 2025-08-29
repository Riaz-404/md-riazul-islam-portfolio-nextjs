import mongoose, { Schema, Document } from "mongoose";
import { NavigationData } from "@/types/navigation";

export interface INavigation extends Document, Omit<NavigationData, "id"> {
  id: string;
}

const SocialLinkSchema = new Schema({
  id: { type: String, required: true },
  href: { type: String, required: true },
  icon: { type: String, required: true },
  iconType: { type: String, enum: ["lucide", "image"], default: "lucide" },
  label: { type: String, required: true },
  order: { type: Number, required: true },
  isActive: { type: Boolean, required: true, default: true },
});

const NavigationSchema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    socialLinks: [SocialLinkSchema],
  },
  {
    timestamps: true,
  }
);

const Navigation =
  mongoose.models.Navigation ||
  mongoose.model<INavigation>("Navigation", NavigationSchema);

export default Navigation;
