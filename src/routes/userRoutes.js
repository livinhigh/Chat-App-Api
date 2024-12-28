const express = require('express');
const router = express.Router();
const { updateProfile } = require('../controllers/userController');
const authenticateToken = require('../middlewares/authMiddleware');

router.patch('/profile', authenticateToken, updateProfile);

module.exports = router;
