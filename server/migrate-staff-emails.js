const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');
const Staff = require('./models/Staff');

const migrateStaffEmails = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get all staff records
    const staffRecords = await Staff.find().populate('userId', 'email');
    
    console.log(`Found ${staffRecords.length} staff records to update`);

    // Update each staff record with email from User
    for (const staff of staffRecords) {
      if (staff.userId && staff.userId.email) {
        await Staff.findByIdAndUpdate(
          staff._id,
          { email: staff.userId.email },
          { new: true }
        );
        console.log(`Updated ${staff.name}: ${staff.userId.email}`);
      }
    }

    console.log('\n=== Email Migration Complete ===');
    
    // Verify the update
    const updatedStaff = await Staff.find().select('name email');
    console.log('\nVerification - Staff with emails:');
    updatedStaff.forEach(staff => {
      console.log(`${staff.name}: ${staff.email}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error migrating emails:', error);
    process.exit(1);
  }
};

migrateStaffEmails();