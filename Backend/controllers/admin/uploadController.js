// import { successResponse, errorResponse } from "../../utils/apiResponse.js";

// export const uploadImage = async (req, res) => {
//   try {
//     if (!req.file) {
//       return errorResponse(res, "Image file is required", 400);
//     }

//     const imageUrl = `/uploads/${req.file.filename}`;

//     return successResponse(res, "Image uploaded successfully", {
//       url: imageUrl,
//       filename: req.file.filename,
//       mimetype: req.file.mimetype,
//       size: req.file.size,
//     });
//   } catch (error) {
//     return errorResponse(res, error.message || "Image upload failed", 500);
//   }
// };




// import { v2 as cloudinary } from "cloudinary";

import { successResponse, errorResponse } from "../../utils/apiResponse.js";
import cloudinary from "../../config/cloudinary.js";

export const uploadImage = async (req, res) => {
  try {
    console.log("[Image Upload] Controller reached");

    if (!req.file) {
      console.log("[Image Upload] No file received");
      return errorResponse(res, "Image file is required", 400);
    }

    console.log("[Image Upload] File received:", {
      filename: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      hasBuffer: Boolean(req.file.buffer),
    });

    console.log("[Image Upload] Sending file to Cloudinary");

    const imageUrl = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "servynex",
          resource_type: "image",
        },
        (error, result) => {
          if (error) {
            console.error("[Image Upload] Cloudinary callback error:", error);
            return reject(error);
          }

          if (!result?.secure_url) {
            console.error("[Image Upload] Missing secure_url in result");
            return reject(new Error("Cloudinary did not return image URL."));
          }

          console.log("[Image Upload] Cloudinary upload successful");
          resolve(result.secure_url);
        }
      );

      uploadStream.on("error", (error) => {
        console.error("[Image Upload] Stream error:", error);
        reject(error);

      });

      uploadStream.end(req.file.buffer);
    });

    console.log("[Image Upload] Sending response to frontend");

    return successResponse(res, "Image uploaded successfully", {
      url: imageUrl,
      filename: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
    });
  } catch (error) {
    console.error("[Image Upload] Controller failed:", error);

    return errorResponse(
      res,
      "Image upload failed",
      500
    );
  }
};
