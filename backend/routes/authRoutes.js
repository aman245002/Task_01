const express = require('express');
const router = express.Router();
const { 
    registerUser, 
    loginUser, 
    updateUserProfile, 
    deleteUserProfile 
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Public Routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected Routes (Profile Management)
router.route('/profile')
    .put(protect, updateUserProfile)    // Update Name/Email/Password
    .delete(protect, deleteUserProfile); // Delete Account & Tasks

module.exports = router;