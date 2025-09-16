const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');
const Department = require('./models/Department');
const Section = require('./models/Section');
const Subject = require('./models/Subject');
const Staff = require('./models/Staff');
const Timetable = require('./models/Timetable');
const Slot = require('./models/Slot');

const addITMechatronics = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Create IT and Mechatronics departments
    const newDepartments = [
      { name: 'Information Technology', code: 'IT' },
      { name: 'Mechatronics Engineering', code: 'MECH' }
    ];

    for (const deptData of newDepartments) {
      // Check if department already exists
      let department = await Department.findOne({ code: deptData.code });
      if (!department) {
        department = new Department(deptData);
        await department.save();
        console.log(`Created department: ${department.name}`);
      }

      // Create HOD
      const existingHOD = await User.findOne({ 
        role: 'HOD', 
        departmentId: department._id 
      });
      
      if (!existingHOD) {
        const hodUser = new User({
          name: `HOD ${department.name}`,
          email: `hod.${department.code.toLowerCase()}@college.edu`,
          password: 'hod123',
          role: 'HOD',
          departmentId: department._id
        });
        await hodUser.save();
        console.log(`Created HOD: ${hodUser.email}`);
      }

      // Create sections
      const sections = [
        {
          departmentId: department._id,
          year: 3,
          sectionName: `${department.code}-A`,
          studentCount: 70
        },
        {
          departmentId: department._id,
          year: 3,
          sectionName: `${department.code}-B`,
          studentCount: 68
        }
      ];
      
      for (const sectionData of sections) {
        const existingSection = await Section.findOne({ 
          departmentId: department._id, 
          sectionName: sectionData.sectionName 
        });
        if (!existingSection) {
          await Section.create(sectionData);
          console.log(`Created section: ${sectionData.sectionName}`);
        }
      }

      // Create subjects
      const subjects = department.code === 'IT' ? [
        {
          name: 'Software Engineering',
          code: 'IT301',
          type: 'CORE',
          credits: 4,
          hoursPerWeek: 4,
          departmentId: department._id
        },
        {
          name: 'Database Management Systems',
          code: 'IT302',
          type: 'CORE',
          credits: 4,
          hoursPerWeek: 4,
          departmentId: department._id
        },
        {
          name: 'Web Technologies',
          code: 'IT401',
          type: 'ELECTIVE',
          credits: 3,
          hoursPerWeek: 3,
          departmentId: department._id
        },
        {
          name: 'Mobile App Development',
          code: 'IT402',
          type: 'ELECTIVE',
          credits: 3,
          hoursPerWeek: 3,
          departmentId: department._id
        }
      ] : [
        {
          name: 'Robotics and Automation',
          code: 'MECH301',
          type: 'CORE',
          credits: 4,
          hoursPerWeek: 4,
          departmentId: department._id
        },
        {
          name: 'Control Systems',
          code: 'MECH302',
          type: 'CORE',
          credits: 4,
          hoursPerWeek: 4,
          departmentId: department._id
        },
        {
          name: 'Industrial Automation',
          code: 'MECH401',
          type: 'ELECTIVE',
          credits: 3,
          hoursPerWeek: 3,
          departmentId: department._id
        },
        {
          name: 'Embedded Systems',
          code: 'MECH402',
          type: 'ELECTIVE',
          credits: 3,
          hoursPerWeek: 3,
          departmentId: department._id
        }
      ];

      for (const subjectData of subjects) {
        const existingSubject = await Subject.findOne({ code: subjectData.code });
        if (!existingSubject) {
          await Subject.create(subjectData);
          console.log(`Created subject: ${subjectData.name}`);
        }
      }

      // Create staff
      const staffData = [
        {
          name: `Dr. ${department.name} Professor 1`,
          email: `prof1.${department.code.toLowerCase()}@college.edu`,
          password: 'staff123'
        },
        {
          name: `Dr. ${department.name} Professor 2`,
          email: `prof2.${department.code.toLowerCase()}@college.edu`,
          password: 'staff123'
        }
      ];

      for (const staff of staffData) {
        const existingUser = await User.findOne({ email: staff.email });
        if (!existingUser) {
          const staffUser = new User({
            name: staff.name,
            email: staff.email,
            password: staff.password,
            role: 'STAFF',
            departmentId: department._id
          });
          await staffUser.save();

          const deptSubjects = await Subject.find({ departmentId: department._id });
          const staffProfile = new Staff({
            userId: staffUser._id,
            name: staff.name,
            departmentId: department._id,
            maxHours: 18,
            expertiseSubjects: deptSubjects.map(s => s._id)
          });
          await staffProfile.save();
          console.log(`Created staff: ${staff.email}`);
        }
      }

      // Create sample timetables
      const admin = await User.findOne({ role: 'ADMIN' });
      const deptSections = await Section.find({ departmentId: department._id });
      
      for (const section of deptSections) {
        const existingTimetable = await Timetable.findOne({ sectionId: section._id });
        if (!existingTimetable) {
          const timetable = new Timetable({
            sectionId: section._id,
            generatedBy: admin._id,
            academicYear: '2024-25',
            semester: 1,
            status: 'PENDING'
          });
          await timetable.save();

          const deptSubjects = await Subject.find({ departmentId: department._id });
          const deptStaff = await Staff.find({ departmentId: department._id });
          
          if (deptSubjects.length > 0 && deptStaff.length > 0) {
            const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'];
            const sampleSlots = [];

            for (let day of days) {
              for (let period = 1; period <= 6; period++) {
                const randomSubject = deptSubjects[Math.floor(Math.random() * deptSubjects.length)];
                const randomStaff = deptStaff[Math.floor(Math.random() * deptStaff.length)];
                
                sampleSlots.push({
                  timetableId: timetable._id,
                  day,
                  period,
                  subjectId: randomSubject._id,
                  staffId: randomStaff._id,
                  room: `${department.code}-${Math.floor(Math.random() * 20) + 1}`
                });
              }
            }

            const slots = await Slot.insertMany(sampleSlots);
            timetable.slots = slots.map(slot => slot._id);
            await timetable.save();
            console.log(`Created timetable for ${section.sectionName}`);
          }
        }
      }
    }

    console.log('\n=== IT & Mechatronics Setup Complete ===');
    console.log('New HOD Login Credentials:');
    console.log('IT HOD: hod.it@college.edu / hod123');
    console.log('Mechatronics HOD: hod.mech@college.edu / hod123');
    
    console.log('\nNew Staff Login Credentials:');
    console.log('IT Staff: prof1.it@college.edu / staff123');
    console.log('IT Staff: prof2.it@college.edu / staff123');
    console.log('Mechatronics Staff: prof1.mech@college.edu / staff123');
    console.log('Mechatronics Staff: prof2.mech@college.edu / staff123');

    process.exit(0);
  } catch (error) {
    console.error('Error creating IT & Mechatronics data:', error);
    process.exit(1);
  }
};

addITMechatronics();