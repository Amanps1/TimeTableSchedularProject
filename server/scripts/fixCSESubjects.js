const mongoose = require('mongoose');
const Department = require('../models/Department');
const Subject = require('../models/Subject');

const fixCSESubjects = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/timetable_db');
    console.log('Connected to MongoDB');

    // Find CSE department
    const cseDept = await Department.findOne({ name: 'Computer Science Engineering' });
    if (!cseDept) {
      console.log('CSE Department not found');
      return;
    }

    // CSE subjects for all semesters
    const cseSubjects = {
      1: [
        { name: 'Programming Fundamentals', code: 'CS101', type: 'CORE', credits: 4, hoursPerWeek: 4 },
        { name: 'Mathematics I', code: 'MA101', type: 'CORE', credits: 4, hoursPerWeek: 4 },
        { name: 'Physics', code: 'PH101', type: 'CORE', credits: 3, hoursPerWeek: 3 },
        { name: 'English Communication', code: 'EN101', type: 'CORE', credits: 3, hoursPerWeek: 3 },
        { name: 'Engineering Graphics', code: 'EG101', type: 'CORE', credits: 3, hoursPerWeek: 3 }
      ],
      2: [
        { name: 'Data Structures', code: 'CS201', type: 'CORE', credits: 4, hoursPerWeek: 4 },
        { name: 'Mathematics II', code: 'MA201', type: 'CORE', credits: 4, hoursPerWeek: 4 },
        { name: 'Digital Logic Design', code: 'CS202', type: 'CORE', credits: 3, hoursPerWeek: 3 },
        { name: 'Chemistry', code: 'CH201', type: 'CORE', credits: 3, hoursPerWeek: 3 },
        { name: 'Environmental Science', code: 'ES201', type: 'CORE', credits: 2, hoursPerWeek: 2 }
      ],
      3: [
        { name: 'Algorithms', code: 'CS301', type: 'CORE', credits: 4, hoursPerWeek: 4 },
        { name: 'Database Systems', code: 'CS302', type: 'CORE', credits: 4, hoursPerWeek: 4 },
        { name: 'Computer Organization', code: 'CS303', type: 'CORE', credits: 3, hoursPerWeek: 3 },
        { name: 'Discrete Mathematics', code: 'MA301', type: 'CORE', credits: 3, hoursPerWeek: 3 },
        { name: 'Object Oriented Programming', code: 'CS304', type: 'CORE', credits: 3, hoursPerWeek: 3 }
      ],
      4: [
        { name: 'Operating Systems', code: 'CS401', type: 'CORE', credits: 4, hoursPerWeek: 4 },
        { name: 'Computer Networks', code: 'CS402', type: 'CORE', credits: 4, hoursPerWeek: 4 },
        { name: 'Software Engineering', code: 'CS403', type: 'CORE', credits: 3, hoursPerWeek: 3 },
        { name: 'Theory of Computation', code: 'CS404', type: 'CORE', credits: 3, hoursPerWeek: 3 },
        { name: 'Web Technologies', code: 'CS405', type: 'ELECTIVE', credits: 3, hoursPerWeek: 3 }
      ],
      5: [
        { name: 'Compiler Design', code: 'CS501', type: 'CORE', credits: 4, hoursPerWeek: 4 },
        { name: 'Machine Learning', code: 'CS502', type: 'CORE', credits: 4, hoursPerWeek: 4 },
        { name: 'Computer Graphics', code: 'CS503', type: 'ELECTIVE', credits: 3, hoursPerWeek: 3 },
        { name: 'Artificial Intelligence', code: 'CS504', type: 'ELECTIVE', credits: 3, hoursPerWeek: 3 },
        { name: 'Mobile App Development', code: 'CS505', type: 'ELECTIVE', credits: 3, hoursPerWeek: 3 }
      ],
      6: [
        { name: 'Distributed Systems', code: 'CS601', type: 'CORE', credits: 4, hoursPerWeek: 4 },
        { name: 'Information Security', code: 'CS602', type: 'CORE', credits: 4, hoursPerWeek: 4 },
        { name: 'Cloud Computing', code: 'CS603', type: 'ELECTIVE', credits: 3, hoursPerWeek: 3 },
        { name: 'Data Mining', code: 'CS604', type: 'ELECTIVE', credits: 3, hoursPerWeek: 3 },
        { name: 'Blockchain Technology', code: 'CS605', type: 'ELECTIVE', credits: 3, hoursPerWeek: 3 }
      ],
      7: [
        { name: 'Project Work I', code: 'CS701', type: 'PROJECT', credits: 6, hoursPerWeek: 6 },
        { name: 'Advanced Algorithms', code: 'CS702', type: 'ELECTIVE', credits: 3, hoursPerWeek: 3 },
        { name: 'IoT Systems', code: 'CS703', type: 'ELECTIVE', credits: 3, hoursPerWeek: 3 },
        { name: 'Big Data Analytics', code: 'CS704', type: 'ELECTIVE', credits: 3, hoursPerWeek: 3 }
      ],
      8: [
        { name: 'Project Work II', code: 'CS801', type: 'PROJECT', credits: 8, hoursPerWeek: 8 },
        { name: 'Industry Internship', code: 'CS802', type: 'PROJECT', credits: 4, hoursPerWeek: 4 },
        { name: 'Research Methodology', code: 'CS803', type: 'CORE', credits: 2, hoursPerWeek: 2 }
      ]
    };

    // Remove existing CSE subjects
    await Subject.deleteMany({ departmentId: cseDept._id });

    let totalAdded = 0;
    for (let semester = 1; semester <= 8; semester++) {
      const semesterSubjects = cseSubjects[semester] || [];
      for (const subjectData of semesterSubjects) {
        const subject = new Subject({
          ...subjectData,
          semester,
          departmentId: cseDept._id
        });
        await subject.save();
        totalAdded++;
      }
    }

    console.log(`Added ${totalAdded} subjects for Computer Science Engineering`);
    process.exit(0);
  } catch (error) {
    console.error('Error fixing CSE subjects:', error);
    process.exit(1);
  }
};

fixCSESubjects();