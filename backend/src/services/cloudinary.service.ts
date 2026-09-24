import { cloudinary } from "../config/cloudinary";

export async function deleteCloudinaryImage(publicId: string): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error(`Failed to delete Cloudinary image ${publicId}:`, error);
    throw error;
  }
}
