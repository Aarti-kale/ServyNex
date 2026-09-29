import express from "express";

import {
  getContactInfo,
  submitContactMessage,
  getContactPage,
} from "../../controllers/website/contactController.js";

const router = express.Router();
router.get("/", getContactPage);
router.get("/info", getContactInfo);

router.post("/message", submitContactMessage);

export default router;
