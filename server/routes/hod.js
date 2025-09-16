const express = require('express');
const { auth, authorize } = require('../middleware/auth');
const HOD = require('../models/HOD');
const Staff = require('../models/Staff');
const Subject = require('../models/Subject');
const Timetable = require('../models/Timetable');
const Slot = require('../models/Slot');
const Section = require('../models/Section');

const router = express.Router();

// Get HOD Profile
router.get('/profile', auth, authorize('HOD'), async (req, res) => {
  try {
    const hod = await HOD.findOne({ userId: req.user._id })
      .populate('departmentId', 'name');
    
    if (!hod) {
      return res.status(404).json({ message: 'HOD profile not found' });
    }
    
    res.json(hod);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get Department Staff
router.get('/department-staff', auth, authorize('HOD'), async (req, res) => {
  try {
    const hodUser = req.user;
    const staff = await Staff.find({ departmentId: hodUser.departmentId })
      .populate('departmentId', 'name')
      .populate('expertiseSubjects', 'name code semester type');
    
    const slots = await Slot.find().populate('staffId');
    
    const staffReport = staff.map(s => {
      const staffSlots = slots.filter(slot => 
        slot.staffId && slot.staffId._id.toString() === s._id.toString()
      );
      const workload = staffSlots.length;
      const efficiency = (workload / s.maxHours) * 100;
      
      return {
        staffId: s._id,
        name: s.name,
        email: s.email,
        department: s.departmentId?.name,
        currentWorkload: workload,
        maxHours: s.maxHours,
        efficiency: efficiency.toFixed(2),
        expertiseCount: s.expertiseSubjects?.length || 0,
        expertiseSubjects: s.expertiseSubjects || [],
        subjects: s.expertiseSubjects?.map(sub => sub.name).join(', ') || 'None'
      };
    });

    res.json(staffReport);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get Department Subjects
router.get('/department-subjects', auth, authorize('HOD'), async (req, res) => {
  try {
    const hodUser = req.user;
    const subjects = await Subject.find({ departmentId: hodUser.departmentId })
      .populate('departmentId', 'name')
      .sort({ semester: 1, name: 1 });
    
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get Department Sections
router.get('/department-sections', auth, authorize('HOD'), async (req, res) => {
  try {
    const hodUser = req.user;
    const sections = await Section.find({ departmentId: hodUser.departmentId })
      .populate('departmentId', 'name');
    
    res.json(sections);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get Pending Timetables for Approval
router.get('/pending-timetables', auth, authorize('HOD'), async (req, res) => {
  try {
    const hodUser = req.user;
    
    // Get sections of this department
    const sections = await Section.find({ departmentId: hodUser.departmentId });
    const sectionIds = sections.map(s => s._id);
    
    const pendingTimetables = await Timetable.find({ 
      sectionId: { $in: sectionIds },
      status: 'PENDING'
    })
    .populate({
      path: 'sectionId',
      populate: {
        path: 'departmentId',
        model: 'Department'
      }
    })
    .populate('generatedBy', 'name')
    .sort({ createdAt: -1 });

    res.json(pendingTimetables);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Approve/Reject Timetable
router.patch('/timetables/:id/status', auth, authorize('HOD'), async (req, res) => {
  try {
    const { status, remarks } = req.body;
    
    if (!['APPROVED', 'REJECTED'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    const timetable = await Timetable.findByIdAndUpdate(
      req.params.id,
      { 
        status,
        approvedBy: req.user._id,
        approvedAt: new Date(),
        remarks
      },
      { new: true }
    ).populate({
      path: 'sectionId',
      populate: {
        path: 'departmentId',
        model: 'Department'
      }
    });
    
    if (!timetable) {
      return res.status(404).json({ message: 'Timetable not found' });
    }
    
    res.json({ 
      success: true, 
      message: `Timetable ${status.toLowerCase()} successfully`,
      timetable 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get Department Statistics
router.get('/department-stats', auth, authorize('HOD'), async (req, res) => {
  try {
    const hodUser = req.user;
    
    const totalStaff = await Staff.countDocuments({ departmentId: hodUser.departmentId });
    const totalSubjects = await Subject.countDocuments({ departmentId: hodUser.departmentId });
    const totalSections = await Section.countDocuments({ departmentId: hodUser.departmentId });
    
    const sections = await Section.find({ departmentId: hodUser.departmentId });
    const sectionIds = sections.map(s => s._id);
    
    const pendingTimetables = await Timetable.countDocuments({ 
      sectionId: { $in: sectionIds },
      status: 'PENDING'
    });
    
    const approvedTimetables = await Timetable.countDocuments({ 
      sectionId: { $in: sectionIds },
      status: 'APPROVED'
    });

    res.json({
      totalStaff,
      totalSubjects,
      totalSections,
      pendingTimetables,
      approvedTimetables
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;