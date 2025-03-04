import type { NextApiRequest, NextApiResponse } from "next";
import multer from "multer";
import cloudinary from "cloudinary";
import streamifier from "streamifier"; // Needed for streaming file buffers

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer setup (middleware isn't directly supported in Next.js API routes)
const storage = multer.memoryStorage();
const upload = multer({ storage });

export const config = {
  api: {
    bodyParser: false, // Disable default Next.js body parsing for FormData
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    // Parse file from FormData using a custom handler
    await new Promise<void>((resolve, reject) => {
      upload.single("file")(req as any, {} as any, (err: any) => {
        if (err) return reject(err);
        resolve();
      });
    });

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const uploadToCloudinary = (buffer: Buffer): Promise<string> => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.v2.uploader.upload_stream(
          { resource_type: "image" },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result?.secure_url || "");
            }
          }
        );
        streamifier.createReadStream(buffer).pipe(stream);
      });
    };

    const imageUrl = await uploadToCloudinary(req.file.buffer);
    return res.status(200).json({ imageUrl });
  } catch (error) {
    console.error("Upload Error:", error);
    return res.status(500).json({ error: "Failed to upload image" });
  }
}
