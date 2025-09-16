const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');
const Department = require('./models/Department');
const Section = require('./models/Section');
const Subject = require('./models/Subject');
const Staff = require('./models/Staff');
const Timetable = require('./models/Timetable');
const Slot = require('./models/Slot');

const createMultiDeptData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const departments = await Department.find();
    
    // Create HODs for each department
    for (const dept of departments) {
      // Check if HOD already exists for this department
      const existingHOD = await User.findOne({ 
        role: 'HOD', 
        departmentId: dept._id 
      });
      
      if (!existingHOD) {
        const hodUser = new User({
          name: `HOD ${dept.name}`,
          email: `hod.${dept.code.toLowerCase()}@college.edu`,
          password: 'hod123',
          role: 'HOD',
          departmentId: dept._id
        });
        await hodUser.save();
        console.log(`Created HOD for ${dept.name}: ${hodUser.email}`);
      }

      // Create sections for each department
      const existingSections = await Section.find({ departmentId: dept._id });
      if (existingSections.length === 0) {
        const sections = [
          {
            departmentId: dept._id,
            year: 3,
            sectionName: `${dept.code}-A`,
            studentCount: 70
          },
          {
            departmentId: dept._id,
            year: 3,
            sectionName: `${dept.code}-B`,
            studentCount: 68
          }
        ];
        await Section.insertMany(sections);
        console.log(`Created sections for ${dept.name}`);
      }

      // Create subjects for each department
      const existingSubjects = await Subject.find({ departmentId: dept._id });
      if (existingSubjects.length === 0) {
        const subjects = [
          {
            name: `${dept.name} Core Subject 1`,
            code: `${dept.code}301`,
            type: 'CORE',
            credits: 4,
            hoursPerWeek: 4,
            departmentId: dept._id
          },
          {
            name: `${dept.name} Core Subject 2`,
            code: `${dept.code}302`,
            type: 'CORE',
            credits: 4,
            hoursPerWeek: 4,
            departmentId: dept._id
          },
          {
            name: `${dept.name} Elective`,
            code: `${dept.code}401`,
            type: 'ELECTIVE',
            credits: 3,
            hoursPerWeek: 3,
            departmentId: dept._id
          }
        ];
        await Subject.insertMany(subjects);
        console.log(`Created subjects for ${dept.name}`);
      }

      // Create staff for each department
      const existingStaff = await Staff.find({ departmentId: dept._id });
      if (existingStaff.length < 2) {
        const subjects = await Subject.find({ departmentId: dept._id });
        
        const staffUser = new User({
          name: `Dr. ${dept.name} Faculty`,
          email: `faculty.${dept.code.toLowerCase()}@college.edu`,
          password: 'staff123',
          role: 'STAFF',
          departmentId: dept._id
        });
        await staffUser.save();

        const staff = new Staff({
          userId: staffUser._id,
          name: `Dr. ${dept.name} Faculty`,
          departmentId: dept._id,
          maxHours: 18,
          expertiseSubjects: subjects.map(s => s._id)
        });
        await staff.save();
        console.log(`Created staff for ${dept.name}`);
      }
    }

    // Create sample timetables for each department
    const admin = await User.findOne({ role: 'ADMIN' });
    const allSections = await Section.find().populate('departmentId');
    
    for (const section of allSections) {
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

        // Create sample slots
        const subjects = await Subject.find({ departmentId: section.departmentId._id });
        const staff = await Staff.find({ departmentId: section.departmentId._id });
        
        if (subjects.length > 0 && staff.length > 0) {
          const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'];
          const sampleSlots = [];

          for (let day of days) {
            for (let period = 1; period <= 6; period++) {
              const randomSubject = subjects[Math.floor(Math.random() * subjects.length)];
              const randomStaff = staff[Math.floor(Math.random() * staff.length)];
              
              sampleSlots.push({
                timetableId: timetable._id,
                day,
                period,
                subjectId: randomSubject._id,
                staffId: randomStaff._id,
                room: `${section.departmentId.code}-${Math.floor(Math.random() * 20) + 1}`
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

    console.log('\n=== Multi-Department Setup Complete ===');
    console.log('HOD Login Credentials:');
    
    const allHODs = await User.find({ role: 'HOD' }).populate('departmentId');
    allHODs.forEach(hod => {
      console.log(`${hod.departmentId.name} HOD: ${hod.email} / hod123`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error creating multi-department data:', error);
    process.exit(1);
  }
};

createMultiDeptData();