import express from 'express';
import { 
  register, 
  login, 
  logout, 
  protectedRoute, 
  checkAuth ,
  changeUserRole,
  getDashboard,
  getAdminPanel
} from '../controllers/auth.controller.js';

import { 
  verifyToken, 
  optionalAuth,
  validateUser, 
  validateEmail, 
  validatePassword,
  validateUsername ,
  authorizeRole
} from '../middleware/auth.middleware.js';

const router = express.Router();

// Public routes
router.post('/register', validateUser, validateUsername, validateEmail, validatePassword, register);
router.post('/login', validateUser, login);

// Protected routes
router.post('/logout', verifyToken, logout);
router.get('/protected', verifyToken, protectedRoute);
router.get('/check-auth', verifyToken, checkAuth);
router.get('/dashboard', verifyToken, getDashboard);
router.get('/admin', verifyToken, authorizeRole('admin'), getAdminPanel);
router.patch('/change-role', verifyToken, authorizeRole('admin'), changeUserRole);

// Optional auth route (for checking if user is logged in)
router.get('/me', optionalAuth, (req, res) => {
  if (req.user) {
    res.json({ authenticated: true, user: req.user });
  } else {
    res.json({ authenticated: false });
  }
});

export default router;