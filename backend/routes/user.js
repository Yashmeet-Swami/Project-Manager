import express from "express";
import authenticateUser from "../middleware/auth-middleware.js";
import {
  changePassword,
  getUserProfile,
  updateUserProfile,
  uploadProfilePhoto
} from "../controllers/user.js";
import { validateRequest } from "zod-express-middleware";
import { z } from "zod";
import upload from "../multer-config.js";

const router = express.Router();

// GET User profile
router.get("/profile", authenticateUser, getUserProfile);

// PUT Update profile info
router.put(
  "/profile",
  authenticateUser,
  validateRequest({
    body: z.object({
      name: z.string(),
      profilePicture: z.string().optional(),
    }),
  }),
  updateUserProfile
);

router.post("/profile/photo", 
  authenticateUser,
  upload.single("avatar"),
  uploadProfilePhoto  // ✅ Call this
);


// PUT Change password
router.put(
  "/change-password",
  authenticateUser,
  validateRequest({
    body: z.object({
      currentPassword: z.string(),
      newPassword: z.string(),
      confirmPassword: z.string(),
    }),
  }),
  changePassword
);

export default router;