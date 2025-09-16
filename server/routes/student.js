const express = require('express');
const router = express.Router();
const Timetable = require('../models/Timetable');
const Section = require('../models/Section');
const Department = require('../models/Department');
const Subject = require('../models/Subject');
const { auth } = require('../middleware/auth');

// Get student timetable
router.get('/timetable/:department/:semester', auth, async (req, res) => {
  try {
    const { department, semester } = req.params;
    
    const dept = await Department.findOne({ code: department });
    if (!dept) {
      return res.status(404).json({ message: 'Department not found' });
    }

    const section = await Section.findOne({ 
      department: dept._id, 
      semester: parseInt(semester) 
    });
    
    if (!section) {
      return res.status(404).json({ message: 'Section not found' });
    }

    const timetable = await Timetable.findOne({ 
      section: section._id,
      status: 'APPROVED'
    }).populate('slots');

    if (!timetable) {
      return res.status(404).json({ message: 'No approved timetable found' });
    }

    res.json({
      timetable: timetable.weeklySchedule,
      section: section.name,
      department: dept.name,
      semester
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all subjects for a department and semester
router.get('/subjects/:department/:semester', auth, async (req, res) => {
  try {
    const { department, semester } = req.params;
    
    const dept = await Department.findOne({ code: department });
    if (!dept) {
      return res.status(404).json({ message: 'Department not found' });
    }

    const subjects = await Subject.find({
      departmentId: dept._id,
      semester: parseInt(semester)
    });

    res.json(subjects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;