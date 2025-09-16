const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: true
  },
  semester: {
    type: Number,
    required: true,
    min: 1,
    max: 8
  },
  studentCount: {
    type: Number,
    required: true,
    default: 60
  },
  subjects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject'
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Section', sectionSchema);