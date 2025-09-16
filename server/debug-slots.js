const mongoose = require('mongoose');
require('dotenv').config();

const Slot = require('./models/Slot');
const Staff = require('./models/Staff');
const Timetable = require('./models/Timetable');

const debugSlots = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check approved timetables
    const approvedTimetables = await Timetable.find({ status: 'APPROVED' });
    console.log(`Approved timetables: ${approvedTimetables.length}`);

    // Check slots from approved timetables
    const slots = await Slot.find({
      timetableId: { $in: approvedTimetables.map(t => t._id) }
    }).limit(5);

    console.log(`\nSample slots from approved timetables:`);
    slots.forEach((slot, index) => {
      console.log(`Slot ${index + 1}:`);
      console.log(`  staffId: ${slot.staffId}`);
      console.log(`  day: ${slot.day}`);
      console.log(`  period: ${slot.period}`);
      console.log(`  room: ${slot.room}`);
    });

    // Check if staffId exists in Staff collection
    if (slots.length > 0 && slots[0].staffId) {
      const staff = await Staff.findById(slots[0].staffId);
      console.log(`\nStaff lookup for ${slots[0].staffId}:`);
      console.log(staff ? `Found: ${staff.name}` : 'Not found');
    }

    // Check total staff count
    const totalStaff = await Staff.countDocuments();
    console.log(`\nTotal staff in database: ${totalStaff}`);

    process.exit(0);
  } catch (error) {
    console.error('Error debugging slots:', error);
    process.exit(1);
  }
};

debugSlots();