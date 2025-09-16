const mongoose = require('mongoose');
const Department = require('../models/Department');
const Staff = require('../models/Staff');
const User = require('../models/User');

const updateFacultyNames = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/timetable_db');
    console.log('Connected to MongoDB');

    // Realistic faculty names for each department
    const facultyNames = {
      'Computer Science Engineering': [
        'Dr. Rajesh Kumar', 'Prof. Priya Sharma', 'Dr. Amit Singh', 'Prof. Neha Gupta',
        'Dr. Vikram Patel', 'Prof. Sunita Rao', 'Dr. Arjun Mehta', 'Prof. Kavita Joshi',
        'Dr. Suresh Reddy', 'Prof. Meera Nair', 'Dr. Ravi Agarwal', 'Prof. Deepika Verma',
        'Dr. Manoj Tiwari', 'Prof. Pooja Malhotra', 'Dr. Kiran Kumar', 'Prof. Anjali Desai',
        'Dr. Sanjay Mishra', 'Prof. Geeta Bhatt', 'Dr. Ramesh Yadav', 'Prof. Shweta Jain',
        'Dr. Dinesh Chandra', 'Prof. Usha Devi', 'Dr. Prakash Jha', 'Prof. Vandana Singh',
        'Dr. Sunil Saxena', 'Prof. Ritu Agrawal', 'Dr. Mahesh Gupta', 'Prof. Seema Kapoor',
        'Dr. Ajay Sharma', 'Prof. Nisha Bansal'
      ],
      'Electronics and Communication': [
        'Dr. Anitha Krishnan', 'Prof. Rajesh Menon', 'Dr. Kavya Iyer', 'Prof. Prakash Nair',
        'Dr. Arjun Pillai', 'Prof. Priya Mohan', 'Dr. Deepak Shenoy', 'Prof. Meera Bhat',
        'Dr. Kiran Rao', 'Prof. Swathi Hegde', 'Dr. Varun Kamath', 'Prof. Latha Pai',
        'Dr. Manoj Kulkarni', 'Prof. Keerthi Shetty', 'Dr. Ajay Gowda', 'Prof. Naveen Kumar',
        'Dr. Rekha Devi', 'Prof. Senthil Nathan', 'Dr. Ramesh Babu', 'Prof. Divya Prasad',
        'Dr. Harish Chandra', 'Prof. Sangeetha Raman', 'Dr. Vignesh Murthy', 'Prof. Sanjay Reddy',
        'Dr. Gayathri Nair', 'Prof. Surya Prakash', 'Dr. Shankar Rao', 'Prof. Mohan Das',
        'Dr. Anjali Menon', 'Prof. Bala Krishna'
      ],
      'Mechanical Engineering': [
        'Dr. Ashok Pandey', 'Prof. Rekha Sinha', 'Dr. Sanjay Mishra', 'Prof. Geeta Bhatt',
        'Dr. Ramesh Yadav', 'Prof. Shweta Jain', 'Dr. Dinesh Chandra', 'Prof. Usha Devi',
        'Dr. Prakash Jha', 'Prof. Vandana Singh', 'Dr. Sunil Saxena', 'Prof. Ritu Agrawal',
        'Dr. Mahesh Gupta', 'Prof. Seema Kapoor', 'Dr. Ajay Sharma', 'Prof. Nisha Bansal',
        'Dr. Vinod Kumar', 'Prof. Sunita Devi', 'Dr. Anil Verma', 'Prof. Rashmi Sharma',
        'Dr. Rajesh Tiwari', 'Prof. Kavita Singh', 'Dr. Mukesh Agarwal', 'Prof. Preeti Gupta',
        'Dr. Santosh Kumar', 'Prof. Anita Rao', 'Dr. Yogesh Patel', 'Prof. Sushma Joshi',
        'Dr. Naresh Chandra', 'Prof. Bharti Sharma'
      ],
      'Civil Engineering': [
        'Dr. Prakash Jha', 'Prof. Vandana Singh', 'Dr. Sunil Saxena', 'Prof. Ritu Agrawal',
        'Dr. Mahesh Gupta', 'Prof. Seema Kapoor', 'Dr. Ajay Sharma', 'Prof. Nisha Bansal',
        'Dr. Vinod Sharma', 'Prof. Sunita Verma', 'Dr. Anil Kumar', 'Prof. Rashmi Devi',
        'Dr. Rajesh Singh', 'Prof. Kavita Agarwal', 'Dr. Mukesh Tiwari', 'Prof. Preeti Sharma',
        'Dr. Santosh Yadav', 'Prof. Anita Gupta', 'Dr. Yogesh Mishra', 'Prof. Sushma Rao',
        'Dr. Naresh Kumar', 'Prof. Bharti Joshi', 'Dr. Ramesh Patel', 'Prof. Deepa Singh',
        'Dr. Suresh Agarwal', 'Prof. Manju Sharma', 'Dr. Rakesh Verma', 'Prof. Sonia Gupta',
        'Dr. Umesh Tiwari', 'Prof. Neelam Yadav'
      ]
    };

    const departments = await Department.find();
    
    for (const dept of departments) {
      const names = facultyNames[dept.name];
      if (!names) continue;

      const staffList = await Staff.find({ departmentId: dept._id }).sort({ _id: 1 });
      
      console.log(`\nUpdating ${staffList.length} faculty names for ${dept.name}:`);
      
      for (let i = 0; i < staffList.length && i < names.length; i++) {
        const staff = staffList[i];
        const newName = names[i];
        const newEmail = `${newName.toLowerCase().replace(/\s+/g, '.').replace('dr.', '').replace('prof.', '')}.${dept.name.toLowerCase().replace(/\s+/g, '')}@college.edu`;
        
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
        
        console.log(`  ✓ ${newName}`);
      }
    }

    console.log('\n✅ All faculty names updated with realistic names!');
    process.exit(0);
  } catch (error) {
    console.error('Error updating faculty names:', error);
    process.exit(1);
  }
};

updateFacultyNames();