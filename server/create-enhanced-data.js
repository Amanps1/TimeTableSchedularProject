const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Department = require('./models/Department');
const Section = require('./models/Section');
const Subject = require('./models/Subject');
const Staff = require('./models/Staff');

const createEnhancedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Department.deleteMany({});
    await Section.deleteMany({});
    await Subject.deleteMany({});
    await Staff.deleteMany({});

    console.log('Cleared existing data');

    // Create departments
    const departments = await Department.insertMany([
      { name: 'Computer Science Engineering', code: 'CSE' },
      { name: 'Information Technology', code: 'IT' },
      { name: 'Electronics and Communication', code: 'ECE' },
      { name: 'Mechanical Engineering', code: 'MECH' },
      { name: 'Civil Engineering', code: 'CIVIL' }
    ]);

    console.log('Created departments');

    // Create sections for each department
    const sections = [];
    for (let dept of departments) {
      for (let year = 1; year <= 4; year++) {
        sections.push({
          sectionName: `${dept.code}-${year}A`,
          departmentId: dept._id,
          year,
          studentCount: Math.floor(Math.random() * 30) + 40 // 40-70 students
        });
        sections.push({
          sectionName: `${dept.code}-${year}B`,
          departmentId: dept._id,
          year,
          studentCount: Math.floor(Math.random() * 30) + 40
        });
      }
    }
    
    const createdSections = await Section.insertMany(sections);
    console.log('Created sections');

    // Create subjects for each department and semester
    const subjectTemplates = {
      1: [
        { name: 'Mathematics I', code: 'MATH101', type: 'CORE', credits: 4, hoursPerWeek: 4 },
        { name: 'Physics I', code: 'PHY101', type: 'CORE', credits: 3, hoursPerWeek: 3 },
        { name: 'Chemistry', code: 'CHEM101', type: 'CORE', credits: 3, hoursPerWeek: 3 },
        { name: 'Programming Fundamentals', code: 'PROG101', type: 'CORE', credits: 4, hoursPerWeek: 5 },
        { name: 'English Communication', code: 'ENG101', type: 'CORE', credits: 2, hoursPerWeek: 2 },
        { name: 'Environmental Science', code: 'ENV101', type: 'ELECTIVE', credits: 2, hoursPerWeek: 2 }
      ],
      2: [
        { name: 'Mathematics II', code: 'MATH102', type: 'CORE', credits: 4, hoursPerWeek: 4 },
        { name: 'Physics II', code: 'PHY102', type: 'CORE', credits: 3, hoursPerWeek: 3 },
        { name: 'Data Structures', code: 'DS201', type: 'CORE', credits: 4, hoursPerWeek: 5 },
        { name: 'Digital Logic Design', code: 'DLD201', type: 'CORE', credits: 3, hoursPerWeek: 4 },
        { name: 'Technical Writing', code: 'TW201', type: 'CORE', credits: 2, hoursPerWeek: 2 },
        { name: 'Soft Skills', code: 'SS201', type: 'ELECTIVE', credits: 2, hoursPerWeek: 2 }
      ],
      3: [
        { name: 'Mathematics III', code: 'MATH201', type: 'CORE', credits: 4, hoursPerWeek: 4 },
        { name: 'Computer Organization', code: 'CO301', type: 'CORE', credits: 3, hoursPerWeek: 4 },
        { name: 'Algorithms', code: 'ALGO301', type: 'CORE', credits: 4, hoursPerWeek: 5 },
        { name: 'Database Systems', code: 'DBMS301', type: 'CORE', credits: 4, hoursPerWeek: 5 },
        { name: 'Operating Systems', code: 'OS301', type: 'CORE', credits: 3, hoursPerWeek: 4 },
        { name: 'Web Technologies', code: 'WEB301', type: 'ELECTIVE', credits: 3, hoursPerWeek: 3 }
      ],
      4: [
        { name: 'Software Engineering', code: 'SE401', type: 'CORE', credits: 3, hoursPerWeek: 4 },
        { name: 'Computer Networks', code: 'CN401', type: 'CORE', credits: 3, hoursPerWeek: 4 },
        { name: 'Compiler Design', code: 'CD401', type: 'CORE', credits: 3, hoursPerWeek: 4 },
        { name: 'Theory of Computation', code: 'TOC401', type: 'CORE', credits: 3, hoursPerWeek: 3 },
        { name: 'Machine Learning', code: 'ML401', type: 'ELECTIVE', credits: 3, hoursPerWeek: 4 },
        { name: 'Artificial Intelligence', code: 'AI401', type: 'ELECTIVE', credits: 3, hoursPerWeek: 4 }
      ],
      5: [
        { name: 'Distributed Systems', code: 'DS501', type: 'CORE', credits: 3, hoursPerWeek: 4 },
        { name: 'Information Security', code: 'IS501', type: 'CORE', credits: 3, hoursPerWeek: 4 },
        { name: 'Mobile Computing', code: 'MC501', type: 'ELECTIVE', credits: 3, hoursPerWeek: 4 },
        { name: 'Cloud Computing', code: 'CC501', type: 'ELECTIVE', credits: 3, hoursPerWeek: 4 },
        { name: 'Data Mining', code: 'DM501', type: 'ELECTIVE', credits: 3, hoursPerWeek: 4 },
        { name: 'Major Project I', code: 'PROJ501', type: 'HONORS', credits: 4, hoursPerWeek: 6 }
      ],
      6: [
        { name: 'Software Testing', code: 'ST601', type: 'CORE', credits: 3, hoursPerWeek: 4 },
        { name: 'Human Computer Interaction', code: 'HCI601', type: 'CORE', credits: 2, hoursPerWeek: 3 },
        { name: 'Big Data Analytics', code: 'BDA601', type: 'ELECTIVE', credits: 3, hoursPerWeek: 4 },
        { name: 'Blockchain Technology', code: 'BCT601', type: 'ELECTIVE', credits: 3, hoursPerWeek: 4 },
        { name: 'Internet of Things', code: 'IOT601', type: 'ELECTIVE', credits: 3, hoursPerWeek: 4 },
        { name: 'Major Project II', code: 'PROJ601', type: 'HONORS', credits: 4, hoursPerWeek: 6 }
      ],
      7: [
        { name: 'Professional Ethics', code: 'PE701', type: 'CORE', credits: 2, hoursPerWeek: 2 },
        { name: 'Entrepreneurship', code: 'ENT701', type: 'CORE', credits: 2, hoursPerWeek: 2 },
        { name: 'Advanced Algorithms', code: 'AA701', type: 'ELECTIVE', credits: 3, hoursPerWeek: 4 },
        { name: 'Computer Vision', code: 'CV701', type: 'ELECTIVE', credits: 3, hoursPerWeek: 4 },
        { name: 'Natural Language Processing', code: 'NLP701', type: 'ELECTIVE', credits: 3, hoursPerWeek: 4 },
        { name: 'Capstone Project I', code: 'CAP701', type: 'HONORS', credits: 6, hoursPerWeek: 8 }
      ],
      8: [
        { name: 'Industry Internship', code: 'INT801', type: 'CORE', credits: 8, hoursPerWeek: 10 },
        { name: 'Research Methodology', code: 'RM801', type: 'CORE', credits: 2, hoursPerWeek: 2 },
        { name: 'Advanced Database Systems', code: 'ADB801', type: 'ELECTIVE', credits: 3, hoursPerWeek: 4 },
        { name: 'Quantum Computing', code: 'QC801', type: 'ELECTIVE', credits: 3, hoursPerWeek: 4 },
        { name: 'Capstone Project II', code: 'CAP801', type: 'HONORS', credits: 6, hoursPerWeek: 8 }
      ]
    };

    const subjects = [];
    for (let dept of departments) {
      for (let semester = 1; semester <= 8; semester++) {
        const semesterSubjects = subjectTemplates[semester] || [];
        for (let subjectTemplate of semesterSubjects) {
          subjects.push({
            ...subjectTemplate,
            code: `${dept.code}_${subjectTemplate.code}`,
            semester,
            departmentId: dept._id
          });
        }
      }
    }

    const createdSubjects = await Subject.insertMany(subjects);
    console.log('Created subjects');

    // Create admin user
    const adminUser = new User({
      name: 'System Admin',
      email: 'admin@college.edu',
      password: await bcrypt.hash('admin123', 10),
      role: 'ADMIN'
    });
    await adminUser.save();

    // Create HOD users
    const hodUsers = [];
    for (let dept of departments) {
      const hodUser = new User({
        name: `HOD ${dept.name}`,
        email: `hod.${dept.code.toLowerCase()}@college.edu`,
        password: await bcrypt.hash('hod123', 10),
        role: 'HOD',
        departmentId: dept._id
      });
      await hodUser.save();
      hodUsers.push(hodUser);
    }

    // Create staff with expertise in multiple subjects
    const staffData = [];
    const staffNames = [
      'Dr. Rajesh Kumar', 'Prof. Priya Sharma', 'Dr. Amit Singh', 'Prof. Neha Gupta',
      'Dr. Suresh Patel', 'Prof. Kavita Joshi', 'Dr. Vikram Rao', 'Prof. Sunita Verma',
      'Dr. Manoj Agarwal', 'Prof. Ritu Malhotra', 'Dr. Deepak Mehta', 'Prof. Pooja Saxena',
      'Dr. Rahul Tiwari', 'Prof. Anjali Mishra', 'Dr. Sanjay Dubey', 'Prof. Meera Pandey',
      'Dr. Ashok Yadav', 'Prof. Shweta Srivastava', 'Dr. Naveen Chandra', 'Prof. Rekha Jain'
    ];

    let staffIndex = 0;
    for (let dept of departments) {
      const deptSubjects = createdSubjects.filter(s => s.departmentId.toString() === dept._id.toString());
      
      // Create 8-10 staff members per department
      for (let i = 0; i < 10; i++) {
        const staffName = staffNames[staffIndex % staffNames.length];
        const email = `${staffName.toLowerCase().replace(/[^a-z]/g, '')}.${dept.code.toLowerCase()}.${i}@college.edu`;
        
        // Create user account
        const staffUser = new User({
          name: staffName,
          email,
          password: await bcrypt.hash('staff123', 10),
          role: 'STAFF',
          departmentId: dept._id
        });
        await staffUser.save();

        // Assign expertise to 3-5 subjects randomly
        const subjectCount = Math.floor(Math.random() * 3) + 3; // 3-5 subjects
        const expertiseSubjects = [];
        const shuffledSubjects = [...deptSubjects].sort(() => 0.5 - Math.random());
        
        for (let j = 0; j < Math.min(subjectCount, shuffledSubjects.length); j++) {
          expertiseSubjects.push(shuffledSubjects[j]._id);
        }

        const staff = new Staff({
          userId: staffUser._id,
          name: staffName,
          email,
          departmentId: dept._id,
          expertiseSubjects,
          maxHours: 18,
          currentWorkload: 0
        });

        staffData.push(staff);
        staffIndex++;
      }
    }

    await Staff.insertMany(staffData);
    console.log('Created staff with expertise');

    // Create student users
    const studentUsers = [];
    for (let i = 1; i <= 50; i++) {
      const studentUser = new User({
        name: `Student ${i}`,
        email: `student${i}@college.edu`,
        password: await bcrypt.hash('student123', 10),
        role: 'STUDENT',
        departmentId: departments[i % departments.length]._id
      });
      studentUsers.push(studentUser);
    }
    await User.insertMany(studentUsers);

    console.log('✅ Enhanced data creation completed successfully!');
    console.log(`Created:`);
    console.log(`- ${departments.length} departments`);
    console.log(`- ${createdSections.length} sections`);
    console.log(`- ${createdSubjects.length} subjects`);
    console.log(`- ${staffData.length} staff members`);
    console.log(`- ${studentUsers.length} students`);
    console.log(`- 1 admin user`);
    console.log(`- ${hodUsers.length} HOD users`);

    console.log('\n🔑 Login Credentials:');
    console.log('Admin: admin@college.edu / admin123');
    console.log('HOD CSE: hod.cse@college.edu / hod123');
    console.log('Staff: (check database for specific emails) / staff123');
    console.log('Student: student1@college.edu / student123');

  } catch (error) {
    console.error('Error creating enhanced data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

createEnhancedData();