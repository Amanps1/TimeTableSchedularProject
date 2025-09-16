const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../models/User');
const Staff = require('../models/Staff');
const Department = require('../models/Department');
const Subject = require('../models/Subject');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/timetable_db');

async function showLoginCredentials() {
  try {
    console.log('🔐 LOGIN CREDENTIALS FOR COMPREHENSIVE TIMETABLE SYSTEM\n');
    console.log('=' .repeat(80));
    
    // Admin credentials
    console.log('\n👑 ADMIN LOGIN:');
    console.log('Email: admin@college.edu');
    console.log('Password: admin123');
    console.log('Role: Full system access, timetable generation');
    
    // HOD credentials
    console.log('\n🏢 HOD LOGIN CREDENTIALS:');
    const departments = await Department.find({});
    for (const dept of departments) {
      console.log(`${dept.code} HOD - Email: hod.${dept.code.toLowerCase()}@university.edu | Password: hod123`);
    }
    
    // Sample staff credentials from each department
    console.log('\n👨‍🏫 SAMPLE STAFF LOGIN CREDENTIALS:');
    for (const dept of departments) {
      console.log(`\n${dept.name} (${dept.code}):`);
      const staff = await Staff.find({ departmentId: dept._id }).limit(5).populate('expertiseSubjects', 'name');
      
      for (const s of staff) {
        const expertise = s.expertiseSubjects.map(sub => sub.name).join(', ');
        console.log(`  ${s.email} | Password: staff123 | Expertise: ${expertise}`);
      }
    }
    
    // Student access info
    console.log('\n🎓 STUDENT ACCESS:');
    console.log('Students can view timetables by selecting:');
    console.log('- Department: CSE, ECE, MECH, CIVIL');
    console.log('- Semester: 1-8');
    console.log('- All 30 periods (5 days × 6 periods) filled with classes');
    console.log('- No free periods policy implemented');
    
    console.log('\n📊 SYSTEM FEATURES:');
    console.log('✅ 4 Departments with 8 semesters each');
    console.log('✅ 6 subjects per semester (192 total subjects)');
    console.log('✅ 30 staff per department (120 total staff)');
    console.log('✅ Department-wise staff filtering');
    console.log('✅ Subject expertise matching');
    console.log('✅ No free periods for students');
    console.log('✅ Staff workload balancing (max 18 hours/week, 6 hours/day)');
    console.log('✅ AI-powered timetable generation');
    console.log('✅ Role-based dashboards');
    
    console.log('\n🚀 QUICK START:');
    console.log('1. Login as Admin: admin@college.edu / admin123');
    console.log('2. Go to Timetable Generator');
    console.log('3. Select Department (CSE/ECE/MECH/CIVIL)');
    console.log('4. Select Semester (1-8)');
    console.log('5. Select Section (A/B/C)');
    console.log('6. Generate AI-Optimized Timetable');
    console.log('7. View complete 30-period schedule with no free periods');
    
    console.log('\n' + '=' .repeat(80));
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    mongoose.connection.close();
  }
}

showLoginCredentials();