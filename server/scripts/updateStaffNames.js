const mongoose = require('mongoose');
const Department = require('../models/Department');
const Staff = require('../models/Staff');
const User = require('../models/User');

const updateStaffNames = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/timetable_db');
    console.log('Connected to MongoDB');

    const realStaffNames = {
      'Computer Science Engineering': [
        'Dr. Rajesh Kumar',
        'Prof. Priya Sharma',
        'Dr. Amit Singh',
        'Prof. Neha Gupta',
        'Dr. Vikram Patel',
        'Prof. Sunita Rao',
        'Dr. Arjun Mehta',
        'Prof. Kavita Joshi'
      ],
      'Electronics and Communication': [
        'Dr. Suresh Reddy',
        'Prof. Meera Nair',
        'Dr. Ravi Agarwal',
        'Prof. Deepika Verma',
        'Dr. Manoj Tiwari',
        'Prof. Pooja Malhotra',
        'Dr. Kiran Kumar',
        'Prof. Anjali Desai'
      ],
      'Mechanical Engineering': [
        'Dr. Ashok Pandey',
        'Prof. Rekha Sinha',
        'Dr. Sanjay Mishra',
        'Prof. Geeta Bhatt',
        'Dr. Ramesh Yadav',
        'Prof. Shweta Jain',
        'Dr. Dinesh Chandra',
        'Prof. Usha Devi'
      ],
      'Civil Engineering': [
        'Dr. Prakash Jha',
        'Prof. Vandana Singh',
        'Dr. Sunil Saxena',
        'Prof. Ritu Agrawal',
        'Dr. Mahesh Gupta',
        'Prof. Seema Kapoor',
        'Dr. Ajay Sharma',
        'Prof. Nisha Bansal'
      ]
    };

    const departments = await Department.find();
    
    for (const dept of departments) {
      const staffList = await Staff.find({ departmentId: dept._id }).sort({ _id: 1 });
      const names = realStaffNames[dept.name] || [];
      
      console.log(`\nUpdating staff names for ${dept.name}:`);
      
      for (let i = 0; i < staffList.length && i < names.length; i++) {
        const staff = staffList[i];
        const newName = names[i];
        const newEmail = `${newName.toLowerCase().replace(/\s+/g, '.').replace('dr.', '').replace('prof.', '')}@college.edu`;
        
        // Update staff
        staff.name = newName;
        staff.email = newEmail;
        await staff.save();
        
        // Update corresponding user
        const user = await User.findById(staff.userId);
        if (user) {
          user.name = newName;
          user.email = newEmail;
          await user.save();
        }
        
        console.log(`  ✓ ${newName} (${newEmail})`);
      }
    }

    console.log('\n✅ Staff names updated successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error updating staff names:', error);
    process.exit(1);
  }
};

updateStaffNames();