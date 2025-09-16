const mongoose = require('mongoose');
const Department = require('../models/Department');
const Subject = require('../models/Subject');
const Staff = require('../models/Staff');

const improveStaffCoverage = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/timetable_db');
    console.log('Connected to MongoDB');

    const departments = await Department.find();
    
    for (const dept of departments) {
      console.log(`\nImproving coverage for ${dept.name}...`);
      
      const subjects = await Subject.find({ departmentId: dept._id });
      const staff = await Staff.find({ departmentId: dept._id });
      
      // For each subject, ensure at least 3 staff members can teach it
      for (const subject of subjects) {
        const currentStaffCount = await Staff.countDocuments({
          departmentId: dept._id,
          expertiseSubjects: { $in: [subject._id] }
        });
        
        if (currentStaffCount < 3) {
          // Find staff who don't have this subject yet and add it
          const staffWithoutSubject = await Staff.find({
            departmentId: dept._id,
            expertiseSubjects: { $nin: [subject._id] }
          });
          
          const needed = 3 - currentStaffCount;
          const toUpdate = staffWithoutSubject.slice(0, needed);
          
          for (const staffMember of toUpdate) {
            // Add this subject to their expertise (limit to 8 subjects max)
            if (staffMember.expertiseSubjects.length < 8) {
              staffMember.expertiseSubjects.push(subject._id);
              await staffMember.save();
              console.log(`  ✓ Added ${subject.name} to ${staffMember.name}'s expertise`);
            }
          }
        }
      }
    }

    // Final verification
    console.log('\n=== FINAL COVERAGE REPORT ===');
    for (const dept of departments) {
      console.log(`\n${dept.name}:`);
      const subjects = await Subject.find({ departmentId: dept._id });
      
      let totalCoverage = 0;
      for (const subject of subjects) {
        const staffCount = await Staff.countDocuments({
          departmentId: dept._id,
          expertiseSubjects: { $in: [subject._id] }
        });
        
        if (subject.semester <= 2) { // Show first 2 semesters
          console.log(`  ${subject.name} (Sem ${subject.semester}): ${staffCount} staff`);
        }
        totalCoverage += staffCount;
      }
      
      const avgCoverage = (totalCoverage / subjects.length).toFixed(1);
      console.log(`  Average staff per subject: ${avgCoverage}`);
    }

    console.log('\n✅ Coverage improvement completed!');
    process.exit(0);
  } catch (error) {
    console.error('Error improving coverage:', error);
    process.exit(1);
  }
};

improveStaffCoverage();