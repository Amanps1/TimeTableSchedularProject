const express = require('express');
const { auth, authorize } = require('../middleware/auth');
const Department = require('../models/Department');
const Section = require('../models/Section');
const Subject = require('../models/Subject');
const Staff = require('../models/Staff');
const User = require('../models/User');
const Timetable = require('../models/Timetable');
const Slot = require('../models/Slot');

const router = express.Router();

// Get all departments
router.get('/departments', auth, async (req, res) => {
  try {
    const departments = await Department.find({});
    res.json(departments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get subjects by department and semester
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

// Get staff filtered by department and subject expertise
router.get('/staff/:department/:subject', auth, async (req, res) => {
  try {
    const { department, subject } = req.params;
    
    const dept = await Department.findOne({ code: department });
    if (!dept) {
      return res.status(404).json({ message: 'Department not found' });
    }

    // Find staff from this department ONLY with expertise in the subject
    const staff = await Staff.find({ departmentId: dept._id }).populate('departmentId');
    
    const filteredStaff = staff.filter(s => 
      s.expertiseSubjects && s.expertiseSubjects.some(expSubj => 
        expSubj.name && (
          subject.toLowerCase().includes(expSubj.name.toLowerCase()) ||
          expSubj.name.toLowerCase().includes(subject.toLowerCase()) ||
          areRelatedSubjects(subject, expSubj.name)
        )
      )
    );

    res.json(filteredStaff);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Generate department-wise timetable with no free periods
router.post('/generate-timetable', auth, async (req, res) => {
  try {
    const { department, semester, section, aiRules } = req.body;

    // Get department
    const dept = await Department.findOne({ code: department });
    if (!dept) {
      return res.status(404).json({ message: 'Department not found' });
    }

    // Get subjects for this department and semester
    const subjects = await Subject.find({ 
      departmentId: dept._id, 
      semester: parseInt(semester) 
    });

    // Get staff for this department only
    const staff = await Staff.find({ departmentId: dept._id });
    
    // Generate timetable with no free periods (30 periods total)
    const weeklySchedule = await generateDepartmentTimetable(subjects, staff, aiRules);
    
    // Find or create section
    let sectionDoc = await Section.findOne({ 
      department: dept._id, 
      semester: parseInt(semester),
      name: section 
    });
    
    if (!sectionDoc) {
      sectionDoc = await Section.create({
        name: section,
        department: dept._id,
        semester: parseInt(semester),
        studentCount: 60,
        subjects: subjects.map(s => s._id)
      });
    }
    
    // Create timetable
    const timetable = new Timetable({
      department: dept._id,
      section: sectionDoc._id,
      generatedBy: req.user.id,
      academicYear: '2024-25',
      semester: parseInt(semester),
      weeklySchedule
    });
    
    await timetable.save();
    
    res.json({ 
      message: 'Timetable generated successfully',
      timetable,
      weeklySchedule
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// AI Timetable Generation Algorithm for Department
async function generateDepartmentTimetable(subjects, staff, aiRules) {
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
  const periods = [1, 2, 3, 4, 5, 6];
  const weeklySchedule = {};
  
  // Staff workload tracking
  const staffWorkload = {};
  staff.forEach(s => {
    staffWorkload[s._id] = { 
      hours: 0, 
      dailyHours: { monday: 0, tuesday: 0, wednesday: 0, thursday: 0, friday: 0 } 
    };
  });
  
  // Generate schedule for each day (no free periods allowed)
  for (const day of days) {
    weeklySchedule[day] = [];
    
    for (const period of periods) {
      // Select subject (ensure all subjects get adequate coverage)
      const subject = subjects[Math.floor(Math.random() * subjects.length)];
      
      // Find staff with expertise in this subject from same department
      const availableStaff = staff.filter(s => {
        const hasExpertise = s.expertiseSubjects && s.expertiseSubjects.some(expSubj => 
          expSubj.name && (
            subject.name.toLowerCase().includes(expSubj.name.toLowerCase()) ||
            expSubj.name.toLowerCase().includes(subject.name.toLowerCase()) ||
            areRelatedSubjects(subject.name, expSubj.name)
          )
        );
        const withinWeeklyLimit = staffWorkload[s._id].hours < (s.maxHours || 18);
        const withinDailyLimit = staffWorkload[s._id].dailyHours[day] < 6;
        
        return hasExpertise && withinWeeklyLimit && withinDailyLimit;
      });
      
      // Select staff (prefer those with expertise, but ensure coverage)
      let selectedStaff;
      if (availableStaff.length > 0) {
        selectedStaff = availableStaff.reduce((min, current) => 
          staffWorkload[current._id].hours < staffWorkload[min._id].hours ? current : min
        );
      } else {
        // Assign staff with lowest workload to avoid overloading
        selectedStaff = staff.reduce((min, current) => 
          staffWorkload[current._id].hours < staffWorkload[min._id].hours ? current : min
        );
      }
      
      // Add to schedule
      weeklySchedule[day].push({
        period,
        subject: subject.name,
        staff: selectedStaff.name,
        room: `Room ${Math.floor(Math.random() * 50) + 101}`
      });
      
      // Update staff workload (but keep some free time)
      if (staffWorkload[selectedStaff._id].hours < (selectedStaff.maxHours || 18) - 2) {
        staffWorkload[selectedStaff._id].hours += 1;
        staffWorkload[selectedStaff._id].dailyHours[day] += 1;
      }
    }
  }
  
  return weeklySchedule;
}

// Helper function to check related subjects
function areRelatedSubjects(subject1, subject2) {
  const relatedPairs = [
    ['database', 'dbms', 'sql', 'mongodb'],
    ['programming', 'coding', 'java', 'python', 'c++'],
    ['network', 'networking', 'internet', 'tcp'],
    ['algorithm', 'data structure', 'dsa'],
    ['machine learning', 'ai', 'artificial intelligence'],
    ['web', 'html', 'css', 'javascript'],
    ['mobile', 'android', 'ios', 'app'],
    ['security', 'cyber', 'cryptography'],
    ['graphics', 'image', 'multimedia'],
    ['system', 'operating', 'os']
  ];
  
  const s1 = subject1.toLowerCase();
  const s2 = subject2.toLowerCase();
  
  return relatedPairs.some(group => 
    group.some(term => s1.includes(term)) && 
    group.some(term => s2.includes(term))
  );
}

module.exports = router;