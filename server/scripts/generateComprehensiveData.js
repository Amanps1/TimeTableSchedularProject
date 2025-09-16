const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const Department = require('../models/Department');
const Subject = require('../models/Subject');
const Staff = require('../models/Staff');
const User = require('../models/User');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/timetable_db');

const departmentData = {
  CSE: {
    name: "Computer Science and Engineering",
    semesters: {
      sem1: ["Programming in C", "Engineering Mathematics I", "Physics", "Chemistry", "Basic Electrical", "English"],
      sem2: ["Data Structures", "Engineering Mathematics II", "Digital Logic", "Environmental Science", "Engineering Graphics", "Professional Ethics"],
      sem3: ["Object Oriented Programming", "Discrete Mathematics", "Computer Organization", "Database Management Systems", "Operating Systems", "Technical Communication"],
      sem4: ["Design and Analysis of Algorithms", "Computer Networks", "Software Engineering", "Theory of Computation", "Microprocessors", "Web Technologies"],
      sem5: ["Machine Learning", "Compiler Design", "Computer Graphics", "Artificial Intelligence", "Mobile Computing", "Information Security"],
      sem6: ["Data Mining", "Cloud Computing", "Human Computer Interaction", "Distributed Systems", "Internet of Things", "Project Management"],
      sem7: ["Big Data Analytics", "Blockchain Technology", "Deep Learning", "Cyber Security", "DevOps", "Research Methodology"],
      sem8: ["Capstone Project", "Industry Internship", "Advanced AI", "Quantum Computing", "Entrepreneurship", "Professional Development"]
    }
  },
  ECE: {
    name: "Electronics and Communication Engineering",
    semesters: {
      sem1: ["Basic Electronics", "Engineering Mathematics I", "Physics", "Chemistry", "Engineering Mechanics", "English"],
      sem2: ["Circuit Analysis", "Engineering Mathematics II", "Electronic Devices", "Digital Electronics", "Engineering Graphics", "Professional Ethics"],
      sem3: ["Analog Circuits", "Signals and Systems", "Network Theory", "Electromagnetic Fields", "Control Systems", "Technical Communication"],
      sem4: ["Communication Systems", "Microprocessors", "VLSI Design", "Digital Signal Processing", "Antenna Theory", "Power Electronics"],
      sem5: ["Wireless Communication", "Embedded Systems", "Optical Communication", "Microwave Engineering", "Digital Image Processing", "Robotics"],
      sem6: ["Satellite Communication", "Advanced VLSI", "RF Circuit Design", "Biomedical Electronics", "Nanotechnology", "Project Management"],
      sem7: ["5G Technology", "IoT Systems", "Machine Learning for ECE", "Advanced Communication", "MEMS Technology", "Research Methodology"],
      sem8: ["Capstone Project", "Industry Internship", "Emerging Technologies", "Smart Systems", "Entrepreneurship", "Professional Development"]
    }
  },
  MECH: {
    name: "Mechanical Engineering",
    semesters: {
      sem1: ["Engineering Mechanics", "Engineering Mathematics I", "Physics", "Chemistry", "Basic Electrical", "English"],
      sem2: ["Strength of Materials", "Engineering Mathematics II", "Thermodynamics", "Manufacturing Processes", "Engineering Graphics", "Professional Ethics"],
      sem3: ["Fluid Mechanics", "Machine Design", "Material Science", "Heat Transfer", "Kinematics of Machines", "Technical Communication"],
      sem4: ["Dynamics of Machines", "Thermal Engineering", "Production Technology", "Automobile Engineering", "Metrology", "CAD/CAM"],
      sem5: ["Industrial Engineering", "Refrigeration and AC", "Finite Element Analysis", "Robotics and Automation", "Quality Control", "Operations Research"],
      sem6: ["Power Plant Engineering", "Renewable Energy", "Advanced Manufacturing", "Mechatronics", "Supply Chain Management", "Project Management"],
      sem7: ["Advanced Heat Transfer", "Computational Fluid Dynamics", "Additive Manufacturing", "Smart Manufacturing", "Lean Manufacturing", "Research Methodology"],
      sem8: ["Capstone Project", "Industry Internship", "Emerging Technologies", "Sustainable Engineering", "Entrepreneurship", "Professional Development"]
    }
  },
  CIVIL: {
    name: "Civil Engineering",
    semesters: {
      sem1: ["Engineering Mechanics", "Engineering Mathematics I", "Physics", "Chemistry", "Basic Electrical", "English"],
      sem2: ["Strength of Materials", "Engineering Mathematics II", "Fluid Mechanics", "Surveying", "Engineering Graphics", "Professional Ethics"],
      sem3: ["Structural Analysis", "Concrete Technology", "Soil Mechanics", "Highway Engineering", "Building Materials", "Technical Communication"],
      sem4: ["Design of Concrete Structures", "Foundation Engineering", "Water Resources Engineering", "Transportation Engineering", "Environmental Engineering", "Construction Management"],
      sem5: ["Design of Steel Structures", "Advanced Concrete Design", "Irrigation Engineering", "Traffic Engineering", "Waste Water Treatment", "Quantity Surveying"],
      sem6: ["Earthquake Engineering", "Bridge Engineering", "Urban Planning", "Remote Sensing and GIS", "Construction Technology", "Project Management"],
      sem7: ["Advanced Structural Design", "Pavement Design", "Hydrology", "Sustainable Construction", "Smart Cities", "Research Methodology"],
      sem8: ["Capstone Project", "Industry Internship", "Green Building Technology", "Infrastructure Management", "Entrepreneurship", "Professional Development"]
    }
  }
};

const staffNames = [
  "Dr. Anitha Sharma", "Prof. Rajesh Kumar", "Dr. Priya Patel", "Mr. Suresh Reddy", "Dr. Kavitha Nair",
  "Prof. Arun Singh", "Dr. Meera Gupta", "Mr. Vikram Joshi", "Dr. Sunita Rao", "Prof. Deepak Verma",
  "Dr. Ritu Agarwal", "Mr. Manoj Tiwari", "Dr. Pooja Mishra", "Prof. Sanjay Pandey", "Dr. Neha Srivastava",
  "Mr. Rahul Saxena", "Dr. Shweta Jain", "Prof. Amit Dubey", "Dr. Rekha Sharma", "Mr. Naveen Kumar",
  "Dr. Seema Singh", "Prof. Rohit Gupta", "Dr. Anjali Verma", "Mr. Kiran Patel", "Dr. Madhuri Reddy",
  "Prof. Sachin Joshi", "Dr. Nisha Agarwal", "Mr. Praveen Nair", "Dr. Swati Pandey", "Prof. Vinod Tiwari"
];

async function generateComprehensiveData() {
  try {
    console.log('🚀 Starting comprehensive data generation...');

    // Clear existing data
    await Department.deleteMany({});
    await Subject.deleteMany({});
    await Staff.deleteMany({});
    await User.deleteMany({ role: { $in: ['STAFF', 'HOD'] } });

    for (const [deptCode, deptInfo] of Object.entries(departmentData)) {
      console.log(`\n📚 Processing ${deptCode} department...`);

      // Create department
      const department = await Department.create({
        name: deptInfo.name,
        code: deptCode,
        totalSemesters: 8
      });

      // Create subjects for all semesters
      const allSubjects = [];
      for (const [semester, subjects] of Object.entries(deptInfo.semesters)) {
        const semesterNumber = parseInt(semester.replace('sem', ''));
        
        for (const subjectName of subjects) {
          const subject = await Subject.create({
            name: subjectName,
            code: `${deptCode}${semesterNumber}${subjects.indexOf(subjectName) + 1}`,
            departmentId: department._id,
            semester: semesterNumber,
            credits: subjectName.includes('Project') || subjectName.includes('Internship') ? 4 : 3,
            hoursPerWeek: subjectName.includes('Project') || subjectName.includes('Internship') ? 6 : 4,
            type: subjectName.includes('Project') || subjectName.includes('Internship') ? 'PROJECT' : 'CORE'
          });
          allSubjects.push(subject);
        }
      }

      // Create 30 staff members for this department
      for (let i = 0; i < 30; i++) {
        const staffId = `${deptCode}${String(i + 1).padStart(2, '0')}`;
        const name = staffNames[i];
        const email = `${staffId}@university.edu`;

        // Assign 1-3 random subjects from this department as expertise
        const expertiseCount = Math.floor(Math.random() * 3) + 1;
        const shuffledSubjects = [...allSubjects].sort(() => 0.5 - Math.random());
        const expertise = shuffledSubjects.slice(0, expertiseCount).map(s => s.name);

        // Create user account
        const user = await User.create({
          name,
          email,
          password: 'staff123', // Will be hashed by pre-save middleware
          role: 'STAFF',
          departmentId: department._id
        });

        // Create staff profile
        await Staff.create({
          userId: user._id,
          name,
          email,
          departmentId: department._id,
          maxHours: 18,
          expertiseSubjects: [],
          currentWorkload: 0
        });

        console.log(`✅ Created staff: ${staffId} - ${name}`);
      }

      // Create HOD user
      const hodUser = await User.create({
        name: `Dr. ${deptCode} Head`,
        email: `hod.${deptCode.toLowerCase()}@university.edu`,
        password: 'hod123',
        role: 'HOD',
        departmentId: department._id
      });

      console.log(`✅ Created HOD for ${deptCode}: hod.${deptCode.toLowerCase()}@university.edu`);
    }

    console.log('\n🎉 Comprehensive data generation completed successfully!');
    console.log('\n📊 Summary:');
    console.log('- 4 Departments created');
    console.log('- 192 Subjects created (8 semesters × 6 subjects × 4 departments)');
    console.log('- 120 Staff members created (30 per department)');
    console.log('- 4 HODs created');
    console.log('- All users can login with password: staff123 (for staff) or hod123 (for HODs)');

  } catch (error) {
    console.error('❌ Error generating data:', error);
  } finally {
    mongoose.connection.close();
  }
}

generateComprehensiveData();