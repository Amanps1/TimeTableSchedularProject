const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');
const Department = require('./models/Department');
const Subject = require('./models/Subject');
const Staff = require('./models/Staff');

const createStaffWithSubjectAssignment = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing staff
    await Staff.deleteMany({});
    await User.deleteMany({ role: 'STAFF' });

    const departments = await Department.find();
    const allSubjects = await Subject.find();

    // Expanded staff pool with unique names
    const staffPool = [
      'Dr. Rajesh Kumar', 'Prof. Priya Sharma', 'Dr. Amit Singh', 'Prof. Sunita Gupta',
      'Dr. Vikram Patel', 'Prof. Meera Joshi', 'Dr. Arjun Reddy', 'Prof. Kavita Nair',
      'Dr. Suresh Yadav', 'Prof. Anita Desai', 'Dr. Ravi Agarwal', 'Prof. Deepa Mehta',
      'Dr. Manoj Tiwari', 'Prof. Sushma Rao', 'Dr. Ashok Verma', 'Prof. Rekha Pandey',
      'Dr. Naveen Kumar', 'Prof. Pooja Saxena', 'Dr. Sanjay Mishra', 'Prof. Nisha Jain',
      'Dr. Kiran Bedi', 'Prof. Rohit Sharma', 'Dr. Neha Agarwal', 'Prof. Ajay Gupta',
      'Dr. Seema Patel', 'Prof. Rahul Singh', 'Dr. Madhuri Dixit', 'Prof. Sachin Tendulkar',
      'Dr. Aishwarya Rai', 'Prof. Hrithik Roshan', 'Dr. Deepika Padukone', 'Prof. Ranveer Singh',
      'Dr. Alia Bhatt', 'Prof. Ranbir Kapoor', 'Dr. Katrina Kaif', 'Prof. Akshay Kumar',
      'Dr. Vidya Balan', 'Prof. Ayushmann Khurrana', 'Dr. Tabu Hashmi', 'Prof. Irrfan Khan',
      'Dr. Konkona Sen', 'Prof. Nawazuddin Siddiqui', 'Dr. Radhika Apte', 'Prof. Pankaj Tripathi',
      'Dr. Shefali Shah', 'Prof. Manoj Bajpayee', 'Dr. Ratna Pathak', 'Prof. Naseeruddin Shah'
    ];

    const createdStaff = [];
    let staffIndex = 0;

    // Create staff for each department
    for (const dept of departments) {
      console.log(`\nCreating staff for ${dept.name} (${dept.code})`);
      
      const deptSubjects = allSubjects.filter(s => s.departmentId.toString() === dept._id.toString());
      const staffNeeded = Math.max(12, Math.ceil(deptSubjects.length * 0.8)); // Ensure enough staff
      
      for (let i = 0; i < staffNeeded && staffIndex < staffPool.length; i++) {
        const staffName = staffPool[staffIndex];
        
        // Generate unique email ID
        const nameForEmail = staffName.toLowerCase()
          .replace(/dr\.|prof\./g, '')
          .replace(/[^a-z\s]/g, '')
          .trim()
          .replace(/\s+/g, '.');
        
        const email = `${nameForEmail}@${dept.code.toLowerCase()}.college.edu`;
        
        // Create user account
        const staffUser = new User({
          name: staffName,
          email: email,
          password: 'staff123',
          role: 'STAFF',
          departmentId: dept._id
        });
        await staffUser.save();

        // Create staff profile (initially without subjects)
        const staff = new Staff({
          userId: staffUser._id,
          name: staffName,
          departmentId: dept._id,
          maxHours: 18,
          expertiseSubjects: [],
          currentWorkload: 0
        });
        await staff.save();
        
        createdStaff.push({
          staff: staff,
          departmentId: dept._id,
          email: email
        });
        
        console.log(`  ${staffName} - ${email}`);
        staffIndex++;
      }
    }

    console.log('\n=== Assigning subjects to staff (3-4 staff per subject) ===');

    // Assign subjects to staff ensuring each subject has 3-4 staff members
    for (const subject of allSubjects) {
      const deptStaff = createdStaff.filter(s => s.departmentId.toString() === subject.departmentId.toString());
      
      if (deptStaff.length === 0) continue;
      
      // Randomly select 3-4 staff members for this subject
      const staffCount = Math.min(4, Math.max(3, deptStaff.length));
      const shuffledStaff = deptStaff.sort(() => 0.5 - Math.random());
      const selectedStaff = shuffledStaff.slice(0, staffCount);
      
      // Update each selected staff's expertise
      for (const staffData of selectedStaff) {
        await Staff.findByIdAndUpdate(
          staffData.staff._id,
          { $addToSet: { expertiseSubjects: subject._id } }
        );
      }
      
      console.log(`  ${subject.name} (${subject.code}) - Assigned to ${staffCount} staff members`);
    }

    // Display final assignment summary
    console.log('\n=== Final Staff Assignment Summary ===');
    const updatedStaff = await Staff.find().populate('expertiseSubjects', 'name code');
    
    for (const staff of updatedStaff) {
      const staffEmail = createdStaff.find(s => s.staff._id.toString() === staff._id.toString())?.email;
      console.log(`${staff.name} (${staffEmail}): ${staff.expertiseSubjects.length} subjects`);
      staff.expertiseSubjects.forEach(subject => {
        console.log(`    - ${subject.name} (${subject.code})`);
      });
    }

    console.log('\n=== Staff with Subject Assignment Created Successfully ===');
    console.log(`Total Staff Created: ${createdStaff.length}`);
    console.log(`Total Subjects: ${allSubjects.length}`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating staff:', error);
    process.exit(1);
  }
};

createStaffWithSubjectAssignment();