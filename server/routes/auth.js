const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Department = require('../models/Department');
const { auth } = require('../middleware/auth');
const otpService = require('../services/otpService');

const router = express.Router();

// Register with OTP verification
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, departmentId, otp } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Verify OTP for all roles
    if (!otp) {
      await otpService.createOTP(email);
      return res.json({ requiresOTP: true, message: 'OTP sent to your email' });
    }
    
    const isValidOTP = await otpService.verifyOTP(email, otp);
    if (!isValidOTP) {
      return res.status(401).json({ message: 'Invalid or expired OTP' });
    }

    const user = new User({ name, email, password, role, departmentId });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get departments for signup
router.get('/departments', async (req, res) => {
  try {
    const departments = await Department.find().select('name code');
    res.json(departments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Send OTP
router.post('/send-otp', async (req, res) => {
  try {
    const { email } = req.body;
    await otpService.createOTP(email);
    res.json({ message: 'OTP sent to your email' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Login with OTP for Admin, HOD, Staff
router.post('/login', async (req, res) => {
  try {
    const { email, password, otp } = req.body;
    
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if OTP is required for this role
    if (['ADMIN', 'HOD', 'STAFF'].includes(user.role)) {
      if (!otp) {
        // Send OTP
        await otpService.createOTP(email);
        return res.json({ requiresOTP: true, message: 'OTP sent to your email' });
      }
      
      // Verify OTP
      const isValidOTP = await otpService.verifyOTP(email, otp);
      if (!isValidOTP) {
        return res.status(401).json({ message: 'Invalid or expired OTP' });
      }
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get current user
router.get('/me', auth, async (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role
    }
  });
});

module.exports = router;