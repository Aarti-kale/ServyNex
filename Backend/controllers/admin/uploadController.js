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
    if (!req.file) {
      return errorResponse(res, "Image file is required", 400);
    }

    const imageUrl = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "servynex",
          resource_type: "image",
        },
        (error, result) => {
          if (error) {
            return reject(error);
          }

          if (!result?.secure_url) {
            return reject(new Error("Cloudinary did not return image URL."));
          }

          resolve(result.secure_url);
        }
      );

      uploadStream.end(req.file.buffer);
    });

    return successResponse(res, "Image uploaded successfully", {
      url: imageUrl,
      filename: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
    });
  } catch (error) {
    console.error("Cloudinary image upload error:", error);

    return errorResponse(
      res,
      error.message || "Image upload failed",
      500
    );
  }
};
