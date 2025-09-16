const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');
const Department = require('./models/Department');
const Subject = require('./models/Subject');
const Staff = require('./models/Staff');

const addMoreStaff = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const departments = await Department.find();

    const staffData = {
      'CSE': [
        { name: 'Dr. Alice Johnson', email: 'alice.cse@college.edu', subjects: ['Data Structures and Algorithms'] },
        { name: 'Prof. Bob Smith', email: 'bob.cse@college.edu', subjects: ['Database Management Systems'] },
        { name: 'Dr. Carol Davis', email: 'carol.cse@college.edu', subjects: ['Machine Learning', 'Web Development'] },
        { name: 'Prof. David Wilson', email: 'david.cse@college.edu', subjects: ['Data Structures and Algorithms', 'Database Management Systems'] }
      ],
      'ECE': [
        { name: 'Dr. Emma Brown', email: 'emma.ece@college.edu', subjects: ['Digital Electronics'] },
        { name: 'Prof. Frank Miller', email: 'frank.ece@college.edu', subjects: ['Signal Processing'] },
        { name: 'Dr. Grace Lee', email: 'grace.ece@college.edu', subjects: ['Communication Systems'] },
        { name: 'Prof. Henry Taylor', email: 'henry.ece@college.edu', subjects: ['Microprocessors'] }
      ],
      'MECH': [
        { name: 'Dr. Ivy Anderson', email: 'ivy.mech@college.edu', subjects: ['Thermodynamics'] },
        { name: 'Prof. Jack Thomas', email: 'jack.mech@college.edu', subjects: ['Fluid Mechanics'] },
        { name: 'Dr. Kate Jackson', email: 'kate.mech@college.edu', subjects: ['Machine Design'] },
        { name: 'Prof. Leo White', email: 'leo.mech@college.edu', subjects: ['Manufacturing Processes'] }
      ],
      'CIVIL': [
        { name: 'Dr. Maya Harris', email: 'maya.civil@college.edu', subjects: ['Structural Engineering'] },
        { name: 'Prof. Noah Martin', email: 'noah.civil@college.edu', subjects: ['Concrete Technology'] },
        { name: 'Dr. Olivia Garcia', email: 'olivia.civil@college.edu', subjects: ['Transportation Engineering'] },
        { name: 'Prof. Paul Rodriguez', email: 'paul.civil@college.edu', subjects: ['Environmental Engineering'] }
      ],
      'IT': [
        { name: 'Dr. Quinn Lewis', email: 'quinn.it@college.edu', subjects: ['Software Engineering'] },
        { name: 'Prof. Rachel Walker', email: 'rachel.it@college.edu', subjects: ['Database Management Systems'] },
        { name: 'Dr. Sam Hall', email: 'sam.it@college.edu', subjects: ['Web Technologies', 'Mobile App Development'] },
        { name: 'Prof. Tina Allen', email: 'tina.it@college.edu', subjects: ['Software Engineering', 'Web Technologies'] }
      ],
      'MECHATRONICS': [
        { name: 'Dr. Uma Young', email: 'uma.mechatronics@college.edu', subjects: ['Robotics and Automation'] },
        { name: 'Prof. Victor King', email: 'victor.mechatronics@college.edu', subjects: ['Control Systems'] },
        { name: 'Dr. Wendy Wright', email: 'wendy.mechatronics@college.edu', subjects: ['Industrial Automation', 'Embedded Systems'] },
        { name: 'Prof. Xavier Lopez', email: 'xavier.mechatronics@college.edu', subjects: ['Robotics and Automation', 'Control Systems'] }
      ]
    };

    for (const dept of departments) {
      const deptStaffData = staffData[dept.code] || [];
      
      for (const staffInfo of deptStaffData) {
        // Check if staff already exists
        const existingUser = await User.findOne({ email: staffInfo.email });
        if (existingUser) {
          console.log(`Staff ${staffInfo.email} already exists, skipping...`);
          continue;
        }

        // Find subjects by name
        const subjectIds = [];
        for (const subjectName of staffInfo.subjects) {
          const subject = await Subject.findOne({ 
            name: { $regex: subjectName, $options: 'i' },
            departmentId: dept._id 
          });
          if (subject) {
            subjectIds.push(subject._id);
          }
        }

        if (subjectIds.length === 0) {
          console.log(`No matching subjects found for ${staffInfo.name} in ${dept.name}`);
          continue;
        }

        // Create user account
        const staffUser = new User({
          name: staffInfo.name,
          email: staffInfo.email,
          password: 'staff123',
          role: 'STAFF',
          departmentId: dept._id
        });
        await staffUser.save();

        // Create staff profile
        const staff = new Staff({
          userId: staffUser._id,
          name: staffInfo.name,
          departmentId: dept._id,
          maxHours: 18,
          expertiseSubjects: subjectIds,
          currentWorkload: 0
        });
        await staff.save();

        console.log(`Created ${staffInfo.name} - Expert in: ${staffInfo.subjects.join(', ')}`);
      }
    }

    console.log('\n=== Additional Staff Created Successfully ===');
    console.log('\nAll Staff Login Credentials:');
    
    for (const dept of departments) {
      console.log(`\n${dept.name} (${dept.code}):`);
      const deptUsers = await User.find({ 
        role: 'STAFF', 
        departmentId: dept._id 
      });
      
      for (const user of deptUsers) {
        const staffProfile = await Staff.findOne({ userId: user._id }).populate('expertiseSubjects', 'name');
        const subjects = staffProfile ? staffProfile.expertiseSubjects.map(s => s.name).join(', ') : 'No subjects';
        console.log(`  ${user.email} / staff123 - Teaches: ${subjects}`);
      }
    }

    process.exit(0);
  } catch (error) {
    console.error('Error adding more staff:', error);
    process.exit(1);
  }
};

addMoreStaff();