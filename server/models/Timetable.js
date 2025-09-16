const mongoose = require('mongoose');

const timetableSchema = new mongoose.Schema({
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
  section: { type: mongoose.Schema.Types.ObjectId, ref: 'Section', required: true },
  generatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['PENDING', 'APPROVED', 'REJECTED'], default: 'PENDING' },
  academicYear: { type: String, required: true },
  semester: { type: Number, required: true },
  slots: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Slot' }],
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  approvedAt: { type: Date },
  weeklySchedule: {
    monday: [{ period: Number, subject: String, staff: String, room: String }],
    tuesday: [{ period: Number, subject: String, staff: String, room: String }],
    wednesday: [{ period: Number, subject: String, staff: String, room: String }],
    thursday: [{ period: Number, subject: String, staff: String, room: String }],
    friday: [{ period: Number, subject: String, staff: String, room: String }]
  }
}, { timestamps: true });

module.exports = mongoose.model('Timetable', timetableSchema);