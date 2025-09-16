const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');
const Department = require('./models/Department');
const Subject = require('./models/Subject');
const Staff = require('./models/Staff');

const createProfessionalStaffWithSubjectCoverage = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing staff
    await Staff.deleteMany({});
    await User.deleteMany({ role: 'STAFF' });

    const departments = await Department.find();
    const allSubjects = await Subject.find();

    // Professional staff names pool
    const professionalStaffNames = [
      'Dr. Rajesh Kumar Singh', 'Prof. Priya Sharma Gupta', 'Dr. Amit Kumar Patel', 'Prof. Sunita Agarwal',
      'Dr. Vikram Singh Rathore', 'Prof. Meera Joshi Sharma', 'Dr. Arjun Reddy Naidu', 'Prof. Kavita Nair Menon',
      'Dr. Suresh Yadav Kumar', 'Prof. Anita Desai Shah', 'Dr. Ravi Agarwal Jain', 'Prof. Deepa Mehta Gupta',
      'Dr. Manoj Tiwari Singh', 'Prof. Sushma Rao Patel', 'Dr. Ashok Verma Kumar', 'Prof. Rekha Pandey Sharma',
      'Dr. Naveen Kumar Gupta', 'Prof. Pooja Saxena Agarwal', 'Dr. Sanjay Mishra Yadav', 'Prof. Nisha Jain Sharma',
      'Dr. Kiran Bedi Patel', 'Prof. Rohit Sharma Singh', 'Dr. Neha Agarwal Gupta', 'Prof. Ajay Gupta Kumar',
      'Dr. Seema Patel Jain', 'Prof. Rahul Singh Rathore', 'Dr. Madhuri Dixit Shah', 'Prof. Sachin Tendulkar Rao',
      'Dr. Aishwarya Rai Sharma', 'Prof. Hrithik Roshan Patel', 'Dr. Deepika Padukone Gupta', 'Prof. Ranveer Singh Kumar',
      'Dr. Alia Bhatt Agarwal', 'Prof. Ranbir Kapoor Singh', 'Dr. Katrina Kaif Sharma', 'Prof. Akshay Kumar Patel',
      'Dr. Vidya Balan Jain', 'Prof. Ayushmann Khurrana Gupta', 'Dr. Tabu Hashmi Shah', 'Prof. Irrfan Khan Rao',
      'Dr. Konkona Sen Sharma', 'Prof. Nawazuddin Siddiqui Patel', 'Dr. Radhika Apte Gupta', 'Prof. Pankaj Tripathi Kumar',
      'Dr. Shefali Shah Agarwal', 'Prof. Manoj Bajpayee Singh', 'Dr. Ratna Pathak Sharma', 'Prof. Naseeruddin Shah Patel',
      'Dr. Anupam Kher Gupta', 'Prof. Boman Irani Kumar', 'Dr. Paresh Rawal Singh', 'Prof. Rajpal Yadav Sharma',
      'Dr. Saurabh Shukla Patel', 'Prof. Kay Kay Menon Gupta', 'Dr. Adil Hussain Kumar', 'Prof. Vinay Pathak Singh',
      'Dr. Randeep Hooda Sharma', 'Prof. Arshad Warsi Patel', 'Dr. Rajkummar Rao Gupta', 'Prof. Vicky Kaushal Kumar',
      'Dr. Ayushmann Khurrana Singh', 'Prof. Kartik Aaryan Sharma', 'Dr. Sidharth Malhotra Patel', 'Prof. Varun Dhawan Gupta',
      'Dr. Shraddha Kapoor Kumar', 'Prof. Kriti Sanon Singh', 'Dr. Kiara Advani Sharma', 'Prof. Ananya Panday Patel',
      'Dr. Janhvi Kapoor Gupta', 'Prof. Sara Ali Khan Kumar', 'Dr. Tara Sutaria Singh', 'Prof. Bhumi Pednekar Sharma',
      'Dr. Rajesh Khanna Patel', 'Prof. Amitabh Bachchan Gupta', 'Dr. Shahrukh Khan Kumar', 'Prof. Aamir Khan Singh',
      'Dr. Salman Khan Sharma', 'Prof. Hrithik Roshan Patel', 'Dr. Ranbir Kapoor Gupta', 'Prof. Ranveer Singh Kumar'
    ];

    const createdStaff = [];
    let staffIndex = 0;

    // Create staff for each department
    for (const dept of departments) {
      console.log(`\nCreating staff for ${dept.name} (${dept.code})`);
      
      const deptSubjects = allSubjects.filter(s => s.departmentId.toString() === dept._id.toString());
      
      // Calculate staff needed: minimum 5 per subject, but optimize for efficiency
      const totalSubjects = deptSubjects.length;
      const staffNeeded = Math.max(25, Math.ceil(totalSubjects * 1.2)); // At least 25 staff per department
      
      console.log(`  Subjects: ${totalSubjects}, Creating: ${staffNeeded} staff`);

      for (let i = 0; i < staffNeeded && staffIndex < professionalStaffNames.length; i++) {
        const staffName = professionalStaffNames[staffIndex];
        
        // Generate professional email ID
        const nameForEmail = staffName.toLowerCase()
          .replace(/dr\.|prof\./g, '')
          .replace(/[^a-z\s]/g, '')
          .trim()
          .split(' ')
          .slice(0, 2) // Take first two names
          .join('.');
        
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

        // Create staff profile
        const staff = new Staff({
          userId: staffUser._id,
          name: staffName,
          email: email,
          departmentId: dept._id,
          maxHours: 18,
          expertiseSubjects: [], // Will be assigned later
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

    console.log('\n=== Assigning subjects to staff (minimum 5 staff per subject) ===');

    // Assign subjects to staff ensuring each subject has at least 5 staff members
    for (const subject of allSubjects) {
      const deptStaff = createdStaff.filter(s => s.departmentId.toString() === subject.departmentId.toString());
      
      if (deptStaff.length === 0) continue;
      
      // For electives and projects, assign fewer staff (2-3)
      const isSpecialSubject = subject.type === 'ELECTIVE' || 
                              subject.name.toLowerCase().includes('project') ||
                              subject.name.toLowerCase().includes('internship');
      
      const staffCount = isSpecialSubject ? 
        Math.min(3, Math.max(2, deptStaff.length)) : // 2-3 staff for special subjects
        Math.min(7, Math.max(5, deptStaff.length)); // 5-7 staff for regular subjects
      
      // Randomly select staff for this subject
      const shuffledStaff = deptStaff.sort(() => 0.5 - Math.random());
      const selectedStaff = shuffledStaff.slice(0, staffCount);
      
      // Update each selected staff's expertise
      for (const staffData of selectedStaff) {
        await Staff.findByIdAndUpdate(
          staffData.staff._id,
          { $addToSet: { expertiseSubjects: subject._id } }
        );
      }
      
      const subjectType = isSpecialSubject ? '(Special)' : '(Regular)';
      console.log(`  ${subject.name} ${subjectType} - Assigned to ${staffCount} staff members`);
    }

    // Display final assignment summary
    console.log('\n=== Final Staff Assignment Summary ===');
    const updatedStaff = await Staff.find().populate('expertiseSubjects', 'name code type');
    
    let totalRegularSubjects = 0;
    let totalSpecialSubjects = 0;
    
    for (const staff of updatedStaff) {
      const regularSubjects = staff.expertiseSubjects.filter(s => 
        s.type !== 'ELECTIVE' && 
        !s.name.toLowerCase().includes('project') && 
        !s.name.toLowerCase().includes('internship')
      );
      
      const specialSubjects = staff.expertiseSubjects.filter(s => 
        s.type === 'ELECTIVE' || 
        s.name.toLowerCase().includes('project') || 
        s.name.toLowerCase().includes('internship')
      );
      
      totalRegularSubjects += regularSubjects.length;
      totalSpecialSubjects += specialSubjects.length;
      
      console.log(`${staff.name}: ${staff.expertiseSubjects.length} subjects (${regularSubjects.length} regular, ${specialSubjects.length} special)`);
    }

    // Verification: Check subject coverage
    console.log('\n=== Subject Coverage Verification ===');
    for (const subject of allSubjects) {
      const assignedStaff = await Staff.find({
        expertiseSubjects: subject._id
      });
      
      const isSpecialSubject = subject.type === 'ELECTIVE' || 
                              subject.name.toLowerCase().includes('project') ||
                              subject.name.toLowerCase().includes('internship');
      
      const minRequired = isSpecialSubject ? 2 : 5;
      const status = assignedStaff.length >= minRequired ? '✅' : '❌';
      
      console.log(`${status} ${subject.name}: ${assignedStaff.length} staff (min: ${minRequired})`);
    }

    console.log('\n=== Professional Staff Creation Complete ===');
    console.log(`Total Staff Created: ${createdStaff.length}`);
    console.log(`Total Subjects: ${allSubjects.length}`);
    console.log(`Regular Subjects Coverage: ${totalRegularSubjects} assignments`);
    console.log(`Special Subjects Coverage: ${totalSpecialSubjects} assignments`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating professional staff:', error);
    process.exit(1);
  }
};

createProfessionalStaffWithSubjectCoverage();