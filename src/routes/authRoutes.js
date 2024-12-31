const express = require('express');
const { body, validationResult } = require('express-validator');
const { signup, login } = require('../controllers/authController');

const router = express.Router();

// Middleware to handle validation results
const handleValidationResults = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Signup route
router.post('/signup', [
  body('username').notEmpty().withMessage('Username is required'),
  body('email').isEmail().withMessage('Invalid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  handleValidationResults
], signup);

// Login route
router.post('/login', [
  body('username').isAlphanumeric().withMessage('Invalid email'),
  body('password').notEmpty().withMessage('Password is required'),
  handleValidationResults
], login);

module.exports = router;
