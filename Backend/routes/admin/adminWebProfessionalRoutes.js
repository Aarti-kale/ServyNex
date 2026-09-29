import express from "express";

import { protect, authorizeRoles } from "../../middleware/authMiddleware.js";

import {
  getAdminProfessionalHero,
  updateAdminProfessionalHero,
  resetAdminProfessionalHero,
  deleteAdminProfessionalHero,
  getAdminProfessionalStandards,
  updateAdminProfessionalStandards,
  resetAdminProfessionalStandards,
  deleteAdminProfessionalStandards,
  getAdminProfessionalVerificationProcess,
  updateAdminProfessionalVerificationProcess,
  resetAdminProfessionalVerificationProcess,
  deleteAdminProfessionalVerificationProcess,
  getAdminBecomeProfessional,
  updateAdminBecomeProfessional,
  resetAdminBecomeProfessional,
  deleteAdminBecomeProfessional,
} from "../../controllers/admin/adminWebProfessionalController.js";

const router = express.Router();

router.use(protect, authorizeRoles("admin"));

router.get("/", getAdminProfessionalHero);

router.put("/", updateAdminProfessionalHero);

router.put("/reset", resetAdminProfessionalHero);

router.delete("/", deleteAdminProfessionalHero);

router.get("/standards", getAdminProfessionalStandards);

router.put("/standards", updateAdminProfessionalStandards);

router.put("/standards/reset", resetAdminProfessionalStandards);

router.delete("/standards", deleteAdminProfessionalStandards);

router.get("/verification-process", getAdminProfessionalVerificationProcess);

router.put("/verification-process", updateAdminProfessionalVerificationProcess);

router.put(
  "/verification-process/reset",
  resetAdminProfessionalVerificationProcess
);

router.delete(
  "/verification-process",
  deleteAdminProfessionalVerificationProcess
);

router.get("/become-professional", getAdminBecomeProfessional);

router.put("/become-professional", updateAdminBecomeProfessional);

router.put("/become-professional/reset", resetAdminBecomeProfessional);

router.delete("/become-professional", deleteAdminBecomeProfessional);
export default router;
