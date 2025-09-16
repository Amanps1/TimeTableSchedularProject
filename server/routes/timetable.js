const express = require('express');
const { auth } = require('../middleware/auth');
const Timetable = require('../models/Timetable');
const Slot = require('../models/Slot');
const Leave = require('../models/Leave');
const timetableService = require('../services/timetableService');

const router = express.Router();

// Get All Timetables
router.get('/', auth, async (req, res) => {
  try {
    const timetables = await Timetable.find()
      .populate({
        path: 'sectionId',
        populate: {
          path: 'departmentId',
          model: 'Department'
        }
      })
      .populate('generatedBy', 'name')
      .sort({ createdAt: -1 });
    res.json(timetables);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get Timetable by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const timetable = await Timetable.findById(req.params.id)
      .populate('sectionId')
      .populate('generatedBy', 'name');
    
    const slots = await Slot.find({ timetableId: req.params.id })
      .populate('subjectId')
      .populate('staffId');
    
    res.json({ timetable, slots });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Handle Leave Approval and Auto-Reschedule
router.post('/handle-leave/:leaveId', auth, async (req, res) => {
  try {
    const { status } = req.body; // 'APPROVED' or 'REJECTED'
    
    const leave = await Leave.findByIdAndUpdate(
      req.params.leaveId,
      { status, approvedBy: req.user._id },
      { new: true }
    );
    
    if (status === 'APPROVED') {
      // Auto-reschedule affected classes
      const rescheduledSlots = await timetableService.rescheduleForLeave(
        leave.staffId,
        leave.startDate,
        leave.endDate
      );
      
      // Update slots in database
      for (const slot of rescheduledSlots) {
        await Slot.findByIdAndUpdate(slot._id, { staffId: slot.staffId });
      }
      
      res.json({ leave, rescheduledSlots });
    } else {
      res.json({ leave });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get Timetable Statistics
router.get('/stats/overview', auth, async (req, res) => {
  try {
    const totalTimetables = await Timetable.countDocuments();
    const pendingTimetables = await Timetable.countDocuments({ status: 'PENDING' });
    const approvedTimetables = await Timetable.countDocuments({ status: 'APPROVED' });
    const totalSlots = await Slot.countDocuments();
    
    res.json({
      totalTimetables,
      pendingTimetables,
      approvedTimetables,
      totalSlots
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;