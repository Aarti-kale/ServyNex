import express from "express";

import { getHomepage } from "../../controllers/website/homeController.js";

const router = express.Router();

router.get("/", getHomepage);

export default router;
