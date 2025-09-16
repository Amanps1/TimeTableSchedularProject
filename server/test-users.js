const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

const testUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const users = await User.find({});
    console.log('Users in database:', users.length);
    users.forEach(user => {
      console.log(`Email: ${user.email}, Role: ${user.role}`);
    });
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

testUsers();