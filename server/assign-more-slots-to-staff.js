const mongoose = require('mongoose');
require('dotenv').config();

const Staff = require('./models/Staff');
const Slot = require('./models/Slot');
const Timetable = require('./models/Timetable');
const Subject = require('./models/Subject');

const assignMoreSlotsToStaff = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const staff = await Staff.findOne({ email: 'pooja.saxena@cse.college.edu' })
      .populate('expertiseSubjects', 'name code');
    
    console.log(`Assigning more slots to: ${staff.name}`);
    console.log(`Staff expertise: ${staff.expertiseSubjects.map(s => s.name).join(', ')}`);

    // Get approved timetables
    const approvedTimetables = await Timetable.find({ status: 'APPROVED' });
    
    // Find slots that match staff expertise and aren't assigned to this staff
    const availableSlots = await Slot.find({
      timetableId: { $in: approvedTimetables.map(t => t._id) },
      staffId: { $ne: staff._id }
    })
    .populate('subjectId', 'name code')
    .limit(20);

    console.log(`Found ${availableSlots.length} available slots`);

    let assigned = 0;
    const targetSlots = 8; // Assign 8 slots for a good timetable

    for (const slot of availableSlots) {
      if (assigned >= targetSlots) break;
      
      // Check if staff can teach this subject
      const canTeach = staff.expertiseSubjects.some(exp => 
        exp._id.toString() === slot.subjectId?._id.toString()
      );

      if (canTeach || assigned < 3) { // Force assign first 3 regardless
        await Slot.findByIdAndUpdate(slot._id, { staffId: staff._id });
        console.log(`✅ Assigned: ${slot.day} P${slot.period} - ${slot.subjectId?.name} (${slot.room})`);
        assigned++;
      }
    }

    console.log(`\n📊 Total assigned: ${assigned} slots`);

    // Verify final timetable
    const finalSlots = await Slot.find({ staffId: staff._id })
      .populate('subjectId', 'name code')
      .populate('timetableId', 'status')
      .sort({ day: 1, period: 1 });

    const approvedFinalSlots = finalSlots.filter(slot => 
      slot.timetableId && slot.timetableId.status === 'APPROVED'
    );

    console.log(`\n📅 Final timetable (${approvedFinalSlots.length} approved slots):`);
    approvedFinalSlots.forEach(slot => {
      console.log(`  ${slot.day} Period ${slot.period}: ${slot.subjectId?.name} (${slot.room})`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error assigning slots:', error);
    process.exit(1);
  }
};

assignMoreSlotsToStaff();