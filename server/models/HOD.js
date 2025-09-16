const mongoose = require('mongoose');

const hodSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  departmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
  phone: { type: String },
  qualification: { type: String },
  experience: { type: Number, default: 0 }, // years of experience
  joinedDate: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('HOD', hodSchema);