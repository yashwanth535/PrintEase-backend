import express from "express";
import { sendCookie, getFavourites, addFavourite, removeFavourite ,getLogsNotifications,sendProfile,updateProfile} from "../controllers/user.controller.js";
import { signedUrl } from '../controllers/pdf.controller.js';
import authMiddleware from "../middleware/Auth.middlewear.js";

const router = express.Router();

router.post('/signed-url', authMiddleware, signedUrl);
router.get("/dev", sendCookie);
router.get("/profile",authMiddleware,sendProfile);
router.put("/update-profile",authMiddleware,updateProfile);

// favourites routes
router.get('/favourites', authMiddleware, getFavourites);
router.post('/favourites', authMiddleware, addFavourite);
router.delete('/favourites/:vendorId', authMiddleware, removeFavourite);

// logs & notifications
router.get('/logs', authMiddleware, getLogsNotifications);


export default router;