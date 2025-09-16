const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');
const Department = require('./models/Department');
const Section = require('./models/Section');
const Subject = require('./models/Subject');
const Staff = require('./models/Staff');
const Timetable = require('./models/Timetable');
const Slot = require('./models/Slot');

const createSpecializedStaff = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing staff to recreate with specializations
    await Staff.deleteMany({});
    await User.deleteMany({ role: 'STAFF' });

    const departments = await Department.find();

    for (const dept of departments) {
      const subjects = await Subject.find({ departmentId: dept._id });
      
      // Create specialized staff for each subject
      for (const subject of subjects) {
        const staffName = `Dr. ${subject.name.split(' ')[0]} ${dept.code}`;
        const staffEmail = `${subject.code.toLowerCase()}@college.edu`;
        
        // Create user account
        const staffUser = new User({
          name: staffName,
          email: staffEmail,
          password: 'staff123',
          role: 'STAFF',
          departmentId: dept._id
        });
        await staffUser.save();

        // Create staff profile with specific subject expertise
        const staff = new Staff({
          userId: staffUser._id,
          name: staffName,
          departmentId: dept._id,
          maxHours: 18,
          expertiseSubjects: [subject._id], // Only one subject per staff
          currentWorkload: 0
        });
        await staff.save();
        
        console.log(`Created ${staffName} - Expert in: ${subject.name}`);
      }

      // Create one additional general staff per department
      const generalStaffUser = new User({
        name: `Prof. General ${dept.name}`,
        email: `general.${dept.code.toLowerCase()}@college.edu`,
        password: 'staff123',
        role: 'STAFF',
        departmentId: dept._id
      });
      await generalStaffUser.save();

      const coreSubjects = subjects.filter(s => s.type === 'CORE');
      const generalStaff = new Staff({
        userId: generalStaffUser._id,
        name: `Prof. General ${dept.name}`,
        departmentId: dept._id,
        maxHours: 18,
        expertiseSubjects: coreSubjects.map(s => s._id), // Can teach core subjects
        currentWorkload: 0
      });
      await generalStaff.save();
      
      console.log(`Created Prof. General ${dept.name} - Expert in: ${coreSubjects.map(s => s.name).join(', ')}`);
    }

    // Update timetable generation to use subject-specific staff
    const timetables = await Timetable.find({ status: 'PENDING' }).populate({
      path: 'sectionId',
      populate: {
        path: 'departmentId'
      }
    });
    
    for (const timetable of timetables) {
      if (!timetable.sectionId || !timetable.sectionId.departmentId) {
        console.log(`Skipping timetable ${timetable._id} - missing section or department`);
        continue;
      }
      
      // Delete existing slots
      await Slot.deleteMany({ timetableId: timetable._id });
      
      const deptSubjects = await Subject.find({ departmentId: timetable.sectionId.departmentId._id });
      const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'];
      const newSlots = [];

      for (let day of days) {
        for (let period = 1; period <= 6; period++) {
          const randomSubject = deptSubjects[Math.floor(Math.random() * deptSubjects.length)];
          
          // Find staff who can teach this specific subject
          const availableStaff = await Staff.find({
            departmentId: timetable.sectionId.departmentId._id,
            expertiseSubjects: randomSubject._id
          });
          
          if (availableStaff.length > 0) {
            const assignedStaff = availableStaff[Math.floor(Math.random() * availableStaff.length)];
            
            newSlots.push({
              timetableId: timetable._id,
              day,
              period,
              subjectId: randomSubject._id,
              staffId: assignedStaff._id,
              room: `${timetable.sectionId.sectionName}-${Math.floor(Math.random() * 20) + 1}`
            });
          }
        }
      }

      if (newSlots.length > 0) {
        const slots = await Slot.insertMany(newSlots);
        timetable.slots = slots.map(slot => slot._id);
        await timetable.save();
        console.log(`Updated timetable for ${timetable.sectionId.sectionName}`);
      }
    }

    console.log('\n=== Specialized Staff Setup Complete ===');
    console.log('\nStaff Login Credentials by Department:');
    
    for (const dept of departments) {
      console.log(`\n${dept.name} (${dept.code}):`);
      const deptStaff = await Staff.find({ departmentId: dept._id }).populate('expertiseSubjects');
      const deptUsers = await User.find({ 
        role: 'STAFF', 
        departmentId: dept._id 
      });
      
      for (const user of deptUsers) {
        const staffProfile = deptStaff.find(s => s.userId.toString() === user._id.toString());
        const subjects = staffProfile ? staffProfile.expertiseSubjects.map(s => s.name).join(', ') : 'No subjects';
        console.log(`  ${user.email} / staff123 - Teaches: ${subjects}`);
      }
    }

    process.exit(0);
  } catch (error) {
    console.error('Error creating specialized staff:', error);
    process.exit(1);
  }
};

createSpecializedStaff();