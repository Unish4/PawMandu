import { Request, Response, NextFunction } from "express";
import { cloudinary } from "../config/cloudinary";
import { ApiError } from "../utils/ApiError";
import { deleteCloudinaryImage } from "../services/cloudinary.service";

export const uploadProductImage = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.file) throw new ApiError(400, "No image file provided");

    const result = await new Promise<{ secure_url: string; public_id: string }>(
      (resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "petmandu/products" },
          (error, result) => {
            if (error || !result)
              return reject(error ?? new ApiError(502, "Image upload failed"));
            resolve(result);
          },
        );
        stream.end(req.file!.buffer);
      },
    );

    res.status(200).json({
      success: true,
      image: { url: result.secure_url, publicId: result.public_id },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProductImage = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const rawParam = Array.isArray(req.params.publicId)
      ? req.params.publicId[0]
      : req.params.publicId ||
        (Array.isArray(req.params[0]) ? req.params[0][0] : req.params[0]) ||
        (typeof req.query.publicId === "string"
          ? req.query.publicId
          : undefined) ||
        (typeof req.body?.publicId === "string"
          ? req.body.publicId
          : undefined);

    if (!rawParam || typeof rawParam !== "string" || !rawParam.trim()) {
      throw new ApiError(400, "Public ID is required");
    }

    let publicId: string;
    try {
      publicId = decodeURIComponent(rawParam);
    } catch {
      publicId = rawParam;
    }

    await deleteCloudinaryImage(publicId);
    res.status(200).json({ success: true, message: "Image deleted" });
  } catch (error) {
    next(error);
  }
};
