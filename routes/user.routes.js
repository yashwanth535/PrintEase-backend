import express from "express";
import { sendCookie } from "../controllers/user.controller.js";
import { signedUrl } from '../controllers/pdf.controller.js';

const router = express.Router();

router.post('/signed-url', signedUrl);
router.get("/dev", sendCookie);

export default router;