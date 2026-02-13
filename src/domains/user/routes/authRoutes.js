const express = require('express');
const router = express.Router();
const path = require('path');
const AuthController = require(path.join(__dirname, '../controllers/AuthController'));
const CustomerController = require(path.join(__dirname, '../controllers/CustomerController'));
const { authenticate, authorize } = require(path.join(__dirname, '../../../middleware/auth'));

// Auth routes
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/logout', authenticate, AuthController.logout);

// Profile routes
router.get('/profile', authenticate, AuthController.getProfile);
router.put('/profile', authenticate, AuthController.updateProfile);
router.put('/change-password', authenticate, AuthController.changePassword);

// Address routes
router.post('/addresses', authenticate, CustomerController.addAddress);
router.put('/addresses/:addressId', authenticate, CustomerController.updateAddress);
router.delete('/addresses/:addressId', authenticate, CustomerController.deleteAddress);

// Account management
router.delete('/account', authenticate, CustomerController.deactivateAccount);

// Admin routes
router.get('/customers', authenticate, authorize('admin'), CustomerController.getAllCustomers);
router.get('/customers/:id', authenticate, authorize('admin'), CustomerController.getCustomerById);

module.exports = router;
