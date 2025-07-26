import express from "express";
import authMiddleware from "../middleware/Auth.middlewear.js";
import { updateProfile, getProfile, sendCookie } from "../controllers/vendor.controller.js";

const router = express.Router();

router.get('/profile', authMiddleware, getProfile);
router.post('/updateProfile', authMiddleware, updateProfile);
router.get('/dev', sendCookie);

export default router;