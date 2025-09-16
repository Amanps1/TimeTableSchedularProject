const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');
const Department = require('./models/Department');
const Subject = require('./models/Subject');
const Staff = require('./models/Staff');

const verifyStaffSubjectAssignment = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const departments = await Department.find();
    const allSubjects = await Subject.find().populate('departmentId', 'name code');
    const allStaff = await Staff.find().populate(['expertiseSubjects', 'departmentId']);
    const staffUsers = await User.find({ role: 'STAFF' });

    console.log('\n=== VERIFICATION REPORT ===\n');

    // 1. Check unique emails
    console.log('1. EMAIL UNIQUENESS CHECK:');
    const emails = staffUsers.map(u => u.email);
    const uniqueEmails = [...new Set(emails)];
    console.log(`   Total staff: ${staffUsers.length}`);
    console.log(`   Unique emails: ${uniqueEmails.length}`);
    console.log(`   ✓ All emails are unique: ${emails.length === uniqueEmails.length ? 'YES' : 'NO'}\n`);

    // 2. Check subject coverage
    console.log('2. SUBJECT COVERAGE CHECK:');
    for (const subject of allSubjects) {
      const assignedStaff = allStaff.filter(staff => 
        staff.expertiseSubjects.some(exp => exp._id.toString() === subject._id.toString())
      );
      
      const status = assignedStaff.length >= 3 ? '✓' : '✗';
      console.log(`   ${status} ${subject.name} (${subject.code}): ${assignedStaff.length} staff assigned`);
      
      if (assignedStaff.length < 3) {
        console.log(`      WARNING: Only ${assignedStaff.length} staff assigned (minimum 3 required)`);
      }
    }

    // 3. Department-wise summary
    console.log('\n3. DEPARTMENT-WISE SUMMARY:');
    for (const dept of departments) {
      const deptSubjects = allSubjects.filter(s => s.departmentId._id.toString() === dept._id.toString());
      const deptStaff = allStaff.filter(s => s.departmentId.toString() === dept._id.toString());
      
      console.log(`\n   ${dept.name} (${dept.code}):`);
      console.log(`     Subjects: ${deptSubjects.length}`);
      console.log(`     Staff: ${deptStaff.length}`);
      
      // Check if each subject has adequate staff
      let adequatelyStaffed = 0;
      for (const subject of deptSubjects) {
        const assignedStaff = deptStaff.filter(staff => 
          staff.expertiseSubjects.some(exp => exp._id.toString() === subject._id.toString())
        );
        if (assignedStaff.length >= 3) adequatelyStaffed++;
      }
      
      console.log(`     Adequately staffed subjects: ${adequatelyStaffed}/${deptSubjects.length}`);
    }

    // 4. Staff workload distribution
    console.log('\n4. STAFF WORKLOAD DISTRIBUTION:');
    const workloadStats = allStaff.map(staff => ({
      name: staff.name,
      department: staff.departmentId.name,
      subjectCount: staff.expertiseSubjects.length
    })).sort((a, b) => b.subjectCount - a.subjectCount);

    console.log('   Top 10 staff by subject count:');
    workloadStats.slice(0, 10).forEach((staff, index) => {
      console.log(`     ${index + 1}. ${staff.name} (${staff.department}): ${staff.subjectCount} subjects`);
    });

    // 5. Sample email list
    console.log('\n5. SAMPLE STAFF EMAILS:');
    const sampleStaff = staffUsers.slice(0, 10);
    sampleStaff.forEach(staff => {
      console.log(`   ${staff.name}: ${staff.email}`);
    });

    console.log('\n=== VERIFICATION COMPLETE ===');
    process.exit(0);
  } catch (error) {
    console.error('Error during verification:', error);
    process.exit(1);
  }
};

verifyStaffSubjectAssignment();