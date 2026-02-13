const User = require('../models/User');
const { USER_ROLES } = require('../../../config/constants');

class UserService {
  // Create a new user
  async createUser(userData) {
    const { email, password, firstName, lastName, phone, role } = userData;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error('User already exists');
    }

    const newUser = new User({
      firstName,
      lastName,
      email,
      password,
      phone,
      role: role || USER_ROLES.CUSTOMER,
    });

    await newUser.save();
    return newUser;
  }

  // Get user by ID
  async getUserById(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  // Get user by email
  async getUserByEmail(email) {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  // Authenticate user
  async authenticateUser(email, password) {
    const user = await this.getUserByEmail(email);

    if (!user.isActive) {
      throw new Error('User account is inactive');
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    return user;
  }

  // Update user
  async updateUser(userId, updateData) {
    const { password, email, ...otherData } = updateData;

    // Prevent email and password updates through this method
    const user = await User.findByIdAndUpdate(userId, otherData, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  // Change password
  async changePassword(userId, oldPassword, newPassword) {
    const user = await User.findById(userId).select('+password');

    if (!user) {
      throw new Error('User not found');
    }

    const isPasswordValid = await user.comparePassword(oldPassword);
    if (!isPasswordValid) {
      throw new Error('Current password is incorrect');
    }

    user.password = newPassword;
    await user.save();

    return { success: true, message: 'Password changed successfully' };
  }

  // Get all customers (admin only)
  async getAllCustomers(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const customers = await User.find({ role: USER_ROLES.CUSTOMER })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments({ role: USER_ROLES.CUSTOMER });

    return {
      customers,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  // Add address to user
  async addAddress(userId, addressData) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    user.addresses.push(addressData);
    await user.save();

    return user;
  }

  // Update address
  async updateAddress(userId, addressId, addressData) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const address = user.addresses.id(addressId);
    if (!address) {
      throw new Error('Address not found');
    }

    Object.assign(address, addressData);
    await user.save();

    return user;
  }

  // Delete address
  async deleteAddress(userId, addressId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    user.addresses.id(addressId).remove();
    await user.save();

    return user;
  }

  // Deactivate user
  async deactivateUser(userId) {
    const user = await User.findByIdAndUpdate(
      userId,
      { isActive: false },
      { new: true }
    );

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }
}

module.exports = new UserService();
