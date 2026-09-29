import SiteSettings from "../../models/siteSettings.js";

import { successResponse, errorResponse } from "../../utils/apiResponse.js";

export const getWebsiteSettings = async (req, res) => {
  try {
    const settings = await SiteSettings.findOne({
      key: "global",
    })
      .select("navbar footer")
      .lean();

    if (!settings) {
      return errorResponse(res, "Website settings not found", 404);
    }

    return successResponse(
      res,
      "Website settings fetched successfully",
      settings
    );
  } catch (error) {
    console.error("getWebsiteSettings error:", error);

    return errorResponse(res, "Failed to fetch website settings", 500);
  }
};
