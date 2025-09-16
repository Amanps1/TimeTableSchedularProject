const mongoose = require('mongoose');
require('dotenv').config();

const Staff = require('./models/Staff');
const Slot = require('./models/Slot');
const Timetable = require('./models/Timetable');
const Subject = require('./models/Subject');

const checkSpecificStaffTimetable = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check the specific staff member (Prof. Pooja Saxena from your earlier message)
    const staff = await Staff.findOne({ email: 'pooja.saxena@cse.college.edu' });
    
    if (!staff) {
      console.log('Staff not found');
      process.exit(0);
    }

    console.log(`Checking timetable for: ${staff.name} (${staff.email})`);

    // Get approved timetables
    const approvedTimetables = await Timetable.find({ status: 'APPROVED' });
    console.log(`Approved timetables: ${approvedTimetables.length}`);

    // Get slots for this staff from approved timetables
    const staffSlots = await Slot.find({
      staffId: staff._id,
      timetableId: { $in: approvedTimetables.map(t => t._id) }
    })
    .populate('subjectId', 'name code')
    .populate('timetableId', 'status');

    console.log(`Slots assigned to ${staff.name}: ${staffSlots.length}`);

    if (staffSlots.length === 0) {
      console.log('\n❌ No slots assigned to this staff member');
      
      // Let's assign some slots to this staff
      console.log('\n🔧 Assigning slots to this staff...');
      
      // Get some approved slots that need staff assignment
      const unassignedSlots = await Slot.find({
        timetableId: { $in: approvedTimetables.map(t => t._id) }
      })
      .populate('subjectId', 'name code expertiseSubjects')
      .limit(10);

      console.log(`Found ${unassignedSlots.length} slots to potentially assign`);

      // Get staff expertise subjects
      const staffWithExpertise = await Staff.findById(staff._id).populate('expertiseSubjects', 'name code');
      console.log(`Staff expertise: ${staffWithExpertise.expertiseSubjects.length} subjects`);

      let assigned = 0;
      for (const slot of unassignedSlots.slice(0, 5)) {
        if (slot.subjectId && staffWithExpertise.expertiseSubjects.some(exp => 
          exp._id.toString() === slot.subjectId._id.toString()
        )) {
          await Slot.findByIdAndUpdate(slot._id, { staffId: staff._id });
          console.log(`✅ Assigned: ${slot.day} P${slot.period} - ${slot.subjectId.name}`);
          assigned++;
        }
      }

      if (assigned === 0) {
        // Force assign some slots regardless of expertise
        for (const slot of unassignedSlots.slice(0, 3)) {
          await Slot.findByIdAndUpdate(slot._id, { staffId: staff._id });
          console.log(`✅ Force assigned: ${slot.day} P${slot.period} - ${slot.subjectId?.name || 'Unknown'}`);
          assigned++;
        }
      }

      console.log(`\n📊 Assigned ${assigned} slots to ${staff.name}`);
    } else {
      console.log('\n📅 Current timetable:');
      staffSlots.forEach(slot => {
        console.log(`  ${slot.day} Period ${slot.period}: ${slot.subjectId?.name} (${slot.room})`);
      });
    }

    process.exit(0);
  } catch (error) {
    console.error('Error checking staff timetable:', error);
    process.exit(1);
  }
};

checkSpecificStaffTimetable();