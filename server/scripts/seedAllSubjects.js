const mongoose = require('mongoose');
const Department = require('../models/Department');
const Subject = require('../models/Subject');

const seedAllSubjects = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/timetable_db');
    console.log('Connected to MongoDB');

    const departments = await Department.find();
    if (departments.length === 0) {
      console.log('No departments found');
      return;
    }

    // Clear existing subjects
    await Subject.deleteMany({});

    const subjectsByDepartment = {
      'Computer Science and Engineering': {
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
      },
      'Information Technology': {
        1: [
          { name: 'Programming Fundamentals', code: 'IT101', type: 'CORE', credits: 4, hoursPerWeek: 4 },
          { name: 'Mathematics I', code: 'MA101', type: 'CORE', credits: 4, hoursPerWeek: 4 },
          { name: 'Physics', code: 'PH101', type: 'CORE', credits: 3, hoursPerWeek: 3 },
          { name: 'English Communication', code: 'EN101', type: 'CORE', credits: 3, hoursPerWeek: 3 },
          { name: 'IT Fundamentals', code: 'IT102', type: 'CORE', credits: 3, hoursPerWeek: 3 }
        ],
        2: [
          { name: 'Data Structures', code: 'IT201', type: 'CORE', credits: 4, hoursPerWeek: 4 },
          { name: 'Mathematics II', code: 'MA201', type: 'CORE', credits: 4, hoursPerWeek: 4 },
          { name: 'Digital Electronics', code: 'IT202', type: 'CORE', credits: 3, hoursPerWeek: 3 },
          { name: 'Database Fundamentals', code: 'IT203', type: 'CORE', credits: 3, hoursPerWeek: 3 },
          { name: 'Web Programming', code: 'IT204', type: 'CORE', credits: 3, hoursPerWeek: 3 }
        ],
        3: [
          { name: 'Software Engineering', code: 'IT301', type: 'CORE', credits: 4, hoursPerWeek: 4 },
          { name: 'Database Management', code: 'IT302', type: 'CORE', credits: 4, hoursPerWeek: 4 },
          { name: 'Computer Networks', code: 'IT303', type: 'CORE', credits: 3, hoursPerWeek: 3 },
          { name: 'Operating Systems', code: 'IT304', type: 'CORE', credits: 3, hoursPerWeek: 3 },
          { name: 'Java Programming', code: 'IT305', type: 'CORE', credits: 3, hoursPerWeek: 3 }
        ],
        4: [
          { name: 'System Analysis & Design', code: 'IT401', type: 'CORE', credits: 4, hoursPerWeek: 4 },
          { name: 'Network Security', code: 'IT402', type: 'CORE', credits: 4, hoursPerWeek: 4 },
          { name: 'Mobile Computing', code: 'IT403', type: 'ELECTIVE', credits: 3, hoursPerWeek: 3 },
          { name: 'E-Commerce', code: 'IT404', type: 'ELECTIVE', credits: 3, hoursPerWeek: 3 },
          { name: 'Human Computer Interaction', code: 'IT405', type: 'ELECTIVE', credits: 3, hoursPerWeek: 3 }
        ],
        5: [
          { name: 'Enterprise Systems', code: 'IT501', type: 'CORE', credits: 4, hoursPerWeek: 4 },
          { name: 'Data Analytics', code: 'IT502', type: 'CORE', credits: 4, hoursPerWeek: 4 },
          { name: 'Cloud Technologies', code: 'IT503', type: 'ELECTIVE', credits: 3, hoursPerWeek: 3 },
          { name: 'Digital Marketing', code: 'IT504', type: 'ELECTIVE', credits: 3, hoursPerWeek: 3 },
          { name: 'IT Project Management', code: 'IT505', type: 'ELECTIVE', credits: 3, hoursPerWeek: 3 }
        ],
        6: [
          { name: 'Information Systems', code: 'IT601', type: 'CORE', credits: 4, hoursPerWeek: 4 },
          { name: 'Cyber Security', code: 'IT602', type: 'CORE', credits: 4, hoursPerWeek: 4 },
          { name: 'Business Intelligence', code: 'IT603', type: 'ELECTIVE', credits: 3, hoursPerWeek: 3 },
          { name: 'DevOps', code: 'IT604', type: 'ELECTIVE', credits: 3, hoursPerWeek: 3 },
          { name: 'Quality Assurance', code: 'IT605', type: 'ELECTIVE', credits: 3, hoursPerWeek: 3 }
        ],
        7: [
          { name: 'Major Project I', code: 'IT701', type: 'PROJECT', credits: 6, hoursPerWeek: 6 },
          { name: 'Advanced Database', code: 'IT702', type: 'ELECTIVE', credits: 3, hoursPerWeek: 3 },
          { name: 'Emerging Technologies', code: 'IT703', type: 'ELECTIVE', credits: 3, hoursPerWeek: 3 },
          { name: 'IT Ethics', code: 'IT704', type: 'CORE', credits: 2, hoursPerWeek: 2 }
        ],
        8: [
          { name: 'Major Project II', code: 'IT801', type: 'PROJECT', credits: 8, hoursPerWeek: 8 },
          { name: 'Industry Training', code: 'IT802', type: 'PROJECT', credits: 4, hoursPerWeek: 4 },
          { name: 'Seminar', code: 'IT803', type: 'CORE', credits: 2, hoursPerWeek: 2 }
        ]
      },
      'Mechanical Engineering': {
        1: [
          { name: 'Engineering Mechanics', code: 'ME101', type: 'CORE', credits: 4, hoursPerWeek: 4 },
          { name: 'Mathematics I', code: 'MA101', type: 'CORE', credits: 4, hoursPerWeek: 4 },
          { name: 'Physics', code: 'PH101', type: 'CORE', credits: 3, hoursPerWeek: 3 },
          { name: 'Chemistry', code: 'CH101', type: 'CORE', credits: 3, hoursPerWeek: 3 },
          { name: 'Engineering Graphics', code: 'EG101', type: 'CORE', credits: 3, hoursPerWeek: 3 }
        ],
        2: [
          { name: 'Strength of Materials', code: 'ME201', type: 'CORE', credits: 4, hoursPerWeek: 4 },
          { name: 'Mathematics II', code: 'MA201', type: 'CORE', credits: 4, hoursPerWeek: 4 },
          { name: 'Thermodynamics', code: 'ME202', type: 'CORE', credits: 3, hoursPerWeek: 3 },
          { name: 'Material Science', code: 'ME203', type: 'CORE', credits: 3, hoursPerWeek: 3 },
          { name: 'Manufacturing Processes', code: 'ME204', type: 'CORE', credits: 3, hoursPerWeek: 3 }
        ],
        3: [
          { name: 'Machine Design', code: 'ME301', type: 'CORE', credits: 4, hoursPerWeek: 4 },
          { name: 'Fluid Mechanics', code: 'ME302', type: 'CORE', credits: 4, hoursPerWeek: 4 },
          { name: 'Heat Transfer', code: 'ME303', type: 'CORE', credits: 3, hoursPerWeek: 3 },
          { name: 'Kinematics of Machines', code: 'ME304', type: 'CORE', credits: 3, hoursPerWeek: 3 },
          { name: 'Engineering Materials', code: 'ME305', type: 'CORE', credits: 3, hoursPerWeek: 3 }
        ],
        4: [
          { name: 'Dynamics of Machines', code: 'ME401', type: 'CORE', credits: 4, hoursPerWeek: 4 },
          { name: 'Thermal Engineering', code: 'ME402', type: 'CORE', credits: 4, hoursPerWeek: 4 },
          { name: 'Production Technology', code: 'ME403', type: 'CORE', credits: 3, hoursPerWeek: 3 },
          { name: 'Automobile Engineering', code: 'ME404', type: 'ELECTIVE', credits: 3, hoursPerWeek: 3 },
          { name: 'Refrigeration & AC', code: 'ME405', type: 'ELECTIVE', credits: 3, hoursPerWeek: 3 }
        ],
        5: [
          { name: 'Power Plant Engineering', code: 'ME501', type: 'CORE', credits: 4, hoursPerWeek: 4 },
          { name: 'Industrial Engineering', code: 'ME502', type: 'CORE', credits: 4, hoursPerWeek: 4 },
          { name: 'CAD/CAM', code: 'ME503', type: 'ELECTIVE', credits: 3, hoursPerWeek: 3 },
          { name: 'Robotics', code: 'ME504', type: 'ELECTIVE', credits: 3, hoursPerWeek: 3 },
          { name: 'Renewable Energy', code: 'ME505', type: 'ELECTIVE', credits: 3, hoursPerWeek: 3 }
        ],
        6: [
          { name: 'Control Systems', code: 'ME601', type: 'CORE', credits: 4, hoursPerWeek: 4 },
          { name: 'Operations Research', code: 'ME602', type: 'CORE', credits: 4, hoursPerWeek: 4 },
          { name: 'Mechatronics', code: 'ME603', type: 'ELECTIVE', credits: 3, hoursPerWeek: 3 },
          { name: 'Quality Control', code: 'ME604', type: 'ELECTIVE', credits: 3, hoursPerWeek: 3 },
          { name: 'Supply Chain Management', code: 'ME605', type: 'ELECTIVE', credits: 3, hoursPerWeek: 3 }
        ],
        7: [
          { name: 'Project Work I', code: 'ME701', type: 'PROJECT', credits: 6, hoursPerWeek: 6 },
          { name: 'Advanced Manufacturing', code: 'ME702', type: 'ELECTIVE', credits: 3, hoursPerWeek: 3 },
          { name: 'Finite Element Analysis', code: 'ME703', type: 'ELECTIVE', credits: 3, hoursPerWeek: 3 },
          { name: 'Engineering Economics', code: 'ME704', type: 'CORE', credits: 2, hoursPerWeek: 2 }
        ],
        8: [
          { name: 'Project Work II', code: 'ME801', type: 'PROJECT', credits: 8, hoursPerWeek: 8 },
          { name: 'Industrial Training', code: 'ME802', type: 'PROJECT', credits: 4, hoursPerWeek: 4 },
          { name: 'Professional Ethics', code: 'ME803', type: 'CORE', credits: 2, hoursPerWeek: 2 }
        ]
      },
      'Electronics and Communication Engineering': {
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
      },
      'Civil Engineering': {
        1: [
          { name: 'Engineering Mechanics', code: 'CE101', type: 'CORE', credits: 4, hoursPerWeek: 4 },
          { name: 'Mathematics I', code: 'MA101', type: 'CORE', credits: 4, hoursPerWeek: 4 },
          { name: 'Physics', code: 'PH101', type: 'CORE', credits: 3, hoursPerWeek: 3 },
          { name: 'Chemistry', code: 'CH101', type: 'CORE', credits: 3, hoursPerWeek: 3 },
          { name: 'Engineering Graphics', code: 'EG101', type: 'CORE', credits: 3, hoursPerWeek: 3 }
        ],
        2: [
          { name: 'Strength of Materials', code: 'CE201', type: 'CORE', credits: 4, hoursPerWeek: 4 },
          { name: 'Mathematics II', code: 'MA201', type: 'CORE', credits: 4, hoursPerWeek: 4 },
          { name: 'Building Materials', code: 'CE202', type: 'CORE', credits: 3, hoursPerWeek: 3 },
          { name: 'Surveying', code: 'CE203', type: 'CORE', credits: 3, hoursPerWeek: 3 },
          { name: 'Fluid Mechanics', code: 'CE204', type: 'CORE', credits: 3, hoursPerWeek: 3 }
        ],
        3: [
          { name: 'Structural Analysis', code: 'CE301', type: 'CORE', credits: 4, hoursPerWeek: 4 },
          { name: 'Concrete Technology', code: 'CE302', type: 'CORE', credits: 4, hoursPerWeek: 4 },
          { name: 'Geotechnical Engineering', code: 'CE303', type: 'CORE', credits: 3, hoursPerWeek: 3 },
          { name: 'Hydraulics', code: 'CE304', type: 'CORE', credits: 3, hoursPerWeek: 3 },
          { name: 'Transportation Engineering', code: 'CE305', type: 'CORE', credits: 3, hoursPerWeek: 3 }
        ],
        4: [
          { name: 'RCC Design', code: 'CE401', type: 'CORE', credits: 4, hoursPerWeek: 4 },
          { name: 'Steel Design', code: 'CE402', type: 'CORE', credits: 4, hoursPerWeek: 4 },
          { name: 'Environmental Engineering', code: 'CE403', type: 'CORE', credits: 3, hoursPerWeek: 3 },
          { name: 'Highway Engineering', code: 'CE404', type: 'ELECTIVE', credits: 3, hoursPerWeek: 3 },
          { name: 'Water Resources', code: 'CE405', type: 'ELECTIVE', credits: 3, hoursPerWeek: 3 }
        ],
        5: [
          { name: 'Foundation Engineering', code: 'CE501', type: 'CORE', credits: 4, hoursPerWeek: 4 },
          { name: 'Construction Management', code: 'CE502', type: 'CORE', credits: 4, hoursPerWeek: 4 },
          { name: 'Earthquake Engineering', code: 'CE503', type: 'ELECTIVE', credits: 3, hoursPerWeek: 3 },
          { name: 'Bridge Engineering', code: 'CE504', type: 'ELECTIVE', credits: 3, hoursPerWeek: 3 },
          { name: 'GIS Applications', code: 'CE505', type: 'ELECTIVE', credits: 3, hoursPerWeek: 3 }
        ],
        6: [
          { name: 'Advanced Structures', code: 'CE601', type: 'CORE', credits: 4, hoursPerWeek: 4 },
          { name: 'Project Planning', code: 'CE602', type: 'CORE', credits: 4, hoursPerWeek: 4 },
          { name: 'Coastal Engineering', code: 'CE603', type: 'ELECTIVE', credits: 3, hoursPerWeek: 3 },
          { name: 'Urban Planning', code: 'CE604', type: 'ELECTIVE', credits: 3, hoursPerWeek: 3 },
          { name: 'Green Building', code: 'CE605', type: 'ELECTIVE', credits: 3, hoursPerWeek: 3 }
        ],
        7: [
          { name: 'Project Work I', code: 'CE701', type: 'PROJECT', credits: 6, hoursPerWeek: 6 },
          { name: 'Advanced Concrete', code: 'CE702', type: 'ELECTIVE', credits: 3, hoursPerWeek: 3 },
          { name: 'Structural Dynamics', code: 'CE703', type: 'ELECTIVE', credits: 3, hoursPerWeek: 3 },
          { name: 'Engineering Economics', code: 'CE704', type: 'CORE', credits: 2, hoursPerWeek: 2 }
        ],
        8: [
          { name: 'Project Work II', code: 'CE801', type: 'PROJECT', credits: 8, hoursPerWeek: 8 },
          { name: 'Industrial Training', code: 'CE802', type: 'PROJECT', credits: 4, hoursPerWeek: 4 },
          { name: 'Professional Practice', code: 'CE803', type: 'CORE', credits: 2, hoursPerWeek: 2 }
        ]
      },
      'Mechatronics Engineering': {
        1: [
          { name: 'Engineering Mechanics', code: 'MT101', type: 'CORE', credits: 4, hoursPerWeek: 4 },
          { name: 'Mathematics I', code: 'MA101', type: 'CORE', credits: 4, hoursPerWeek: 4 },
          { name: 'Physics', code: 'PH101', type: 'CORE', credits: 3, hoursPerWeek: 3 },
          { name: 'Chemistry', code: 'CH101', type: 'CORE', credits: 3, hoursPerWeek: 3 },
          { name: 'Programming Fundamentals', code: 'MT102', type: 'CORE', credits: 3, hoursPerWeek: 3 }
        ],
        2: [
          { name: 'Circuit Analysis', code: 'MT201', type: 'CORE', credits: 4, hoursPerWeek: 4 },
          { name: 'Mathematics II', code: 'MA201', type: 'CORE', credits: 4, hoursPerWeek: 4 },
          { name: 'Digital Electronics', code: 'MT202', type: 'CORE', credits: 3, hoursPerWeek: 3 },
          { name: 'Mechanical Engineering Drawing', code: 'MT203', type: 'CORE', credits: 3, hoursPerWeek: 3 },
          { name: 'Material Science', code: 'MT204', type: 'CORE', credits: 3, hoursPerWeek: 3 }
        ],
        3: [
          { name: 'Control Systems', code: 'MT301', type: 'CORE', credits: 4, hoursPerWeek: 4 },
          { name: 'Microprocessors', code: 'MT302', type: 'CORE', credits: 4, hoursPerWeek: 4 },
          { name: 'Sensors & Actuators', code: 'MT303', type: 'CORE', credits: 3, hoursPerWeek: 3 },
          { name: 'Machine Design', code: 'MT304', type: 'CORE', credits: 3, hoursPerWeek: 3 },
          { name: 'Thermodynamics', code: 'MT305', type: 'CORE', credits: 3, hoursPerWeek: 3 }
        ],
        4: [
          { name: 'Robotics', code: 'MT401', type: 'CORE', credits: 4, hoursPerWeek: 4 },
          { name: 'Embedded Systems', code: 'MT402', type: 'CORE', credits: 4, hoursPerWeek: 4 },
          { name: 'Automation Systems', code: 'MT403', type: 'CORE', credits: 3, hoursPerWeek: 3 },
          { name: 'PLC Programming', code: 'MT404', type: 'ELECTIVE', credits: 3, hoursPerWeek: 3 },
          { name: 'SCADA Systems', code: 'MT405', type: 'ELECTIVE', credits: 3, hoursPerWeek: 3 }
        ],
        5: [
          { name: 'Advanced Robotics', code: 'MT501', type: 'CORE', credits: 4, hoursPerWeek: 4 },
          { name: 'Industrial Automation', code: 'MT502', type: 'CORE', credits: 4, hoursPerWeek: 4 },
          { name: 'Machine Vision', code: 'MT503', type: 'ELECTIVE', credits: 3, hoursPerWeek: 3 },
          { name: 'Artificial Intelligence', code: 'MT504', type: 'ELECTIVE', credits: 3, hoursPerWeek: 3 },
          { name: 'Mechatronic Design', code: 'MT505', type: 'ELECTIVE', credits: 3, hoursPerWeek: 3 }
        ],
        6: [
          { name: 'System Integration', code: 'MT601', type: 'CORE', credits: 4, hoursPerWeek: 4 },
          { name: 'Advanced Control', code: 'MT602', type: 'CORE', credits: 4, hoursPerWeek: 4 },
          { name: 'IoT Systems', code: 'MT603', type: 'ELECTIVE', credits: 3, hoursPerWeek: 3 },
          { name: 'Smart Manufacturing', code: 'MT604', type: 'ELECTIVE', credits: 3, hoursPerWeek: 3 },
          { name: 'Quality Control', code: 'MT605', type: 'ELECTIVE', credits: 3, hoursPerWeek: 3 }
        ],
        7: [
          { name: 'Project Work I', code: 'MT701', type: 'PROJECT', credits: 6, hoursPerWeek: 6 },
          { name: 'Advanced Mechatronics', code: 'MT702', type: 'ELECTIVE', credits: 3, hoursPerWeek: 3 },
          { name: 'Autonomous Systems', code: 'MT703', type: 'ELECTIVE', credits: 3, hoursPerWeek: 3 },
          { name: 'Engineering Management', code: 'MT704', type: 'CORE', credits: 2, hoursPerWeek: 2 }
        ],
        8: [
          { name: 'Project Work II', code: 'MT801', type: 'PROJECT', credits: 8, hoursPerWeek: 8 },
          { name: 'Industry Internship', code: 'MT802', type: 'PROJECT', credits: 4, hoursPerWeek: 4 },
          { name: 'Professional Ethics', code: 'MT803', type: 'CORE', credits: 2, hoursPerWeek: 2 }
        ]
      }
    };

    let totalSubjects = 0;
    for (const dept of departments) {
      const deptSubjects = subjectsByDepartment[dept.name];
      if (!deptSubjects) continue;

      for (let semester = 1; semester <= 8; semester++) {
        const semesterSubjects = deptSubjects[semester] || [];
        for (const subjectData of semesterSubjects) {
          const subject = new Subject({
            ...subjectData,
            semester,
            departmentId: dept._id
          });
          await subject.save();
          totalSubjects++;
        }
      }
      console.log(`Added subjects for ${dept.name}`);
    }

    console.log(`Successfully added ${totalSubjects} subjects across all departments and semesters`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding subjects:', error);
    process.exit(1);
  }
};

seedAllSubjects();