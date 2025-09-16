const mongoose = require('mongoose');
require('dotenv').config();

const Staff = require('../models/Staff');
const Subject = require('../models/Subject');
const Department = require('../models/Department');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/timetable_db');

async function assignStaffExpertise() {
  try {
    console.log('🚀 Starting staff expertise assignment...');

    const departments = await Department.find({});
    
    for (const dept of departments) {
      console.log(`\n📚 Processing ${dept.code} department...`);
      
      // Get all subjects for this department
      const subjects = await Subject.find({ departmentId: dept._id });
      console.log(`Found ${subjects.length} subjects`);
      
      // Get all staff for this department
      const staff = await Staff.find({ departmentId: dept._id });
      console.log(`Found ${staff.length} staff members`);
      
      // Assign expertise to each staff member
      for (const staffMember of staff) {
        // Assign 2-4 random subjects as expertise
        const expertiseCount = Math.floor(Math.random() * 3) + 2; // 2-4 subjects
        const shuffledSubjects = [...subjects].sort(() => 0.5 - Math.random());
        const expertiseSubjects = shuffledSubjects.slice(0, expertiseCount);
        
        await Staff.findByIdAndUpdate(staffMember._id, {
          expertiseSubjects: expertiseSubjects.map(s => s._id)
        });
        
        console.log(`✅ ${staffMember.name}: ${expertiseSubjects.map(s => s.name).join(', ')}`);
      }
    }
    
    console.log('\n🎉 Staff expertise assignment completed!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    mongoose.connection.close();
  }
}

assignStaffExpertise();