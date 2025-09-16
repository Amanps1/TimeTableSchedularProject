const mongoose = require('mongoose');
require('dotenv').config();

const Staff = require('./models/Staff');
const Slot = require('./models/Slot');

const quickTest = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    const staff = await Staff.findOne({ email: 'pooja.saxena@cse.college.edu' });
    const slots = await Slot.find({ staffId: staff._id });
    
    console.log(`${staff.name} has ${slots.length} total slots`);
    
    slots.forEach(slot => {
      console.log(`${slot.day} P${slot.period} in ${slot.room}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

quickTest();