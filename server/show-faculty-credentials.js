const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');
const Staff = require('./models/Staff');
const Department = require('./models/Department');

const showFacultyCredentials = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get all staff users with their department info
    const staffUsers = await User.find({ role: 'STAFF' })
      .populate('departmentId', 'name code')
      .sort({ name: 1 });

    console.log('\n=== FACULTY LOGIN CREDENTIALS ===\n');
    console.log('Use these credentials to login to the faculty dashboard:\n');

    if (staffUsers.length === 0) {
      console.log('No staff users found in the database.');
      process.exit(0);
    }

    // Display credentials in a table format
    console.log('| Name                    | Email                              | Password | Department |');
    console.log('|-------------------------|------------------------------------|---------|-----------| ');

    staffUsers.forEach(user => {
      const name = user.name.padEnd(23);
      const email = user.email.padEnd(34);
      const dept = user.departmentId ? user.departmentId.code : 'N/A';
      console.log(`| ${name} | ${email} | staff123 | ${dept.padEnd(9)} |`);
    });

    console.log('\n=== SAMPLE LOGIN INSTRUCTIONS ===');
    console.log('1. Go to the login page');
    console.log('2. Use any email from the list above');
    console.log('3. Password for all staff: staff123');
    console.log('4. Select "Staff" role if prompted');

    console.log('\n=== QUICK TEST CREDENTIALS ===');
    const sampleUser = staffUsers[0];
    if (sampleUser) {
      console.log(`Email: ${sampleUser.email}`);
      console.log('Password: staff123');
      console.log(`Department: ${sampleUser.departmentId?.name || 'N/A'}`);
    }

    process.exit(0);
  } catch (error) {
    console.error('Error fetching credentials:', error);
    process.exit(1);
  }
};

showFacultyCredentials();