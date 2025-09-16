const mongoose = require('mongoose');
require('dotenv').config();

const Department = require('./models/Department');
const Subject = require('./models/Subject');

const addSemesterSubjects = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing subjects
    await Subject.deleteMany({});

    const departments = await Department.find();

    for (const dept of departments) {
      console.log(`\nAdding subjects for ${dept.name} (${dept.code})`);

      // Standard subjects for each semester (6 subjects per semester)
      const subjectsBySemester = {
        1: [
          { name: 'Mathematics I', code: `${dept.code}101`, type: 'CORE', credits: 4, hoursPerWeek: 5 },
          { name: 'Physics I', code: `${dept.code}102`, type: 'CORE', credits: 3, hoursPerWeek: 5 },
          { name: 'Chemistry', code: `${dept.code}103`, type: 'CORE', credits: 3, hoursPerWeek: 5 },
          { name: 'English Communication', code: `${dept.code}104`, type: 'CORE', credits: 2, hoursPerWeek: 5 },
          { name: 'Engineering Graphics', code: `${dept.code}105`, type: 'CORE', credits: 2, hoursPerWeek: 5 },
          { name: 'Workshop Practice', code: `${dept.code}106`, type: 'CORE', credits: 1, hoursPerWeek: 5 }
        ],
        2: [
          { name: 'Mathematics II', code: `${dept.code}201`, type: 'CORE', credits: 4, hoursPerWeek: 5 },
          { name: 'Physics II', code: `${dept.code}202`, type: 'CORE', credits: 3, hoursPerWeek: 5 },
          { name: 'Programming Fundamentals', code: `${dept.code}203`, type: 'CORE', credits: 4, hoursPerWeek: 5 },
          { name: 'Environmental Science', code: `${dept.code}204`, type: 'CORE', credits: 2, hoursPerWeek: 5 },
          { name: 'Engineering Mechanics', code: `${dept.code}205`, type: 'CORE', credits: 3, hoursPerWeek: 5 },
          { name: 'Technical Drawing', code: `${dept.code}206`, type: 'CORE', credits: 2, hoursPerWeek: 5 }
        ],
        3: [
          { name: 'Data Structures', code: `${dept.code}301`, type: 'CORE', credits: 4, hoursPerWeek: 5 },
          { name: 'Digital Logic Design', code: `${dept.code}302`, type: 'CORE', credits: 3, hoursPerWeek: 5 },
          { name: 'Computer Organization', code: `${dept.code}303`, type: 'CORE', credits: 3, hoursPerWeek: 5 },
          { name: 'Discrete Mathematics', code: `${dept.code}304`, type: 'CORE', credits: 3, hoursPerWeek: 5 },
          { name: 'Technical Communication', code: `${dept.code}305`, type: 'CORE', credits: 2, hoursPerWeek: 5 },
          { name: 'Object Oriented Programming', code: `${dept.code}306`, type: 'CORE', credits: 3, hoursPerWeek: 5 }
        ],
        4: [
          { name: 'Algorithms', code: `${dept.code}401`, type: 'CORE', credits: 4, hoursPerWeek: 5 },
          { name: 'Database Systems', code: `${dept.code}402`, type: 'CORE', credits: 4, hoursPerWeek: 5 },
          { name: 'Operating Systems', code: `${dept.code}403`, type: 'CORE', credits: 3, hoursPerWeek: 5 },
          { name: 'Computer Networks', code: `${dept.code}404`, type: 'CORE', credits: 3, hoursPerWeek: 5 },
          { name: 'Software Engineering', code: `${dept.code}405`, type: 'CORE', credits: 3, hoursPerWeek: 5 },
          { name: 'Theory of Computation', code: `${dept.code}406`, type: 'CORE', credits: 3, hoursPerWeek: 5 }
        ],
        5: [
          { name: 'Machine Learning', code: `${dept.code}501`, type: 'CORE', credits: 4, hoursPerWeek: 5 },
          { name: 'Web Technologies', code: `${dept.code}502`, type: 'CORE', credits: 3, hoursPerWeek: 5 },
          { name: 'Compiler Design', code: `${dept.code}503`, type: 'CORE', credits: 3, hoursPerWeek: 5 },
          { name: 'Artificial Intelligence', code: `${dept.code}504`, type: 'ELECTIVE', credits: 3, hoursPerWeek: 5 },
          { name: 'Mobile App Development', code: `${dept.code}505`, type: 'ELECTIVE', credits: 3, hoursPerWeek: 5 },
          { name: 'Computer Graphics', code: `${dept.code}506`, type: 'CORE', credits: 3, hoursPerWeek: 5 }
        ],
        6: [
          { name: 'Deep Learning', code: `${dept.code}601`, type: 'CORE', credits: 4, hoursPerWeek: 5 },
          { name: 'Cloud Computing', code: `${dept.code}602`, type: 'CORE', credits: 3, hoursPerWeek: 5 },
          { name: 'Cybersecurity', code: `${dept.code}603`, type: 'CORE', credits: 3, hoursPerWeek: 5 },
          { name: 'Data Mining', code: `${dept.code}604`, type: 'ELECTIVE', credits: 3, hoursPerWeek: 5 },
          { name: 'IoT Systems', code: `${dept.code}605`, type: 'ELECTIVE', credits: 3, hoursPerWeek: 5 },
          { name: 'Distributed Systems', code: `${dept.code}606`, type: 'CORE', credits: 3, hoursPerWeek: 5 }
        ],
        7: [
          { name: 'Project Work I', code: `${dept.code}701`, type: 'CORE', credits: 4, hoursPerWeek: 5 },
          { name: 'Industry Internship', code: `${dept.code}702`, type: 'CORE', credits: 6, hoursPerWeek: 5 },
          { name: 'Advanced Algorithms', code: `${dept.code}703`, type: 'ELECTIVE', credits: 3, hoursPerWeek: 5 },
          { name: 'Blockchain Technology', code: `${dept.code}704`, type: 'ELECTIVE', credits: 3, hoursPerWeek: 5 },
          { name: 'Information Security', code: `${dept.code}705`, type: 'CORE', credits: 3, hoursPerWeek: 5 },
          { name: 'Software Testing', code: `${dept.code}706`, type: 'CORE', credits: 3, hoursPerWeek: 5 }
        ],
        8: [
          { name: 'Project Work II', code: `${dept.code}801`, type: 'CORE', credits: 6, hoursPerWeek: 5 },
          { name: 'Professional Ethics', code: `${dept.code}802`, type: 'CORE', credits: 2, hoursPerWeek: 5 },
          { name: 'Entrepreneurship', code: `${dept.code}803`, type: 'ELECTIVE', credits: 2, hoursPerWeek: 5 },
          { name: 'Research Methodology', code: `${dept.code}804`, type: 'ELECTIVE', credits: 3, hoursPerWeek: 5 },
          { name: 'Industry Trends', code: `${dept.code}805`, type: 'CORE', credits: 2, hoursPerWeek: 5 },
          { name: 'Seminar', code: `${dept.code}806`, type: 'CORE', credits: 1, hoursPerWeek: 5 }
        ]
      };

      // Add subjects for each semester
      for (let semester = 1; semester <= 8; semester++) {
        const semesterSubjects = subjectsBySemester[semester] || [];
        
        for (const subjectData of semesterSubjects) {
          const subject = new Subject({
            ...subjectData,
            semester,
            departmentId: dept._id
          });
          await subject.save();
          console.log(`  Semester ${semester}: ${subject.name}`);
        }
      }
    }

    console.log('\n=== Semester-specific subjects added successfully ===');
    process.exit(0);
  } catch (error) {
    console.error('Error adding subjects:', error);
    process.exit(1);
  }
};

addSemesterSubjects();