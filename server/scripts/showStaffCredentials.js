const mongoose = require('mongoose');
const Department = require('../models/Department');
const Staff = require('../models/Staff');
const User = require('../models/User');

const showStaffCredentials = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/timetable_db');
    console.log('Connected to MongoDB');

    const departments = await Department.find();
    
    console.log('=== STAFF LOGIN CREDENTIALS ===\n');
    
    for (const dept of departments) {
      console.log(`🏢 ${dept.name.toUpperCase()}`);
      console.log('=' .repeat(50));
      
      const staff = await Staff.find({ departmentId: dept._id })
        .populate('departmentId', 'name')
        .sort({ name: 1 });
      
      if (staff.length === 0) {
        console.log('❌ No staff found for this department\n');
        continue;
      }
      
      staff.forEach((member, index) => {
        console.log(`${index + 1}. ${member.name}`);
        console.log(`   📧 Email: ${member.email}`);
        console.log(`   🔑 Password: staff123`);
        console.log(`   🎓 Expertise: ${member.expertiseSubjects?.length || 0} subjects`);
        console.log('');
      });
      
      console.log(`Total Staff: ${staff.length}\n`);
    }
    
    // Verify user accounts exist
    console.log('=== USER ACCOUNT VERIFICATION ===\n');
    
    for (const dept of departments) {
      const staff = await Staff.find({ departmentId: dept._id });
      const userIds = staff.map(s => s.userId);
      const users = await User.find({ _id: { $in: userIds }, role: 'STAFF' });
      
      console.log(`${dept.name}: ${staff.length} staff, ${users.length} user accounts`);
      
      if (staff.length !== users.length) {
        console.log(`⚠️ Mismatch detected in ${dept.name}!`);
      } else {
        console.log(`✅ All accounts verified for ${dept.name}`);
      }
    }
    
    console.log('\n=== SAMPLE LOGIN CREDENTIALS ===');
    console.log('CSE: rajesh.kumar.computerscienceengineering@college.edu / staff123');
    console.log('ECE: anitha.krishnan.electronicsandcommunication@college.edu / staff123');
    console.log('MECH: ashok.pandey.mechanicalengineering@college.edu / staff123');
    console.log('CIVIL: prakash.jha.civilengineering@college.edu / staff123');

    process.exit(0);
  } catch (error) {
    console.error('Error showing staff credentials:', error);
    process.exit(1);
  }
};

showStaffCredentials();