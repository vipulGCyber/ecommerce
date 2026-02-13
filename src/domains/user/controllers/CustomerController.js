const path = require('path');
const UserService = require(path.join(__dirname, '../services/UserService'));

class CustomerController {
  // Get all customers (admin only)
  async getAllCustomers(req, res, next) {
    try {
      const page = req.query.page || 1;
      const limit = req.query.limit || 10;

      const result = await UserService.getAllCustomers(page, limit);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get customer by ID (admin only)
  async getCustomerById(req, res, next) {
    try {
      const user = await UserService.getUserById(req.params.id);

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

  // Add address
  async addAddress(req, res, next) {
    try {
      const { street, city, state, zipCode, country, isDefault } = req.body;

      const user = await UserService.addAddress(req.user.userId, {
        street,
        city,
        state,
        zipCode,
        country,
        isDefault,
      });

      res.status(201).json({
        success: true,
        message: 'Address added successfully',
        user: user.toJSON(),
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Update address
  async updateAddress(req, res, next) {
    try {
      const { addressId } = req.params;
      const { street, city, state, zipCode, country, isDefault } = req.body;

      const user = await UserService.updateAddress(req.user.userId, addressId, {
        street,
        city,
        state,
        zipCode,
        country,
        isDefault,
      });

      res.status(200).json({
        success: true,
        message: 'Address updated successfully',
        user: user.toJSON(),
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Delete address
  async deleteAddress(req, res, next) {
    try {
      const { addressId } = req.params;

      const user = await UserService.deleteAddress(req.user.userId, addressId);

      res.status(200).json({
        success: true,
        message: 'Address deleted successfully',
        user: user.toJSON(),
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Deactivate account
  async deactivateAccount(req, res, next) {
    try {
      await UserService.deactivateUser(req.user.userId);

      req.session.destroy();

      res.status(200).json({
        success: true,
        message: 'Account deactivated successfully',
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = new CustomerController();
