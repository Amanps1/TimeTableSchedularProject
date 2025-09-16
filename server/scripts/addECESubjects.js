const mongoose = require('mongoose');
const Department = require('../models/Department');
const Subject = require('../models/Subject');

const addECESubjects = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/timetable_db');
    console.log('Connected to MongoDB');

    const eceDept = await Department.findOne({ name: 'Electronics and Communication' });
    if (!eceDept) {
      console.log('ECE Department not found');
      return;
    }

    const eceSubjects = {
      1: [
        { name: 'Circuit Analysis', code: 'EC101', type: 'CORE', credits: 4, hoursPerWeek: 4 },
        { name: 'Mathematics I', code: 'MA101', type: 'CORE', credits: 4, hoursPerWeek: 4 },
        { name: 'Physics', code: 'PH101', type: 'CORE', credits: 3, hoursPerWeek: 3 },
        { name: 'Chemistry', code: 'CH101', type: 'CORE', credits: 3, hoursPerWeek: 3 },
        { name: 'Engineering Graphics', code: 'EG101', type: 'CORE', credits: 3, hoursPerWeek: 3 }
      ],
      2: [
        { name: 'Electronic Devices', code: 'EC201', type: 'CORE', credits: 4, hoursPerWeek: 4 },
        { name: 'Mathematics II', code: 'MA201', type: 'CORE', credits: 4, hoursPerWeek: 4 },
        { name: 'Network Analysis', code: 'EC202', type: 'CORE', credits: 3, hoursPerWeek: 3 },
        { name: 'Digital Electronics', code: 'EC203', type: 'CORE', credits: 3, hoursPerWeek: 3 },
        { name: 'Programming in C', code: 'EC204', type: 'CORE', credits: 3, hoursPerWeek: 3 }
      ],
      3: [
        { name: 'Analog Circuits', code: 'EC301', type: 'CORE', credits: 4, hoursPerWeek: 4 },
        { name: 'Signals & Systems', code: 'EC302', type: 'CORE', credits: 4, hoursPerWeek: 4 },
        { name: 'Electromagnetic Fields', code: 'EC303', type: 'CORE', credits: 3, hoursPerWeek: 3 },
        { name: 'Microprocessors', code: 'EC304', type: 'CORE', credits: 3, hoursPerWeek: 3 },
        { name: 'Control Systems', code: 'EC305', type: 'CORE', credits: 3, hoursPerWeek: 3 }
      ],
      4: [
        { name: 'Communication Systems', code: 'EC401', type: 'CORE', credits: 4, hoursPerWeek: 4 },
        { name: 'Digital Signal Processing', code: 'EC402', type: 'CORE', credits: 4, hoursPerWeek: 4 },
        { name: 'VLSI Design', code: 'EC403', type: 'CORE', credits: 3, hoursPerWeek: 3 },
        { name: 'Antenna Theory', code: 'EC404', type: 'ELECTIVE', credits: 3, hoursPerWeek: 3 },
        { name: 'Embedded Systems', code: 'EC405', type: 'ELECTIVE', credits: 3, hoursPerWeek: 3 }
      ],
      5: [
        { name: 'Microwave Engineering', code: 'EC501', type: 'CORE', credits: 4, hoursPerWeek: 4 },
        { name: 'Digital Communications', code: 'EC502', type: 'CORE', credits: 4, hoursPerWeek: 4 },
        { name: 'Optical Communications', code: 'EC503', type: 'ELECTIVE', credits: 3, hoursPerWeek: 3 },
        { name: 'Wireless Communications', code: 'EC504', type: 'ELECTIVE', credits: 3, hoursPerWeek: 3 },
        { name: 'Satellite Communications', code: 'EC505', type: 'ELECTIVE', credits: 3, hoursPerWeek: 3 }
      ],
      6: [
        { name: 'Mobile Communications', code: 'EC601', type: 'CORE', credits: 4, hoursPerWeek: 4 },
        { name: 'Information Theory', code: 'EC602', type: 'CORE', credits: 4, hoursPerWeek: 4 },
        { name: 'Radar Systems', code: 'EC603', type: 'ELECTIVE', credits: 3, hoursPerWeek: 3 },
        { name: 'Biomedical Electronics', code: 'EC604', type: 'ELECTIVE', credits: 3, hoursPerWeek: 3 },
        { name: 'Power Electronics', code: 'EC605', type: 'ELECTIVE', credits: 3, hoursPerWeek: 3 }
      ],
      7: [
        { name: 'Project Work I', code: 'EC701', type: 'PROJECT', credits: 6, hoursPerWeek: 6 },
        { name: 'Advanced Communications', code: 'EC702', type: 'ELECTIVE', credits: 3, hoursPerWeek: 3 },
        { name: 'IoT Systems', code: 'EC703', type: 'ELECTIVE', credits: 3, hoursPerWeek: 3 },
        { name: 'Professional Ethics', code: 'EC704', type: 'CORE', credits: 2, hoursPerWeek: 2 }
      ],
      8: [
        { name: 'Project Work II', code: 'EC801', type: 'PROJECT', credits: 8, hoursPerWeek: 8 },
        { name: 'Industry Internship', code: 'EC802', type: 'PROJECT', credits: 4, hoursPerWeek: 4 },
        { name: 'Seminar', code: 'EC803', type: 'CORE', credits: 2, hoursPerWeek: 2 }
      ]
    };

    let totalAdded = 0;
    for (let semester = 1; semester <= 8; semester++) {
      const semesterSubjects = eceSubjects[semester] || [];
      for (const subjectData of semesterSubjects) {
        const subject = new Subject({
          ...subjectData,
          semester,
          departmentId: eceDept._id
        });
        await subject.save();
        totalAdded++;
      }
    }

    console.log(`Added ${totalAdded} subjects for Electronics and Communication`);
    process.exit(0);
  } catch (error) {
    console.error('Error adding ECE subjects:', error);
    process.exit(1);
  }
};

addECESubjects();