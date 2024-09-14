import express from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { User } from "../models/users.model.js";
import { authenticateToken, authorizeRole, updateUserRole } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { username, password, role } = req.body;

    // Input validation and sanitation
    if (!username || !password || !role) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ username, password: hashedPassword,  role });
    await newUser.save();

    const token = jwt.sign({  userId: newUser._id ,role }, process.env.JWT_SECRET_KEY);
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;     // Input validation and sanitation
    if (!username || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return  res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET_KEY); 
    res.json({ token , role : user.role });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'My Server error' });
  }
});

router.patch('/update-role', authenticateToken, authorizeRole('admin'), (req, res) => {
  const newRole = req.body.newRole;
  updateUserRole(newRole, (err, user) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to update user role' });
    }
    console.log(`User role updated to ${newRole}`);
    res.json({ message: `User role updated to ${newRole}` });
  });
});

export default router