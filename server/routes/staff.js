const express = require('express');
const { auth, authorize } = require('../middleware/auth');
const Staff = require('../models/Staff');
const Slot = require('../models/Slot');
const Leave = require('../models/Leave');
const Request = require('../models/Request');
const timetableService = require('../services/timetableService');

const router = express.Router();

// Get Staff Profile
router.get('/profile', auth, authorize('STAFF'), async (req, res) => {
  try {
    const staff = await Staff.findOne({ userId: req.user._id })
      .populate('departmentId', 'name code')
      .populate('expertiseSubjects', 'name code');
    
    res.json(staff);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get Staff Timetable
router.get('/timetable', auth, authorize('STAFF'), async (req, res) => {
  try {
    const staff = await Staff.findOne({ userId: req.user._id });
    if (!staff) {
      return res.status(404).json({ message: 'Staff not found' });
    }

    const slots = await Slot.find({ staffId: staff._id })
      .populate('subjectId', 'name code')
      .populate('timetableId', 'status')
      .sort({ day: 1, period: 1 });
    
    // Filter only approved timetable slots
    const approvedSlots = slots.filter(slot => 
      slot.timetableId && slot.timetableId.status === 'APPROVED'
    );
    
    console.log(`Staff ${staff.name} has ${approvedSlots.length} approved slots`);
    
    res.json(approvedSlots);
  } catch (error) {
    console.error('Staff timetable error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get Staff Workload
router.get('/workload', auth, authorize('STAFF'), async (req, res) => {
  try {
    const staff = await Staff.findOne({ userId: req.user._id });
    const slots = await Slot.find({ staffId: staff._id })
      .populate('timetableId', 'status');
    
    // Count only approved timetable slots
    const approvedSlots = slots.filter(slot => 
      slot.timetableId && slot.timetableId.status === 'APPROVED'
    );
    
    const workload = {
      currentHours: approvedSlots.length,
      maxHours: staff.maxHours,
      utilization: ((approvedSlots.length / staff.maxHours) * 100).toFixed(2)
    };
    
    res.json(workload);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Apply for Leave
router.post('/leave', auth, authorize('STAFF'), async (req, res) => {
  try {
    const staff = await Staff.findOne({ userId: req.user._id });
    const { startDate, endDate, reason } = req.body;
    
    const leave = new Leave({
      staffId: staff._id,
      startDate,
      endDate,
      reason
    });
    
    await leave.save();
    res.status(201).json(leave);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get Leave History
router.get('/leaves', auth, authorize('STAFF'), async (req, res) => {
  try {
    const staff = await Staff.findOne({ userId: req.user._id });
    const leaves = await Leave.find({ staffId: staff._id }).sort({ createdAt: -1 });
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Request Timetable Change
router.post('/request-change', auth, authorize('STAFF'), async (req, res) => {
  try {
    const staff = await Staff.findOne({ userId: req.user._id });
    const { type, date, reason, details } = req.body;
    
    const request = new Request({
      staffId: staff._id,
      type,
      date,
      reason,
      details
    });
    
    await request.save();
    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get Request History
router.get('/requests', auth, authorize('STAFF'), async (req, res) => {
  try {
    const staff = await Staff.findOne({ userId: req.user._id });
    const requests = await Request.find({ staffId: staff._id }).sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;