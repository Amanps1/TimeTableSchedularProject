const mongoose = require('mongoose');
require('dotenv').config();

const Timetable = require('./models/Timetable');
const Slot = require('./models/Slot');
const Staff = require('./models/Staff');
const User = require('./models/User');
const Section = require('./models/Section');
const Subject = require('./models/Subject');

const approveSampleTimetables = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get HOD user for approval
    const hodUser = await User.findOne({ role: 'HOD' });
    if (!hodUser) {
      console.log('No HOD user found');
      process.exit(1);
    }

    // Get pending timetables
    const pendingTimetables = await Timetable.find({ status: 'PENDING' })
      .populate('sectionId', 'name')
      .limit(3); // Approve first 3 timetables

    console.log(`Found ${pendingTimetables.length} pending timetables to approve`);

    for (const timetable of pendingTimetables) {
      // Approve the timetable
      await Timetable.findByIdAndUpdate(timetable._id, {
        status: 'APPROVED',
        approvedBy: hodUser._id,
        approvedAt: new Date()
      });

      console.log(`✅ Approved timetable for ${timetable.sectionId?.name}`);
    }

    // Now check staff assignments
    console.log('\n=== Checking Staff Assignments ===');
    
    const approvedTimetables = await Timetable.find({ status: 'APPROVED' });
    console.log(`Total approved timetables: ${approvedTimetables.length}`);

    // Get slots from approved timetables
    const approvedSlots = await Slot.find({
      timetableId: { $in: approvedTimetables.map(t => t._id) }
    })
    .populate('staffId', 'name email')
    .populate('subjectId', 'name code');

    console.log(`Total approved slots: ${approvedSlots.length}`);

    // Group by staff
    const slotsByStaff = {};
    approvedSlots.forEach(slot => {
      if (slot.staffId) {
        const staffId = slot.staffId._id.toString();
        if (!slotsByStaff[staffId]) {
          slotsByStaff[staffId] = {
            staff: slot.staffId,
            slots: []
          };
        }
        slotsByStaff[staffId].slots.push(slot);
      }
    });

    console.log('\nStaff with approved timetable slots:');
    Object.values(slotsByStaff).forEach(({ staff, slots }) => {
      console.log(`  ${staff.name} (${staff.email}): ${slots.length} slots`);
    });

    if (Object.keys(slotsByStaff).length === 0) {
      console.log('\n⚠️  No staff assigned to approved timetables!');
      console.log('   This means timetables were approved but have no slot assignments.');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error approving timetables:', error);
    process.exit(1);
  }
};

approveSampleTimetables();