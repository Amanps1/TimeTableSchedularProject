const mongoose = require('mongoose');
const Department = require('../models/Department');
const Subject = require('../models/Subject');
const Staff = require('../models/Staff');
const User = require('../models/User');

const seedData = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/timetable_db');
    console.log('Connected to MongoDB');

    // Get CSE department
    const cseDept = await Department.findOne({ name: 'Computer Science and Engineering' });
    if (!cseDept) {
      console.log('CSE Department not found');
      return;
    }

    // Sample subjects for different semesters
    const subjects = [
      // Semester 1
      { name: 'Programming Fundamentals', code: 'CS101', type: 'CORE', credits: 4, hoursPerWeek: 4, semester: 1, departmentId: cseDept._id },
      { name: 'Mathematics I', code: 'MA101', type: 'CORE', credits: 4, hoursPerWeek: 4, semester: 1, departmentId: cseDept._id },
      { name: 'Physics', code: 'PH101', type: 'CORE', credits: 3, hoursPerWeek: 3, semester: 1, departmentId: cseDept._id },
      
      // Semester 2
      { name: 'Data Structures', code: 'CS201', type: 'CORE', credits: 4, hoursPerWeek: 4, semester: 2, departmentId: cseDept._id },
      { name: 'Mathematics II', code: 'MA201', type: 'CORE', credits: 4, hoursPerWeek: 4, semester: 2, departmentId: cseDept._id },
      { name: 'Digital Logic', code: 'CS202', type: 'CORE', credits: 3, hoursPerWeek: 3, semester: 2, departmentId: cseDept._id },
      
      // Semester 3
      { name: 'Algorithms', code: 'CS301', type: 'CORE', credits: 4, hoursPerWeek: 4, semester: 3, departmentId: cseDept._id },
      { name: 'Database Systems', code: 'CS302', type: 'CORE', credits: 4, hoursPerWeek: 4, semester: 3, departmentId: cseDept._id },
      { name: 'Computer Networks', code: 'CS303', type: 'CORE', credits: 3, hoursPerWeek: 3, semester: 3, departmentId: cseDept._id },
      
      // Semester 4
      { name: 'Operating Systems', code: 'CS401', type: 'CORE', credits: 4, hoursPerWeek: 4, semester: 4, departmentId: cseDept._id },
      { name: 'Software Engineering', code: 'CS402', type: 'CORE', credits: 4, hoursPerWeek: 4, semester: 4, departmentId: cseDept._id },
      { name: 'Web Development', code: 'CS403', type: 'ELECTIVE', credits: 3, hoursPerWeek: 3, semester: 4, departmentId: cseDept._id },
    ];

    // Clear existing subjects for CSE
    await Subject.deleteMany({ departmentId: cseDept._id });
    
    // Insert subjects
    const insertedSubjects = await Subject.insertMany(subjects);
    console.log(`Inserted ${insertedSubjects.length} subjects`);

    // Sample staff with expertise
    const staffData = [
      {
        name: 'Dr. John Smith',
        email: 'john.smith@college.edu',
        password: 'staff123',
        departmentId: cseDept._id,
        maxHours: 18,
        expertiseSubjects: [] // Will be filled after subjects are created
      },
      {
        name: 'Prof. Sarah Johnson',
        email: 'sarah.johnson@college.edu', 
        password: 'staff123',
        departmentId: cseDept._id,
        maxHours: 18,
        expertiseSubjects: []
      },
      {
        name: 'Dr. Michael Brown',
        email: 'michael.brown@college.edu',
        password: 'staff123', 
        departmentId: cseDept._id,
        maxHours: 18,
        expertiseSubjects: []
      },
      {
        name: 'Prof. Emily Davis',
        email: 'emily.davis@college.edu',
        password: 'staff123',
        departmentId: cseDept._id,
        maxHours: 18,
        expertiseSubjects: []
      },
      {
        name: 'Dr. Robert Wilson',
        email: 'robert.wilson@college.edu',
        password: 'staff123',
        departmentId: cseDept._id,
        maxHours: 18,
        expertiseSubjects: []
      }
    ];

    // Assign expertise subjects
    const programmingSubjects = insertedSubjects.filter(s => 
      ['Programming Fundamentals', 'Data Structures', 'Algorithms'].includes(s.name)
    );
    const mathSubjects = insertedSubjects.filter(s => 
      s.name.includes('Mathematics')
    );
    const systemSubjects = insertedSubjects.filter(s => 
      ['Operating Systems', 'Computer Networks', 'Digital Logic'].includes(s.name)
    );
    const dbWebSubjects = insertedSubjects.filter(s => 
      ['Database Systems', 'Web Development', 'Software Engineering'].includes(s.name)
    );
    const physicsSubjects = insertedSubjects.filter(s => 
      s.name === 'Physics'
    );

    staffData[0].expertiseSubjects = programmingSubjects.map(s => s._id);
    staffData[1].expertiseSubjects = mathSubjects.map(s => s._id);
    staffData[2].expertiseSubjects = systemSubjects.map(s => s._id);
    staffData[3].expertiseSubjects = dbWebSubjects.map(s => s._id);
    staffData[4].expertiseSubjects = physicsSubjects.map(s => s._id);

    // Clear existing staff for CSE
    const existingStaff = await Staff.find({ departmentId: cseDept._id });
    const userIds = existingStaff.map(s => s.userId);
    await Staff.deleteMany({ departmentId: cseDept._id });
    await User.deleteMany({ _id: { $in: userIds } });

    // Create staff
    for (const staffInfo of staffData) {
      // Create user account
      const user = new User({
        name: staffInfo.name,
        email: staffInfo.email,
        password: staffInfo.password,
        role: 'STAFF',
        departmentId: staffInfo.departmentId
      });
      await user.save();

      // Create staff profile
      const staff = new Staff({
        userId: user._id,
        name: staffInfo.name,
        email: staffInfo.email,
        departmentId: staffInfo.departmentId,
        expertiseSubjects: staffInfo.expertiseSubjects,
        maxHours: staffInfo.maxHours,
        currentWorkload: 0
      });
      await staff.save();
      
      console.log(`Created staff: ${staffInfo.name} with ${staffInfo.expertiseSubjects.length} expertise subjects`);
    }

    console.log('Seed data created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();