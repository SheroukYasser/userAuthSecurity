import { signup, login as loginService } from '../services/auth.service.js';

const cookieOptions = {
  httpOnly: true, // Prevents XSS attacks
  secure: process.env.NODE_ENV === 'production', // HTTPS only in production
  sameSite: 'strict', // CSRF protection
  maxAge: 60 * 60 * 1000 // 1 hour in milliseconds
};

export const register = async (req, res) => {
  const { username, password, email } = req.body;

  try {
    const user = await signup(username, email, password);
    res.status(201).json({ 
      message: 'User registered successfully',
      user: { id: user._id, username: user.username, email: user.email }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await loginService(username, password);
    res.cookie('authToken', result.token, cookieOptions);
    res.json({ 
      message: 'Login successful',
      token: result.token,
      user: result.user  
    });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};


export const logout = (req, res) => {
  // Clear the auth cookie
  res.clearCookie('authToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });
  
  res.json({ message: 'Logged out successfully' });
};

export const changeUserRole = async (req, res) => {
    try {
    const user = await authService.updateUserRole(req.body);
    res.json({ message: `User role updated to ${user.role}`, user });
    } catch (err) {
    res.status(400).json({ message: 'Failed to update user role', error: err.message });
    }
};

export const getDashboard = (req, res) => {
    res.json({ message: `Welcome ${req.user.name} to your dashboard` });
};

export const getAdminPanel = (req, res) => {
    res.json({ message: 'Welcome admin to the control panel' });
};

export const protectedRoute = (req, res) => {
  res.json({ 
    message: `Hello ${req.user.username}, this is a protected route.`,
    user: req.user
  });
};

export const checkAuth = (req, res) => {
  // This route checks if user is authenticated
  res.json({
    message: 'User is authenticated',
    user: req.user
  });
};