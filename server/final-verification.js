const mongoose = require('mongoose');
require('dotenv').config();

const Staff = require('./models/Staff');
const Slot = require('./models/Slot');
const Subject = require('./models/Subject');

const finalVerification = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const staff = await Staff.findOne({ email: 'pooja.saxena@cse.college.edu' });
    
    // Exact same query as the API
    const slots = await Slot.find({ staffId: staff._id })
      .populate('subjectId', 'name code')
      .populate('timetableId', 'status')
      .sort({ day: 1, period: 1 });
    
    const approvedSlots = slots.filter(slot => 
      slot.timetableId && slot.timetableId.status === 'APPROVED'
    );
    
    console.log(`\n✅ API Response for ${staff.name}:`);
    console.log(`Total approved slots: ${approvedSlots.length}`);
    
    console.log('\nTimetable data:');
    approvedSlots.forEach(slot => {
      console.log({
        _id: slot._id,
        day: slot.day,
        period: slot.period,
        room: slot.room,
        subjectId: {
          name: slot.subjectId?.name,
          code: slot.subjectId?.code
        },
        timetableId: {
          status: slot.timetableId?.status
        }
      });
    });

    // Group by day for frontend display
    const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'];
    const grouped = {};
    
    days.forEach(day => {
      grouped[day] = approvedSlots.filter(slot => slot.day === day).sort((a, b) => a.period - b.period);
    });
    
    console.log('\nGrouped by day (as frontend expects):');
    Object.entries(grouped).forEach(([day, daySlots]) => {
      console.log(`${day}: ${daySlots.length} slots`);
      daySlots.forEach(slot => {
        console.log(`  Period ${slot.period}: ${slot.subjectId?.name || 'Unknown'} (${slot.room})`);
      });
    });

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

finalVerification();