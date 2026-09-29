import express from "express";

import authRoutes from "./authRoutes.js";
import userRoutes from "./website/userRoutes.js";

import uploadRoutes from "./admin/uploadRoutes.js";
import adminRoutes from "./admin/adminRoutes.js";
import admincustomerRoutes from "./admin/admincustomerRoutes.js";
import adminWorkerRoutes from "./admin/adminWorkerRoutes.js";
import adminBookingRoutes from "./admin/adminBookingRoutes.js";
import adminServiceRoutes from "./admin/adminServiceRoutes.js";
import adminWebServiceRoutes from "./admin/adminWebServiceRoutes.js";
import adminCategoryRoutes from "./admin/adminCategoryRoutes.js";
import adminReviewRoutes from "./admin/adminReviewRoutes.js";
import adminPaymentRoutes from "./admin/adminPaymentRoutes.js";
import adminReportRoutes from "./admin/adminReportRoutes.js";
import adminProfileRoutes from "./admin/adminProfileRoutes.js";
import adminwebhomeRoutes from "./admin/adminwebhomeRoutes.js";
import adminAboutRoutes from "./admin/adminAboutRoutes.js";
import adminContactRoutes from "./admin/adminContactRoutes.js";
import adminwebSettingsRoutes from "./admin/adminwebSettingsRoutes.js";
import adminWebProfessionalRoutes from "./admin/adminWebProfessionalRoutes.js";

import userworkerRoutes from "./website/userworkerRoutes.js";

import categoryRoutes from "./website/categoryRoutes.js";
import bookingRoutes from "./website/bookingRoutes.js";
import serviceRoutes from "./website/serviceRoutes.js";
import professionalInfoRoutes from "./website/professionalinfoRoutes.js";
import aboutRoutes from "./website/aboutRoutes.js";
import contactRoutes from "./website/contactRoutes.js";
import homeContentRoutes from "./website/homeContentRoutes.js";
import websiteSettingsRoutes from "./website/websiteSettingsRoutes.js";
import serviceHeroRoutes from "./website/serviceHeroRoutes.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);

router.use("/admin/upload", uploadRoutes);
router.use("/admin", adminRoutes);
router.use("/admin/customers", admincustomerRoutes);
router.use("/admin/workers", adminWorkerRoutes);
router.use("/admin/bookings", adminBookingRoutes);
router.use("/admin/services", adminServiceRoutes);
router.use("/admin/web-services", adminWebServiceRoutes);
router.use("/admin/categories", adminCategoryRoutes);
router.use("/admin/reviews", adminReviewRoutes);
router.use("/admin/payments", adminPaymentRoutes);
router.use("/admin/reports", adminReportRoutes);
router.use("/admin/profile", adminProfileRoutes);
router.use("/admin/webhome", adminwebhomeRoutes);
router.use("/admin/professional", adminWebProfessionalRoutes);
router.use("/admin/contact", adminContactRoutes);
router.use("/admin/about", adminAboutRoutes);
router.use("/admin/site-settings", adminwebSettingsRoutes);

router.use("/workers", userworkerRoutes);

router.use("/categories", categoryRoutes);
router.use("/bookings", bookingRoutes);
router.use("/services", serviceRoutes);
router.use("/service-hero", serviceHeroRoutes);
router.use("/professionalinfo", professionalInfoRoutes);
router.use("/about", aboutRoutes);
router.use("/contact", contactRoutes);
router.use("/homecontent", homeContentRoutes);
router.use("/site-settings", websiteSettingsRoutes);

router.use("/customerprofile", userRoutes);
export default router;
