import express from "express";

import { getAboutPage } from "../../controllers/website/aboutController.js";

const router = express.Router();

router.get("/", getAboutPage);

export default router;
