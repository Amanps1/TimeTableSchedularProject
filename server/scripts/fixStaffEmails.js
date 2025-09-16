const mongoose = require('mongoose');
const Staff = require('../models/Staff');
const User = require('../models/User');

const fixStaffEmails = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/timetable_db');
    console.log('Connected to MongoDB');

    const allStaff = await Staff.find();
    
    console.log(`Fixing emails for ${allStaff.length} staff members...`);
    
    for (const staff of allStaff) {
      // Fix email format (remove leading dot)
      const fixedEmail = staff.email.replace(/^\./, '');
      
      if (fixedEmail !== staff.email) {
        // Update staff email
        staff.email = fixedEmail;
        await staff.save();
        
        // Update corresponding user email
        const user = await User.findById(staff.userId);
        if (user) {
          user.email = fixedEmail;
          await user.save();
        }
        
        console.log(`✓ Fixed: ${staff.name} -> ${fixedEmail}`);
      }
    }
    
    console.log('\n✅ All staff emails fixed!');
    
    // Show sample credentials
    console.log('\n=== SAMPLE STAFF LOGIN CREDENTIALS ===');
    console.log('CSE: rajesh.kumar.computerscienceengineering@college.edu / staff123');
    console.log('ECE: anitha.krishnan.electronicsandcommunication@college.edu / staff123');
    console.log('MECH: ashok.pandey.mechanicalengineering@college.edu / staff123');
    console.log('CIVIL: prakash.jha.civilengineering@college.edu / staff123');

    process.exit(0);
  } catch (error) {
    console.error('Error fixing staff emails:', error);
    process.exit(1);
  }
};

fixStaffEmails();