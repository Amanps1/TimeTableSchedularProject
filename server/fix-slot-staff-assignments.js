const mongoose = require('mongoose');
require('dotenv').config();

const Slot = require('./models/Slot');
const Staff = require('./models/Staff');
const Timetable = require('./models/Timetable');
const Subject = require('./models/Subject');

const fixSlotStaffAssignments = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get approved timetables
    const approvedTimetables = await Timetable.find({ status: 'APPROVED' });
    console.log(`Processing ${approvedTimetables.length} approved timetables`);

    // Get all slots from approved timetables
    const slots = await Slot.find({
      timetableId: { $in: approvedTimetables.map(t => t._id) }
    }).populate('subjectId', 'name code departmentId');

    console.log(`Found ${slots.length} slots to fix`);

    // Get all current staff
    const allStaff = await Staff.find().populate('expertiseSubjects', '_id');

    let updatedCount = 0;

    for (const slot of slots) {
      if (!slot.subjectId) continue;

      // Find staff who can teach this subject
      const eligibleStaff = allStaff.filter(staff => 
        staff.expertiseSubjects.some(subject => 
          subject._id.toString() === slot.subjectId._id.toString()
        )
      );

      if (eligibleStaff.length > 0) {
        // Randomly assign one of the eligible staff
        const randomStaff = eligibleStaff[Math.floor(Math.random() * eligibleStaff.length)];
        
        await Slot.findByIdAndUpdate(slot._id, {
          staffId: randomStaff._id
        });

        updatedCount++;
        
        if (updatedCount % 50 === 0) {
          console.log(`Updated ${updatedCount} slots...`);
        }
      }
    }

    console.log(`\n✅ Updated ${updatedCount} slots with current staff assignments`);

    // Verify the fix
    const verifySlots = await Slot.find({
      timetableId: { $in: approvedTimetables.map(t => t._id) }
    })
    .populate('staffId', 'name email')
    .populate('subjectId', 'name code')
    .limit(5);

    console.log('\nVerification - Sample updated slots:');
    verifySlots.forEach((slot, index) => {
      console.log(`${index + 1}. ${slot.day} P${slot.period}: ${slot.subjectId?.name} - ${slot.staffId?.name}`);
    });

    // Count staff with assignments
    const staffWithSlots = await Slot.aggregate([
      { $match: { timetableId: { $in: approvedTimetables.map(t => t._id) } } },
      { $group: { _id: '$staffId', count: { $sum: 1 } } }
    ]);

    console.log(`\n📊 ${staffWithSlots.length} staff members now have timetable assignments`);

    process.exit(0);
  } catch (error) {
    console.error('Error fixing slot assignments:', error);
    process.exit(1);
  }
};

fixSlotStaffAssignments();