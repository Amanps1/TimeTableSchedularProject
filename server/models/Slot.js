const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema({
  timetableId: { type: mongoose.Schema.Types.ObjectId, ref: 'Timetable', required: true },
  day: { type: String, enum: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'], required: true },
  period: { type: Number, min: 1, max: 6, required: true },
  startTime: { type: String },
  endTime: { type: String },
  subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  staffId: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff' }, // Not required for electives/projects
  room: { type: String, required: true },
  isBlockTeaching: { type: Boolean, default: false },
  isElective: { type: Boolean, default: false },
  isProject: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Slot', slotSchema);