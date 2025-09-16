const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');
const Department = require('./models/Department');
const Subject = require('./models/Subject');
const Staff = require('./models/Staff');

const createRealisticStaff = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing staff
    await Staff.deleteMany({});
    await User.deleteMany({ role: 'STAFF' });

    const departments = await Department.find();

    // Realistic staff names
    const staffNames = [
      'Dr. Rajesh Kumar', 'Prof. Priya Sharma', 'Dr. Amit Singh', 'Prof. Sunita Gupta',
      'Dr. Vikram Patel', 'Prof. Meera Joshi', 'Dr. Arjun Reddy', 'Prof. Kavita Nair',
      'Dr. Suresh Yadav', 'Prof. Anita Desai', 'Dr. Ravi Agarwal', 'Prof. Deepa Mehta',
      'Dr. Manoj Tiwari', 'Prof. Sushma Rao', 'Dr. Ashok Verma', 'Prof. Rekha Pandey',
      'Dr. Naveen Kumar', 'Prof. Pooja Saxena', 'Dr. Sanjay Mishra', 'Prof. Nisha Jain'
    ];

    let staffIndex = 0;

    for (const dept of departments) {
      console.log(`\nCreating staff for ${dept.name} (${dept.code})`);
      
      const subjects = await Subject.find({ departmentId: dept._id });
      const subjectGroups = {
        mathematics: subjects.filter(s => s.name.toLowerCase().includes('math')),
        physics: subjects.filter(s => s.name.toLowerCase().includes('physics')),
        programming: subjects.filter(s => s.name.toLowerCase().includes('programming') || s.name.toLowerCase().includes('data structures') || s.name.toLowerCase().includes('algorithm')),
        database: subjects.filter(s => s.name.toLowerCase().includes('database') || s.name.toLowerCase().includes('data mining')),
        networks: subjects.filter(s => s.name.toLowerCase().includes('network') || s.name.toLowerCase().includes('cloud')),
        ai: subjects.filter(s => s.name.toLowerCase().includes('machine learning') || s.name.toLowerCase().includes('artificial intelligence') || s.name.toLowerCase().includes('deep learning')),
        web: subjects.filter(s => s.name.toLowerCase().includes('web') || s.name.toLowerCase().includes('mobile')),
        security: subjects.filter(s => s.name.toLowerCase().includes('security') || s.name.toLowerCase().includes('cyber')),
        general: subjects.filter(s => !s.name.toLowerCase().includes('project') && !s.name.toLowerCase().includes('internship'))
      };

      // Create specialized staff for each subject group
      for (const [specialty, subjectList] of Object.entries(subjectGroups)) {
        if (subjectList.length > 0 && staffIndex < staffNames.length) {
          const staffName = staffNames[staffIndex];
          const email = `${staffName.toLowerCase().replace(/[^a-z]/g, '')}@college.edu`;
          
          // Create user account
          const staffUser = new User({
            name: staffName,
            email: email,
            password: 'staff123',
            role: 'STAFF',
            departmentId: dept._id
          });
          await staffUser.save();

          // Create staff profile
          const staff = new Staff({
            userId: staffUser._id,
            name: staffName,
            departmentId: dept._id,
            maxHours: 18,
            expertiseSubjects: subjectList.map(s => s._id),
            currentWorkload: 0
          });
          await staff.save();
          
          console.log(`  ${staffName} - Expert in: ${subjectList.map(s => s.name).join(', ')}`);
          staffIndex++;
        }
      }

      // Create general staff for remaining subjects
      const remainingSubjects = subjects.filter(s => 
        !s.name.toLowerCase().includes('project') && 
        !s.name.toLowerCase().includes('internship')
      );
      
      if (remainingSubjects.length > 0 && staffIndex < staffNames.length) {
        const staffName = staffNames[staffIndex];
        const email = `${staffName.toLowerCase().replace(/[^a-z]/g, '')}@college.edu`;
        
        const staffUser = new User({
          name: staffName,
          email: email,
          password: 'staff123',
          role: 'STAFF',
          departmentId: dept._id
        });
        await staffUser.save();

        const staff = new Staff({
          userId: staffUser._id,
          name: staffName,
          departmentId: dept._id,
          maxHours: 18,
          expertiseSubjects: remainingSubjects.map(s => s._id),
          currentWorkload: 0
        });
        await staff.save();
        
        console.log(`  ${staffName} - General Expert in: ${remainingSubjects.length} subjects`);
        staffIndex++;
      }
    }

    console.log('\n=== Realistic Staff Created Successfully ===');
    process.exit(0);
  } catch (error) {
    console.error('Error creating staff:', error);
    process.exit(1);
  }
};

createRealisticStaff();