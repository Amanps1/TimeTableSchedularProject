const mongoose = require('mongoose');
require('dotenv').config();

const Staff = require('./models/Staff');
const Slot = require('./models/Slot');
const Subject = require('./models/Subject');

const simpleStaffTest = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const staff = await Staff.findOne({ email: 'pooja.saxena@cse.college.edu' });
    console.log(`Staff ID: ${staff._id}`);
    
    // Get all slots for this staff (simplified)
    const allSlots = await Slot.find({ staffId: staff._id });
    console.log(`Total slots: ${allSlots.length}`);
    
    // Get slots with subject info
    const slotsWithSubjects = await Slot.find({ staffId: staff._id })
      .populate('subjectId', 'name code');
    
    console.log('\nSlots with subjects:');
    slotsWithSubjects.forEach(slot => {
      console.log(`${slot.day} P${slot.period}: ${slot.subjectId?.name} (Room: ${slot.room})`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

simpleStaffTest();