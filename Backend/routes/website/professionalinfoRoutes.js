import express from "express";

import {
  getWorkersOverview,
  getFeaturedWorkers,
  getAllWorkers,
  getPublicWorkerById,
} from "../../controllers/website/ProfessionalsInfoController.js";

const router = express.Router();

router.get("/overview", getWorkersOverview);

router.get("/featured", getFeaturedWorkers);

router.get("/", getAllWorkers);
router.get("/:id", getPublicWorkerById);

export default router;
