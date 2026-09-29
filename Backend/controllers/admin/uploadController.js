import { successResponse, errorResponse } from "../../utils/apiResponse.js";

export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return errorResponse(res, "Image file is required", 400);
    }

    const imageUrl = `/uploads/${req.file.filename}`;

    return successResponse(res, "Image uploaded successfully", {
      url: imageUrl,
      filename: req.file.filename,
      mimetype: req.file.mimetype,
      size: req.file.size,
    });
  } catch (error) {
    return errorResponse(res, error.message || "Image upload failed", 500);
  }
};
