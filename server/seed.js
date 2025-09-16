const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');
const Department = require('./models/Department');
const Section = require('./models/Section');
const Subject = require('./models/Subject');
const Staff = require('./models/Staff');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Department.deleteMany({}),
      Section.deleteMany({}),
      Subject.deleteMany({}),
      Staff.deleteMany({})
    ]);

    // Create Departments
    const departments = await Department.insertMany([
      { name: 'Computer Science Engineering', code: 'CSE' },
      { name: 'Electronics and Communication', code: 'ECE' },
      { name: 'Mechanical Engineering', code: 'MECH' },
      { name: 'Civil Engineering', code: 'CIVIL' }
    ]);

    // Create Users
    const users = await User.insertMany([
      {
        name: 'Admin User',
        email: 'admin@college.edu',
        password: 'admin123',
        role: 'ADMIN'
      },
      {
        name: 'HOD CSE',
        email: 'hod@college.edu',
        password: 'hod123',
        role: 'HOD',
        departmentId: departments[0]._id
      },
      {
        name: 'Dr. John Smith',
        email: 'staff@college.edu',
        password: 'staff123',
        role: 'STAFF',
        departmentId: departments[0]._id
      },
      {
        name: 'Student User',
        email: 'student@college.edu',
        password: 'student123',
        role: 'STUDENT',
        departmentId: departments[0]._id
      }
    ]);

    // Create Sections
    const sections = await Section.insertMany([
      {
        departmentId: departments[0]._id,
        year: 3,
        sectionName: 'CSE-A',
        studentCount: 70
      },
      {
        departmentId: departments[0]._id,
        year: 3,
        sectionName: 'CSE-B',
        studentCount: 68
      }
    ]);

    // Create Subjects for different semesters
    const subjects = await Subject.insertMany([
      // Semester 5 subjects
      {
        name: 'Data Structures and Algorithms',
        code: 'CS301',
        type: 'CORE',
        credits: 4,
        hoursPerWeek: 4,
        semester: 5,
        departmentId: departments[0]._id
      },
      {
        name: 'Database Management Systems',
        code: 'CS302',
        type: 'CORE',
        credits: 4,
        hoursPerWeek: 4,
        semester: 5,
        departmentId: departments[0]._id
      },
      {
        name: 'Computer Networks',
        code: 'CS303',
        type: 'CORE',
        credits: 3,
        hoursPerWeek: 3,
        semester: 5,
        departmentId: departments[0]._id
      },
      {
        name: 'Software Engineering',
        code: 'CS304',
        type: 'CORE',
        credits: 3,
        hoursPerWeek: 3,
        semester: 5,
        departmentId: departments[0]._id
      },
      {
        name: 'Machine Learning',
        code: 'CS401',
        type: 'ELECTIVE',
        credits: 3,
        hoursPerWeek: 3,
        semester: 5,
        departmentId: departments[0]._id
      },
      {
        name: 'Web Development',
        code: 'CS402',
        type: 'ELECTIVE',
        credits: 3,
        hoursPerWeek: 3,
        semester: 5,
        departmentId: departments[0]._id
      },
      // Semester 6 subjects
      {
        name: 'Artificial Intelligence',
        code: 'CS601',
        type: 'CORE',
        credits: 4,
        hoursPerWeek: 4,
        semester: 6,
        departmentId: departments[0]._id
      },
      {
        name: 'Compiler Design',
        code: 'CS602',
        type: 'CORE',
        credits: 3,
        hoursPerWeek: 3,
        semester: 6,
        departmentId: departments[0]._id
      },
      {
        name: 'Distributed Systems',
        code: 'CS603',
        type: 'CORE',
        credits: 3,
        hoursPerWeek: 3,
        semester: 6,
        departmentId: departments[0]._id
      },
      {
        name: 'Cyber Security',
        code: 'CS604',
        type: 'ELECTIVE',
        credits: 3,
        hoursPerWeek: 3,
        semester: 6,
        departmentId: departments[0]._id
      }
    ]);

    // Create additional users for staff
    const additionalUsers = await User.insertMany([
      {
        name: 'Dr. Sarah Johnson',
        email: 'sarah.johnson@cse.college.edu',
        password: 'staff123',
        role: 'STAFF',
        departmentId: departments[0]._id
      },
      {
        name: 'Prof. Michael Brown',
        email: 'michael.brown@cse.college.edu',
        password: 'staff123',
        role: 'STAFF',
        departmentId: departments[0]._id
      },
      {
        name: 'Dr. Emily Davis',
        email: 'emily.davis@cse.college.edu',
        password: 'staff123',
        role: 'STAFF',
        departmentId: departments[0]._id
      },
      {
        name: 'Prof. Robert Wilson',
        email: 'robert.wilson@cse.college.edu',
        password: 'staff123',
        role: 'STAFF',
        departmentId: departments[0]._id
      },
      {
        name: 'Dr. Lisa Anderson',
        email: 'lisa.anderson@cse.college.edu',
        password: 'staff123',
        role: 'STAFF',
        departmentId: departments[0]._id
      },
      {
        name: 'Prof. David Martinez',
        email: 'david.martinez@cse.college.edu',
        password: 'staff123',
        role: 'STAFF',
        departmentId: departments[0]._id
      }
    ]);

    // Create Staff with proper expertise mapping
    const staff = await Staff.insertMany([
      {
        userId: users[2]._id,
        name: 'Dr. John Smith',
        email: 'staff@college.edu',
        departmentId: departments[0]._id,
        maxHours: 18,
        expertiseSubjects: [subjects[0]._id, subjects[1]._id, subjects[6]._id] // DSA, DBMS, AI
      },
      {
        userId: users[1]._id,
        name: 'HOD CSE',
        email: 'hod@college.edu',
        departmentId: departments[0]._id,
        maxHours: 12,
        expertiseSubjects: [subjects[4]._id, subjects[9]._id] // ML, Cyber Security
      },
      {
        userId: additionalUsers[0]._id,
        name: 'Dr. Sarah Johnson',
        email: 'sarah.johnson@cse.college.edu',
        departmentId: departments[0]._id,
        maxHours: 18,
        expertiseSubjects: [subjects[2]._id, subjects[8]._id, subjects[9]._id] // Networks, Distributed Systems, Cyber Security
      },
      {
        userId: additionalUsers[1]._id,
        name: 'Prof. Michael Brown',
        email: 'michael.brown@cse.college.edu',
        departmentId: departments[0]._id,
        maxHours: 18,
        expertiseSubjects: [subjects[3]._id, subjects[5]._id] // Software Engineering, Web Development
      },
      {
        userId: additionalUsers[2]._id,
        name: 'Dr. Emily Davis',
        email: 'emily.davis@cse.college.edu',
        departmentId: departments[0]._id,
        maxHours: 18,
        expertiseSubjects: [subjects[0]._id, subjects[7]._id] // DSA, Compiler Design
      },
      {
        userId: additionalUsers[3]._id,
        name: 'Prof. Robert Wilson',
        email: 'robert.wilson@cse.college.edu',
        departmentId: departments[0]._id,
        maxHours: 18,
        expertiseSubjects: [subjects[1]._id, subjects[2]._id, subjects[8]._id] // DBMS, Networks, Distributed Systems
      },
      {
        userId: additionalUsers[4]._id,
        name: 'Dr. Lisa Anderson',
        email: 'lisa.anderson@cse.college.edu',
        departmentId: departments[0]._id,
        maxHours: 18,
        expertiseSubjects: [subjects[4]._id, subjects[6]._id] // ML, AI
      },
      {
        userId: additionalUsers[5]._id,
        name: 'Prof. David Martinez',
        email: 'david.martinez@cse.college.edu',
        departmentId: departments[0]._id,
        maxHours: 18,
        expertiseSubjects: [subjects[3]._id, subjects[5]._id, subjects[7]._id] // Software Engineering, Web Development, Compiler Design
      }
    ]);

    console.log('Seed data created successfully!');
    console.log('Demo credentials:');
    console.log('Admin: admin@college.edu / admin123');
    console.log('HOD: hod@college.edu / hod123');
    console.log('Staff: staff@college.edu / staff123');
    console.log('Student: student@college.edu / student123');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();