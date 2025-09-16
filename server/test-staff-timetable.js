const mongoose = require('mongoose');
require('dotenv').config();

const Staff = require('./models/Staff');
const Slot = require('./models/Slot');
const Timetable = require('./models/Timetable');
const User = require('./models/User');
const Section = require('./models/Section');
const Subject = require('./models/Subject');

const testStaffTimetable = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get a sample staff member
    const sampleStaff = await Staff.findOne().populate('userId', 'email');
    if (!sampleStaff) {
      console.log('No staff found');
      process.exit(0);
    }

    console.log(`\nTesting timetable for: ${sampleStaff.name} (${sampleStaff.email})`);

    // Check all slots for this staff
    const allSlots = await Slot.find({ staffId: sampleStaff._id })
      .populate('subjectId', 'name code')
      .populate('timetableId', 'status sectionId');

    console.log(`\nTotal slots assigned: ${allSlots.length}`);

    // Group by timetable status
    const slotsByStatus = {
      PENDING: allSlots.filter(s => s.timetableId?.status === 'PENDING'),
      APPROVED: allSlots.filter(s => s.timetableId?.status === 'APPROVED'),
      REJECTED: allSlots.filter(s => s.timetableId?.status === 'REJECTED'),
      NO_TIMETABLE: allSlots.filter(s => !s.timetableId)
    };

    console.log('\nSlots by timetable status:');
    Object.entries(slotsByStatus).forEach(([status, slots]) => {
      console.log(`  ${status}: ${slots.length} slots`);
    });

    // Show approved slots (what staff should see)
    console.log('\nApproved slots (visible to staff):');
    slotsByStatus.APPROVED.forEach(slot => {
      console.log(`  ${slot.day} Period ${slot.period}: ${slot.subjectId?.name} (${slot.room})`);
    });

    // Check timetable statuses
    const timetables = await Timetable.find().populate('sectionId', 'name');
    console.log(`\nAll timetables in system: ${timetables.length}`);
    
    const timetablesByStatus = {
      PENDING: timetables.filter(t => t.status === 'PENDING'),
      APPROVED: timetables.filter(t => t.status === 'APPROVED'),
      REJECTED: timetables.filter(t => t.status === 'REJECTED')
    };

    console.log('\nTimetables by status:');
    Object.entries(timetablesByStatus).forEach(([status, timetables]) => {
      console.log(`  ${status}: ${timetables.length} timetables`);
    });

    if (timetablesByStatus.APPROVED.length === 0) {
      console.log('\n⚠️  WARNING: No approved timetables found!');
      console.log('   Staff dashboards will be empty until timetables are approved by HOD.');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error testing staff timetable:', error);
    process.exit(1);
  }
};

testStaffTimetable();