import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
});

export interface CloudinaryUploadResult {
  url: string;
  publicId: string;
}

export class CloudinaryService {
  static async uploadImage(
    file: Buffer,
    folder: string = "projects",
    filename?: string
  ): Promise<CloudinaryUploadResult> {
    return new Promise((resolve, reject) => {
      const uploadOptions: any = {
        resource_type: "image",
        folder: `portfolio/${folder}`,
        transformation: [
          { width: 1200, height: 1200, crop: "limit" },
          { quality: "auto", fetch_format: "auto" },
        ],
      };

      if (filename) {
        uploadOptions.public_id = filename.replace(/\.[^/.]+$/, ""); // Remove extension
      }

      cloudinary.uploader
        .upload_stream(uploadOptions, (error, result) => {
          if (error) {
            reject(error);
          } else if (result) {
            resolve({
              url: result.secure_url,
              publicId: result.public_id,
            });
          } else {
            reject(new Error("Upload failed"));
          }
        })
        .end(file);
    });
  }

  static async deleteImage(publicId: string): Promise<void> {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.error("Error deleting image from Cloudinary:", error);
      // Don't throw error as this is cleanup - log and continue
    }
  }

  static async uploadMultipleImages(
    files: Array<{ data: Buffer; name: string }>,
    folder: string = "projects"
  ): Promise<CloudinaryUploadResult[]> {
    const uploadPromises = files.map((file) =>
      this.uploadImage(file.data, folder, file.name)
    );

    return Promise.all(uploadPromises);
  }
}
