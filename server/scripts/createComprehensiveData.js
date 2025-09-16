const mongoose = require('mongoose');
const Department = require('../models/Department');
const Subject = require('../models/Subject');
const Staff = require('../models/Staff');
const User = require('../models/User');

const createComprehensiveData = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/timetable_db');
    console.log('Connected to MongoDB');

    // Clear existing data
    await Subject.deleteMany({});
    await Staff.deleteMany({});
    await User.deleteMany({ role: 'STAFF' });

    const departments = await Department.find();
    
    // Define 6 subjects per semester for each department
    const departmentSubjects = {
      'Computer Science Engineering': {
        1: [
          { name: 'Programming Fundamentals', code: 'CS101', type: 'CORE', credits: 4, hoursPerWeek: 5 },
          { name: 'Mathematics I', code: 'MA101', type: 'CORE', credits: 4, hoursPerWeek: 5 },
          { name: 'Physics', code: 'PH101', type: 'CORE', credits: 3, hoursPerWeek: 5 },
          { name: 'English Communication', code: 'EN101', type: 'CORE', credits: 3, hoursPerWeek: 5 },
          { name: 'Engineering Graphics', code: 'EG101', type: 'CORE', credits: 3, hoursPerWeek: 5 },
          { name: 'Computer Fundamentals', code: 'CS102', type: 'CORE', credits: 3, hoursPerWeek: 5 }
        ],
        2: [
          { name: 'Data Structures', code: 'CS201', type: 'CORE', credits: 4, hoursPerWeek: 5 },
          { name: 'Mathematics II', code: 'MA201', type: 'CORE', credits: 4, hoursPerWeek: 5 },
          { name: 'Digital Logic Design', code: 'CS202', type: 'CORE', credits: 3, hoursPerWeek: 5 },
          { name: 'Chemistry', code: 'CH201', type: 'CORE', credits: 3, hoursPerWeek: 5 },
          { name: 'Environmental Science', code: 'ES201', type: 'CORE', credits: 2, hoursPerWeek: 5 },
          { name: 'Object Oriented Programming', code: 'CS203', type: 'CORE', credits: 4, hoursPerWeek: 5 }
        ],
        3: [
          { name: 'Algorithms', code: 'CS301', type: 'CORE', credits: 4, hoursPerWeek: 5 },
          { name: 'Database Systems', code: 'CS302', type: 'CORE', credits: 4, hoursPerWeek: 5 },
          { name: 'Computer Organization', code: 'CS303', type: 'CORE', credits: 3, hoursPerWeek: 5 },
          { name: 'Discrete Mathematics', code: 'MA301', type: 'CORE', credits: 3, hoursPerWeek: 5 },
          { name: 'Software Engineering', code: 'CS304', type: 'CORE', credits: 3, hoursPerWeek: 5 },
          { name: 'Computer Networks', code: 'CS305', type: 'CORE', credits: 4, hoursPerWeek: 5 }
        ],
        4: [
          { name: 'Operating Systems', code: 'CS401', type: 'CORE', credits: 4, hoursPerWeek: 5 },
          { name: 'Compiler Design', code: 'CS402', type: 'CORE', credits: 4, hoursPerWeek: 5 },
          { name: 'Theory of Computation', code: 'CS403', type: 'CORE', credits: 3, hoursPerWeek: 5 },
          { name: 'Web Technologies', code: 'CS404', type: 'ELECTIVE', credits: 3, hoursPerWeek: 5 },
          { name: 'Machine Learning', code: 'CS405', type: 'ELECTIVE', credits: 4, hoursPerWeek: 5 },
          { name: 'Artificial Intelligence', code: 'CS406', type: 'ELECTIVE', credits: 4, hoursPerWeek: 5 }
        ]
      },
      'Electronics and Communication': {
        1: [
          { name: 'Circuit Analysis', code: 'EC101', type: 'CORE', credits: 4, hoursPerWeek: 5 },
          { name: 'Mathematics I', code: 'MA101', type: 'CORE', credits: 4, hoursPerWeek: 5 },
          { name: 'Physics', code: 'PH101', type: 'CORE', credits: 3, hoursPerWeek: 5 },
          { name: 'Chemistry', code: 'CH101', type: 'CORE', credits: 3, hoursPerWeek: 5 },
          { name: 'Engineering Graphics', code: 'EG101', type: 'CORE', credits: 3, hoursPerWeek: 5 },
          { name: 'Electronic Devices', code: 'EC102', type: 'CORE', credits: 4, hoursPerWeek: 5 }
        ],
        2: [
          { name: 'Network Analysis', code: 'EC201', type: 'CORE', credits: 4, hoursPerWeek: 5 },
          { name: 'Mathematics II', code: 'MA201', type: 'CORE', credits: 4, hoursPerWeek: 5 },
          { name: 'Digital Electronics', code: 'EC202', type: 'CORE', credits: 3, hoursPerWeek: 5 },
          { name: 'Programming in C', code: 'EC203', type: 'CORE', credits: 3, hoursPerWeek: 5 },
          { name: 'Signals and Systems', code: 'EC204', type: 'CORE', credits: 4, hoursPerWeek: 5 },
          { name: 'Electromagnetic Fields', code: 'EC205', type: 'CORE', credits: 3, hoursPerWeek: 5 }
        ]
      },
      'Mechanical Engineering': {
        1: [
          { name: 'Engineering Mechanics', code: 'ME101', type: 'CORE', credits: 4, hoursPerWeek: 5 },
          { name: 'Mathematics I', code: 'MA101', type: 'CORE', credits: 4, hoursPerWeek: 5 },
          { name: 'Physics', code: 'PH101', type: 'CORE', credits: 3, hoursPerWeek: 5 },
          { name: 'Chemistry', code: 'CH101', type: 'CORE', credits: 3, hoursPerWeek: 5 },
          { name: 'Engineering Graphics', code: 'EG101', type: 'CORE', credits: 3, hoursPerWeek: 5 },
          { name: 'Manufacturing Processes', code: 'ME102', type: 'CORE', credits: 3, hoursPerWeek: 5 }
        ],
        2: [
          { name: 'Strength of Materials', code: 'ME201', type: 'CORE', credits: 4, hoursPerWeek: 5 },
          { name: 'Mathematics II', code: 'MA201', type: 'CORE', credits: 4, hoursPerWeek: 5 },
          { name: 'Thermodynamics', code: 'ME202', type: 'CORE', credits: 3, hoursPerWeek: 5 },
          { name: 'Material Science', code: 'ME203', type: 'CORE', credits: 3, hoursPerWeek: 5 },
          { name: 'Fluid Mechanics', code: 'ME204', type: 'CORE', credits: 4, hoursPerWeek: 5 },
          { name: 'Machine Drawing', code: 'ME205', type: 'CORE', credits: 3, hoursPerWeek: 5 }
        ]
      },
      'Civil Engineering': {
        1: [
          { name: 'Engineering Mechanics', code: 'CE101', type: 'CORE', credits: 4, hoursPerWeek: 5 },
          { name: 'Mathematics I', code: 'MA101', type: 'CORE', credits: 4, hoursPerWeek: 5 },
          { name: 'Physics', code: 'PH101', type: 'CORE', credits: 3, hoursPerWeek: 5 },
          { name: 'Chemistry', code: 'CH101', type: 'CORE', credits: 3, hoursPerWeek: 5 },
          { name: 'Engineering Graphics', code: 'EG101', type: 'CORE', credits: 3, hoursPerWeek: 5 },
          { name: 'Surveying', code: 'CE102', type: 'CORE', credits: 4, hoursPerWeek: 5 }
        ],
        2: [
          { name: 'Strength of Materials', code: 'CE201', type: 'CORE', credits: 4, hoursPerWeek: 5 },
          { name: 'Mathematics II', code: 'MA201', type: 'CORE', credits: 4, hoursPerWeek: 5 },
          { name: 'Building Materials', code: 'CE202', type: 'CORE', credits: 3, hoursPerWeek: 5 },
          { name: 'Fluid Mechanics', code: 'CE203', type: 'CORE', credits: 3, hoursPerWeek: 5 },
          { name: 'Environmental Engineering', code: 'CE204', type: 'CORE', credits: 3, hoursPerWeek: 5 },
          { name: 'Concrete Technology', code: 'CE205', type: 'CORE', credits: 4, hoursPerWeek: 5 }
        ]
      }
    };

    // Create subjects for each department
    const allSubjects = [];
    for (const dept of departments) {
      const deptSubjects = departmentSubjects[dept.name];
      if (deptSubjects) {
        for (let semester = 1; semester <= 4; semester++) {
          const semesterSubjects = deptSubjects[semester] || [];
          for (const subjectData of semesterSubjects) {
            const subject = new Subject({
              ...subjectData,
              semester,
              departmentId: dept._id
            });
            await subject.save();
            allSubjects.push({ ...subject.toObject(), departmentName: dept.name });
          }
        }
      }
    }

    console.log(`Created ${allSubjects.length} subjects`);

    // Create 30 staff members per department with expertise mapped to subjects
    for (const dept of departments) {
      const deptSubjects = allSubjects.filter(s => s.departmentId.toString() === dept._id.toString());
      
      // Create 30 staff members
      for (let i = 1; i <= 30; i++) {
        const staffName = `${dept.name.split(' ')[0]} Faculty ${i}`;
        const email = `${dept.name.toLowerCase().replace(/\s+/g, '')}.faculty${i}@college.edu`;
        
        // Assign 3-5 subjects as expertise to each staff member
        const numExpertise = Math.floor(Math.random() * 3) + 3; // 3-5 subjects
        const shuffledSubjects = [...deptSubjects].sort(() => Math.random() - 0.5);
        const expertiseSubjects = shuffledSubjects.slice(0, numExpertise).map(s => s._id);
        
        try {
          // Create user account
          const user = new User({
            name: staffName,
            email: email,
            password: 'staff123',
            role: 'STAFF',
            departmentId: dept._id
          });
          await user.save();

          // Create staff profile
          const staff = new Staff({
            userId: user._id,
            name: staffName,
            email: email,
            departmentId: dept._id,
            expertiseSubjects: expertiseSubjects,
            maxHours: 18,
            currentWorkload: 0
          });
          await staff.save();
          
        } catch (error) {
          console.log(`Error creating ${staffName}:`, error.message);
        }
      }
      
      console.log(`Created 30 staff members for ${dept.name}`);
    }

    // Verify coverage - ensure each subject has 5-6 staff
    console.log('\n=== SUBJECT COVERAGE VERIFICATION ===');
    for (const dept of departments) {
      console.log(`\n${dept.name}:`);
      const deptSubjects = await Subject.find({ departmentId: dept._id });
      
      for (const subject of deptSubjects) {
        const staffCount = await Staff.countDocuments({
          departmentId: dept._id,
          expertiseSubjects: { $in: [subject._id] }
        });
        
        const status = staffCount >= 5 ? '✅' : '⚠️';
        console.log(`  ${status} ${subject.name} (Sem ${subject.semester}): ${staffCount} staff`);
      }
    }

    console.log('\n✅ Comprehensive data creation completed!');
    process.exit(0);
  } catch (error) {
    console.error('Error creating comprehensive data:', error);
    process.exit(1);
  }
};

createComprehensiveData();