import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export { cloudinary };

export const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME ?? "dq3js5be6";

/** Upload a base64 or URL image to Cloudinary under the products folder */
export async function uploadProductImage(
  source: string,
  publicId?: string
): Promise<string> {
  const result = await cloudinary.uploader.upload(source, {
    folder: "spas-super-store/products",
    public_id: publicId,
    overwrite: true,
    transformation: [
      { width: 800, height: 800, crop: "fill", gravity: "auto" },
      { fetch_format: "auto", quality: "auto" },
    ],
  });
  return result.secure_url;
}

/** Delete an image from Cloudinary by its public ID */
export async function deleteProductImage(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId);
}
