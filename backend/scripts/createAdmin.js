/**
 * Utility script to create an admin user
 * Usage: node scripts/createAdmin.js <username> <email> <password>
 */

const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sweet-shop', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const args = process.argv.slice(2);
    
    if (args.length < 3) {
      console.error('Usage: node scripts/createAdmin.js <username> <email> <password>');
      process.exit(1);
    }

    const [username, email, password] = args;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      console.log('User already exists. Updating role to admin...');
      existingUser.role = 'admin';
      await existingUser.save();
      console.log('User role updated to admin successfully!');
    } else {
      // Create new admin user
      const adminUser = new User({
        username,
        email,
        password,
        role: 'admin'
      });

      await adminUser.save();
      console.log('Admin user created successfully!');
    }

    console.log(`Admin credentials:`);
    console.log(`Username: ${username}`);
    console.log(`Email: ${email}`);
    console.log(`Role: admin`);

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
};

createAdmin();

