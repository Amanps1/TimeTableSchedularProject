const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true },
  type: { type: String, enum: ['CORE', 'ELECTIVE', 'HONORS', 'PROJECT'], required: true },
  credits: { type: Number, required: true },
  hoursPerWeek: { type: Number, required: true },
  semester: { type: Number, min: 1, max: 8, required: true },
  departmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Subject', subjectSchema);