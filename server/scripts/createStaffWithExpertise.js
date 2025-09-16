const mongoose = require('mongoose');
const Department = require('../models/Department');
const Subject = require('../models/Subject');
const Staff = require('../models/Staff');
const User = require('../models/User');

const createStaffWithExpertise = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/timetable_db');
    console.log('Connected to MongoDB');

    // Clear existing staff
    const existingStaff = await Staff.find();
    const userIds = existingStaff.map(s => s.userId);
    await Staff.deleteMany({});
    await User.deleteMany({ _id: { $in: userIds } });

    const departments = await Department.find();
    
    for (const dept of departments) {
      console.log(`\nCreating staff for ${dept.name}...`);
      
      // Get all subjects for this department
      const subjects = await Subject.find({ departmentId: dept._id });
      
      if (subjects.length === 0) {
        console.log(`No subjects found for ${dept.name}`);
        continue;
      }

      // Create 8 staff members per department
      const staffMembers = [
        { name: `Dr. ${dept.name.split(' ')[0]} Professor 1`, email: `prof1.${dept.name.toLowerCase().replace(/\s+/g, '')}@college.edu` },
        { name: `Prof. ${dept.name.split(' ')[0]} Teacher 2`, email: `prof2.${dept.name.toLowerCase().replace(/\s+/g, '')}@college.edu` },
        { name: `Dr. ${dept.name.split(' ')[0]} Expert 3`, email: `prof3.${dept.name.toLowerCase().replace(/\s+/g, '')}@college.edu` },
        { name: `Prof. ${dept.name.split(' ')[0]} Lecturer 4`, email: `prof4.${dept.name.toLowerCase().replace(/\s+/g, '')}@college.edu` },
        { name: `Dr. ${dept.name.split(' ')[0]} Senior 5`, email: `prof5.${dept.name.toLowerCase().replace(/\s+/g, '')}@college.edu` },
        { name: `Prof. ${dept.name.split(' ')[0]} Associate 6`, email: `prof6.${dept.name.toLowerCase().replace(/\s+/g, '')}@college.edu` },
        { name: `Dr. ${dept.name.split(' ')[0]} Assistant 7`, email: `prof7.${dept.name.toLowerCase().replace(/\s+/g, '')}@college.edu` },
        { name: `Prof. ${dept.name.split(' ')[0]} Head 8`, email: `prof8.${dept.name.toLowerCase().replace(/\s+/g, '')}@college.edu` }
      ];

      // Group subjects by semester for better distribution
      const subjectsBySemester = {};
      subjects.forEach(subject => {
        if (!subjectsBySemester[subject.semester]) {
          subjectsBySemester[subject.semester] = [];
        }
        subjectsBySemester[subject.semester].push(subject);
      });

      for (let i = 0; i < staffMembers.length; i++) {
        const staffInfo = staffMembers[i];
        
        // Assign expertise subjects - each staff gets 4-6 subjects across different semesters
        let expertiseSubjects = [];
        
        // Strategy: Each staff member gets subjects from 2-3 semesters
        const semesterKeys = Object.keys(subjectsBySemester);
        const assignedSemesters = [];
        
        // Assign 2-3 semesters to each staff
        if (i < 4) {
          // First 4 staff get early semesters (1-4)
          assignedSemesters.push(Math.min(i + 1, 4));
          assignedSemesters.push(Math.min(i + 2, 4));
        } else {
          // Last 4 staff get later semesters (3-8)
          assignedSemesters.push(Math.min(i - 1, 8));
          assignedSemesters.push(Math.min(i, 8));
        }
        
        // Add subjects from assigned semesters
        assignedSemesters.forEach(sem => {
          if (subjectsBySemester[sem]) {
            // Take 2-3 subjects from each semester
            const semSubjects = subjectsBySemester[sem].slice(0, 3);
            expertiseSubjects.push(...semSubjects);
          }
        });
        
        // Ensure each staff has at least 3 subjects
        if (expertiseSubjects.length < 3) {
          const remainingSubjects = subjects.filter(s => !expertiseSubjects.includes(s));
          expertiseSubjects.push(...remainingSubjects.slice(0, 3 - expertiseSubjects.length));
        }
        
        // Limit to 6 subjects max
        expertiseSubjects = expertiseSubjects.slice(0, 6);
        
        try {
          // Create user account
          const user = new User({
            name: staffInfo.name,
            email: staffInfo.email,
            password: 'staff123',
            role: 'STAFF',
            departmentId: dept._id
          });
          await user.save();

          // Create staff profile
          const staff = new Staff({
            userId: user._id,
            name: staffInfo.name,
            email: staffInfo.email,
            departmentId: dept._id,
            expertiseSubjects: expertiseSubjects.map(s => s._id),
            maxHours: 18,
            currentWorkload: 0
          });
          await staff.save();
          
          console.log(`  ✓ Created ${staffInfo.name} with ${expertiseSubjects.length} subjects: ${expertiseSubjects.map(s => s.name).join(', ')}`);
        } catch (error) {
          console.log(`  ✗ Error creating ${staffInfo.name}:`, error.message);
        }
      }
    }

    // Verify staff distribution
    console.log('\n=== STAFF DISTRIBUTION SUMMARY ===');
    for (const dept of departments) {
      const staffCount = await Staff.countDocuments({ departmentId: dept._id });
      const subjects = await Subject.find({ departmentId: dept._id });
      
      console.log(`\n${dept.name}: ${staffCount} staff members`);
      
      // Check coverage for each subject
      for (const subject of subjects.slice(0, 5)) { // Show first 5 subjects
        const staffWithExpertise = await Staff.find({
          departmentId: dept._id,
          expertiseSubjects: { $in: [subject._id] }
        });
        console.log(`  ${subject.name} (Sem ${subject.semester}): ${staffWithExpertise.length} staff available`);
      }
    }

    console.log('\n✅ Staff creation completed!');
    process.exit(0);
  } catch (error) {
    console.error('Error creating staff:', error);
    process.exit(1);
  }
};

createStaffWithExpertise();