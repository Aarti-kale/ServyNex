import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";
import { body } from "express-validator";
import { validate } from "../middleware/validationMiddleware.js";
const router = express.Router();

router.post(
  "/register",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  validate,
  registerUser
);
router.post("/login", loginUser);

export default router;
