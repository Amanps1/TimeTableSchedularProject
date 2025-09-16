const mongoose = require('mongoose');
const Department = require('../models/Department');
const HOD = require('../models/HOD');
const User = require('../models/User');

const createHODs = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/timetable_db');
    console.log('Connected to MongoDB');

    // Clear existing HODs
    const existingHODs = await HOD.find();
    const hodUserIds = existingHODs.map(h => h.userId);
    await HOD.deleteMany({});
    await User.deleteMany({ _id: { $in: hodUserIds } });

    const departments = await Department.find();
    
    // HOD details for each department
    const hodData = {
      'Computer Science Engineering': {
        name: 'Dr. Rajesh Kumar Sharma',
        email: 'hod.cse@college.edu',
        phone: '+91-9876543210',
        qualification: 'Ph.D in Computer Science',
        experience: 15
      },
      'Electronics and Communication': {
        name: 'Dr. Anitha Krishnan',
        email: 'hod.ece@college.edu', 
        phone: '+91-9876543211',
        qualification: 'Ph.D in Electronics Engineering',
        experience: 12
      },
      'Mechanical Engineering': {
        name: 'Dr. Ashok Pandey',
        email: 'hod.mech@college.edu',
        phone: '+91-9876543212', 
        qualification: 'Ph.D in Mechanical Engineering',
        experience: 18
      },
      'Civil Engineering': {
        name: 'Dr. Prakash Jha',
        email: 'hod.civil@college.edu',
        phone: '+91-9876543213',
        qualification: 'Ph.D in Civil Engineering', 
        experience: 14
      }
    };

    console.log('Creating HODs for all departments...\n');

    for (const dept of departments) {
      const hodInfo = hodData[dept.name];
      if (!hodInfo) {
        console.log(`⚠️ No HOD data found for ${dept.name}`);
        continue;
      }

      try {
        // Create user account for HOD
        const user = new User({
          name: hodInfo.name,
          email: hodInfo.email,
          password: 'hod123', // Default password
          role: 'HOD',
          departmentId: dept._id
        });
        await user.save();

        // Create HOD profile
        const hod = new HOD({
          userId: user._id,
          name: hodInfo.name,
          email: hodInfo.email,
          departmentId: dept._id,
          phone: hodInfo.phone,
          qualification: hodInfo.qualification,
          experience: hodInfo.experience
        });
        await hod.save();

        console.log(`✅ Created HOD for ${dept.name}:`);
        console.log(`   Name: ${hodInfo.name}`);
        console.log(`   Email: ${hodInfo.email}`);
        console.log(`   Password: hod123`);
        console.log(`   Qualification: ${hodInfo.qualification}`);
        console.log(`   Experience: ${hodInfo.experience} years\n`);

      } catch (error) {
        console.log(`❌ Error creating HOD for ${dept.name}:`, error.message);
      }
    }

    // Verify HOD creation
    console.log('=== HOD VERIFICATION ===');
    const allHODs = await HOD.find().populate('departmentId', 'name');
    console.log(`Total HODs created: ${allHODs.length}\n`);

    allHODs.forEach(hod => {
      console.log(`🎓 ${hod.name} - ${hod.departmentId.name}`);
      console.log(`   📧 ${hod.email}`);
      console.log(`   📱 ${hod.phone}`);
      console.log(`   🎓 ${hod.qualification}`);
      console.log(`   ⏱️ ${hod.experience} years experience\n`);
    });

    console.log('✅ All HODs created successfully!');
    console.log('\n📝 HOD Login Credentials:');
    console.log('CSE HOD: hod.cse@college.edu / hod123');
    console.log('ECE HOD: hod.ece@college.edu / hod123'); 
    console.log('MECH HOD: hod.mech@college.edu / hod123');
    console.log('CIVIL HOD: hod.civil@college.edu / hod123');

    process.exit(0);
  } catch (error) {
    console.error('Error creating HODs:', error);
    process.exit(1);
  }
};

createHODs();