// backend/routes/auth.routes.js
import express from 'express';
import {
  register,
  login,
  getProfile,
  updateProfile,
  sendOtp,
  verifyOtp,
  resetPassword
} from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.js'; 

const router = express.Router();
router.get('/profile', protect, getProfile);

// Public Routes
router.post('/register', register);
router.post('/login', login);
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/reset-password', resetPassword);

// Protected Routes

router.patch('/update/:id', updateProfile);

export default router;
