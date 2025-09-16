const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  departmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
  maxHours: { type: Number, default: 18 },
  expertiseSubjects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subject' }],
  currentWorkload: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Staff', staffSchema);