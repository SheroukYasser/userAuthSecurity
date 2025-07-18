import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const signup = async (username, email, password) => {
  const existing = await User.findOne({ $or: [{ email }, { username }] });
  if (existing) throw new Error("User already exists");

  const hashed = await bcrypt.hash(password, 12);
  const user = new User({ username, email, password: hashed });
  await user.save();

  // Generate JWT token
  const token = jwt.sign(
    { userId: user._id, username: user.username }, 
    process.env.JWT_SECRET, 
    { expiresIn: "1h" }
  );

  // Return both token and user data
  return { 
    token, 
    user: { id: user._id, username: user.username, email: user.email } 
  };
};

export const login = async (username, password) => {
  const user = await User.findOne({ username });
  if (!user) throw new Error("Invalid credentials");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid credentials");

  const token = jwt.sign(
    { userId: user._id, username: user.username }, 
    process.env.JWT_SECRET, 
    { expiresIn: "1h" }
  );

  return { 
    token, 
    user: { id: user._id, username: user.username, email: user.email } 
  };
};

export const authenticate = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    throw new Error("Invalid token");
  }
};

export const updateUserRole = async ({ userId, newRole }) => {
  const validRoles = ['user', 'admin'];
  if (!validRoles.includes(newRole)) {
    throw new Error('Invalid role');
  }

  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  user.role = newRole;


  return { id: user._id, role: user.role };
};