const mongoose = require('mongoose');
require('dotenv').config();

const Staff = require('./models/Staff');
const Slot = require('./models/Slot');
const Timetable = require('./models/Timetable');
const Subject = require('./models/Subject');

const testStaffAPI = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const staff = await Staff.findOne({ email: 'pooja.saxena@cse.college.edu' });
    
    // Simulate the exact API call from staff.js
    const slots = await Slot.find({ staffId: staff._id })
      .populate('subjectId', 'name code')
      .populate({
        path: 'timetableId',
        select: 'sectionId status',
        populate: {
          path: 'sectionId',
          select: 'name'
        }
      })
      .sort({ day: 1, period: 1 });
    
    console.log(`\nRaw slots found: ${slots.length}`);
    
    // Filter only approved timetable slots
    const approvedSlots = slots.filter(slot => 
      slot.timetableId && slot.timetableId.status === 'APPROVED'
    );
    
    console.log(`Approved slots: ${approvedSlots.length}`);
    
    console.log('\nAPI Response Data:');
    approvedSlots.forEach(slot => {
      console.log({
        day: slot.day,
        period: slot.period,
        room: slot.room,
        subject: slot.subjectId?.name,
        subjectCode: slot.subjectId?.code,
        timetableStatus: slot.timetableId?.status,
        section: slot.timetableId?.sectionId?.name
      });
    });

    process.exit(0);
  } catch (error) {
    console.error('Error testing staff API:', error);
    process.exit(1);
  }
};

testStaffAPI();