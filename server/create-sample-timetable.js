const mongoose = require('mongoose');
require('dotenv').config();

const Timetable = require('./models/Timetable');
const Slot = require('./models/Slot');
const Section = require('./models/Section');
const Subject = require('./models/Subject');
const Staff = require('./models/Staff');
const User = require('./models/User');

const createSampleTimetable = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get existing data
    const sections = await Section.find();
    const subjects = await Subject.find();
    const staff = await Staff.find();
    const admin = await User.findOne({ role: 'ADMIN' });

    if (!sections.length || !subjects.length || !staff.length) {
      console.log('Please run seed.js first to create basic data');
      process.exit(1);
    }

    // Create a sample timetable
    const timetable = new Timetable({
      sectionId: sections[0]._id,
      generatedBy: admin._id,
      academicYear: '2024-25',
      semester: 1,
      status: 'PENDING'
    });
    await timetable.save();

    // Create sample slots
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
          room: `Room-${Math.floor(Math.random() * 20) + 1}`
        });
      }
    }

    const slots = await Slot.insertMany(sampleSlots);
    timetable.slots = slots.map(slot => slot._id);
    await timetable.save();

    console.log('Sample timetable created successfully!');
    console.log(`Timetable ID: ${timetable._id}`);
    console.log(`Created ${slots.length} slots`);

    process.exit(0);
  } catch (error) {
    console.error('Error creating sample timetable:', error);
    process.exit(1);
  }
};

createSampleTimetable();