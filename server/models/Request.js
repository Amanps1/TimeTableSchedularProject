const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  staffId: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff', required: true },
  type: { type: String, enum: ['CHANGE', 'SWAP', 'LEAVE'], required: true },
  status: { type: String, enum: ['PENDING', 'APPROVED', 'REJECTED'], default: 'PENDING' },
  date: { type: Date, required: true },
  reason: { type: String, required: true },
  details: { type: mongoose.Schema.Types.Mixed }
}, { timestamps: true });

module.exports = mongoose.model('Request', requestSchema);