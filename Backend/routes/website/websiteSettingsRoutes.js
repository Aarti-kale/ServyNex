import express from "express";

import { getWebsiteSettings } from "../../controllers/website/websiteSettingsController.js";

const router = express.Router();

router.get("/", getWebsiteSettings);

export default router;
