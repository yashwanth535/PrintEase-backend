import express from "express";
import authMiddleware from "../middleware/Auth.middlewear.js";
import { updateProfile, getProfile, sendCookie, getVendorDashboardStats } from "../controllers/vendor.controller.js";
import { getVendorOrders } from "../controllers/order.controller.js";

const router = express.Router();

router.get('/profile', authMiddleware, getProfile);
router.post('/updateProfile', authMiddleware, updateProfile);
router.get('/dev', sendCookie);
router.get('/orders', authMiddleware, getVendorOrders);
router.get('/dashboard', authMiddleware, getVendorDashboardStats);

export default router;