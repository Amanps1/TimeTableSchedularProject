const mongoose = require('mongoose');
const Department = require('../models/Department');
const Subject = require('../models/Subject');
const Staff = require('../models/Staff');

const ensureFullCoverage = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/timetable_db');
    console.log('Connected to MongoDB');

    const departments = await Department.find();
    
    for (const dept of departments) {
      console.log(`\nEnsuring full coverage for ${dept.name}...`);
      
      const subjects = await Subject.find({ departmentId: dept._id });
      const staff = await Staff.find({ departmentId: dept._id });
      
      for (const subject of subjects) {
        const currentStaffCount = await Staff.countDocuments({
          departmentId: dept._id,
          expertiseSubjects: { $in: [subject._id] }
        });
        
        if (currentStaffCount < 3) {
          // Find staff with least subjects and add this subject
          const staffSorted = await Staff.find({ departmentId: dept._id })
            .populate('expertiseSubjects');
          
          // Sort by number of expertise subjects (ascending)
          staffSorted.sort((a, b) => a.expertiseSubjects.length - b.expertiseSubjects.length);
          
          const needed = 3 - currentStaffCount;
          let added = 0;
          
          for (const staffMember of staffSorted) {
            if (added >= needed) break;
            
            // Check if staff already has this subject
            const hasSubject = staffMember.expertiseSubjects.some(exp => 
              exp._id.toString() === subject._id.toString()
            );
            
            if (!hasSubject && staffMember.expertiseSubjects.length < 8) {
              staffMember.expertiseSubjects.push(subject._id);
              await staffMember.save();
              console.log(`  ✓ Added ${subject.name} to ${staffMember.name}`);
              added++;
            }
          }
        }
      }
    }

    // Final comprehensive report
    console.log('\n=== COMPREHENSIVE COVERAGE REPORT ===');
    for (const dept of departments) {
      console.log(`\n📚 ${dept.name}:`);
      const subjects = await Subject.find({ departmentId: dept._id }).sort({ semester: 1 });
      
      let uncoveredSubjects = 0;
      let wellCoveredSubjects = 0;
      
      for (const subject of subjects) {
        const staffCount = await Staff.countDocuments({
          departmentId: dept._id,
          expertiseSubjects: { $in: [subject._id] }
        });
        
        if (staffCount === 0) uncoveredSubjects++;
        if (staffCount >= 3) wellCoveredSubjects++;
        
        const status = staffCount >= 5 ? '🟢' : staffCount >= 3 ? '🟡' : staffCount >= 1 ? '🟠' : '🔴';
        console.log(`  ${status} ${subject.name} (Sem ${subject.semester}): ${staffCount} staff`);
      }
      
      console.log(`\n  📊 Summary: ${wellCoveredSubjects}/${subjects.length} subjects well-covered (3+ staff)`);
      console.log(`  ⚠️  Uncovered: ${uncoveredSubjects} subjects`);
    }

    console.log('\n✅ Full coverage check completed!');
    process.exit(0);
  } catch (error) {
    console.error('Error ensuring coverage:', error);
    process.exit(1);
  }
};

ensureFullCoverage();