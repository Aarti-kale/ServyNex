import express from "express";

import {
  getPublicCategories,
  getPublicCategoryById,
} from "../../controllers/website/categoryController.js";

const router = express.Router();

router.get("/", getPublicCategories);

router.get("/:id", getPublicCategoryById);

export default router;
