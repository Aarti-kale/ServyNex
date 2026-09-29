import express from "express";

import { getServiceHero } from "../../controllers/website/serviceController.js";

const router = express.Router();

router.get("/", getServiceHero);

export default router;
