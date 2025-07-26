const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');

// @route   POST /api/auth/register
router.post('/register', async (req, res) => {
  // ... code for register ...
});

// @route   POST /api/auth/login
router.post('/login', async (req, res) => {
  // ... code for login ...
});

// @route   GET /api/auth/user
// @desc    Get logged in user's data
// @access  Private
router.get('/user', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;