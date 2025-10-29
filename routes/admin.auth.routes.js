// routes/admin.auth.routes.js
import express from "express";
import { 
  adminSignIn, 
  adminLogout, 
  adminExists, 
  generateOTP, 
  verifyOTP, 
  resetPassword, 
} from "../controllers/admin.auth.controller.js";

const router = express.Router();

// Admin Sign In
router.post('/signin', adminSignIn);

// Check if Admin Exists (for forgot password)
router.post('/userExists', adminExists);

// Generate OTP for Password Reset
router.post('/generateOTP', generateOTP);

// Verify OTP
router.post('/verifyOTP', verifyOTP);

// Reset Password
router.post('/reset_password', resetPassword);

// Admin Logout
router.post('/logout', adminLogout);


export default router;