import express from "express";
import { sendCookie } from "../controllers/user.controller.js";
import { signedUrl } from '../controllers/pdf.controller.js';
import authMiddleware from "../middleware/Auth.middlewear.js";

const router = express.Router();

router.post('/signed-url', authMiddleware,signedUrl);
router.get("/dev",sendCookie);


export default router;