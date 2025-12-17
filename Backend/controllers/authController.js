import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/User.js';
import { validateSession } from '../middleware/authMiddleware.js';
dotenv.config();

export const signup = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    if (!name || !email || !password) 
      return res.status(400).json({ 
    message: 'Please fill all fields',
   success:false
  });

    if (await User.findOne({ email }))
      return res.status(400).json({ 
    message: 'Email already exists',
    success:false
  });

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashed, role });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.status(201).json({ 
      token, 
      user: { id: user._id, name, email, role },
      success:true
    });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) 
      return res.status(400).json({ 
    message: 'Please fill all fields',
    success:false
  });
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(400).json({ 
    message: 'Invalid credentials',
    success:false
  });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "30m"} );
    res.status(201).json({ 
      token, 
      user: { id: user._id, name: user.name, email, role: user.role },
      success:true
    });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

export const me = async (req, res) => {
  try {
    if(validateSession(req, res)){
      res.status(200).json({
      success: true,
      message: "Token is valid",
    });

    }
  } catch (e) { res.status(401).json({ success: false, message: "Invalid or expired token" }); }
};
