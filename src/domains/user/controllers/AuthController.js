const path = require('path');
const UserService = require(path.join(__dirname, '../services/UserService'));
const jwt = require('jsonwebtoken');

class AuthController {
  // Register a new user
  async register(req, res, next) {
    try {
      const { firstName, lastName, email, password, confirmPassword, phone } = req.body;

      // Validate input
      if (!firstName || !lastName || !email || !password || !confirmPassword) {
        return res.status(400).json({
          success: false,
          message: 'Please provide all required fields',
        });
      }

      if (password !== confirmPassword) {
        return res.status(400).json({
          success: false,
          message: 'Passwords do not match',
        });
      }

      // Create user
      const user = await UserService.createUser({
        firstName,
        lastName,
        email,
        password,
        phone,
      });

      // Generate JWT token
      const token = jwt.sign(
        { userId: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE }
      );

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        token,
        user: user.toJSON(),
      });
    } catch (error) {
      next(error);
    }
  }

  // Login user
  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Please provide email and password',
        });
      }

      const user = await UserService.authenticateUser(email, password);

      // Generate JWT token
      const token = jwt.sign(
        { userId: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE }
      );

      // Set session
      req.session.user = user;
      req.session.token = token;

      res.status(200).json({
        success: true,
        message: 'Login successful',
        token,
        user: user.toJSON(),
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: error.message || 'Login failed',
      });
    }
  }

  // Logout user
  async logout(req, res, next) {
    try {
      req.session.destroy((err) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: 'Logout failed',
          });
        }

        res.status(200).json({
          success: true,
          message: 'Logout successful',
        });
      });
    } catch (error) {
      next(error);
    }
  }

  // Get current user profile
  async getProfile(req, res, next) {
    try {
      const user = await UserService.getUserById(req.user.userId);

      res.status(200).json({
        success: true,
        user: user.toJSON(),
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Update user profile
  async updateProfile(req, res, next) {
    try {
      const { firstName, lastName, phone } = req.body;

      const user = await UserService.updateUser(req.user.userId, {
        firstName,
        lastName,
        phone,
      });

      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        user: user.toJSON(),
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Change password
  async changePassword(req, res, next) {
    try {
      const { oldPassword, newPassword, confirmPassword } = req.body;

      if (newPassword !== confirmPassword) {
        return res.status(400).json({
          success: false,
          message: 'New passwords do not match',
        });
      }

      await UserService.changePassword(req.user.userId, oldPassword, newPassword);

      res.status(200).json({
        success: true,
        message: 'Password changed successfully',
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = new AuthController();
