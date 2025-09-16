import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Chip
} from '@mui/material';
import { motion } from 'framer-motion';
import axios from 'axios';

const StudentDashboard = () => {
  const [selectedDepartment, setSelectedDepartment] = useState('CSE');
  const [selectedSemester, setSelectedSemester] = useState(1);
  const [timetable, setTimetable] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);

  const departments = [
    { code: 'CSE', name: 'Computer Science and Engineering' },
    { code: 'ECE', name: 'Electronics and Communication Engineering' },
    { code: 'MECH', name: 'Mechanical Engineering' },
    { code: 'CIVIL', name: 'Civil Engineering' }
  ];

  const semesters = [1, 2, 3, 4, 5, 6, 7, 8];
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
  const periods = [1, 2, 3, 4, 5, 6];
  const timeSlots = [
    '8:45-9:45',
    '9:45-10:45',
    '11:15-12:15',
    '12:15-1:15',
    '2:15-3:15',
    '3:15-4:15'
  ];

  useEffect(() => {
    fetchTimetable();
    fetchSubjects();
  }, [selectedDepartment, selectedSemester]);

  const fetchTimetable = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `/api/student/timetable/${selectedDepartment}/${selectedSemester}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTimetable(response.data.timetable);
    } catch (error) {
      console.error('Error fetching timetable:', error);
      // Generate sample timetable if none exists
      generateSampleTimetable();
    } finally {
      setLoading(false);
    }
  };

  const fetchSubjects = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `/api/student/subjects/${selectedDepartment}/${selectedSemester}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSubjects(response.data);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  const generateSampleTimetable = () => {
    const sampleSubjects = {
      CSE: {
        1: ['Programming in C', 'Engineering Mathematics I', 'Physics', 'Chemistry', 'Basic Electrical', 'English'],
        2: ['Data Structures', 'Engineering Mathematics II', 'Digital Logic', 'Environmental Science', 'Engineering Graphics', 'Professional Ethics'],
        3: ['Object Oriented Programming', 'Discrete Mathematics', 'Computer Organization', 'Database Management Systems', 'Operating Systems', 'Technical Communication'],
        4: ['Design and Analysis of Algorithms', 'Computer Networks', 'Software Engineering', 'Theory of Computation', 'Microprocessors', 'Web Technologies']
      },
      ECE: {
        1: ['Basic Electronics', 'Engineering Mathematics I', 'Physics', 'Chemistry', 'Engineering Mechanics', 'English'],
        2: ['Circuit Analysis', 'Engineering Mathematics II', 'Electronic Devices', 'Digital Electronics', 'Engineering Graphics', 'Professional Ethics']
      },
      MECH: {
        1: ['Engineering Mechanics', 'Engineering Mathematics I', 'Physics', 'Chemistry', 'Basic Electrical', 'English'],
        2: ['Strength of Materials', 'Engineering Mathematics II', 'Thermodynamics', 'Manufacturing Processes', 'Engineering Graphics', 'Professional Ethics']
      },
      CIVIL: {
        1: ['Engineering Mechanics', 'Engineering Mathematics I', 'Physics', 'Chemistry', 'Basic Electrical', 'English'],
        2: ['Strength of Materials', 'Engineering Mathematics II', 'Fluid Mechanics', 'Surveying', 'Engineering Graphics', 'Professional Ethics']
      }
    };

    const subjectList = sampleSubjects[selectedDepartment]?.[selectedSemester] || 
                       sampleSubjects[selectedDepartment]?.[1] || 
                       ['Subject 1', 'Subject 2', 'Subject 3', 'Subject 4', 'Subject 5', 'Subject 6'];

    const sampleTimetable = {};
    days.forEach(day => {
      sampleTimetable[day] = [];
      periods.forEach(period => {
        const subject = subjectList[Math.floor(Math.random() * subjectList.length)];
        sampleTimetable[day].push({
          period,
          subject,
          staff: `Prof. ${['Smith', 'Johnson', 'Williams', 'Brown', 'Jones'][Math.floor(Math.random() * 5)]}`,
          room: `Room ${Math.floor(Math.random() * 50) + 101}`
        });
      });
    });

    setTimetable(sampleTimetable);
  };

  const getDayName = (day) => {
    return day.charAt(0).toUpperCase() + day.slice(1);
  };

  const getSubjectColor = (subject) => {
    const colors = ['primary', 'secondary', 'success', 'warning', 'info', 'error'];
    const hash = subject.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  return (
    <Box sx={{ p: 3 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
          Student Timetable
        </Typography>

        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Department</InputLabel>
              <Select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                label="Department"
              >
                {departments.map((dept) => (
                  <MenuItem key={dept.code} value={dept.code}>
                    {dept.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Semester</InputLabel>
              <Select
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
                label="Semester"
              >
                {semesters.map((sem) => (
                  <MenuItem key={sem} value={sem}>
                    Semester {sem}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {/* Subjects Overview */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Subjects for {selectedDepartment} - Semester {selectedSemester}
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {subjects.length > 0 ? (
                subjects.map((subject, index) => (
                  <Chip
                    key={index}
                    label={`${subject.name} (${subject.credits} credits)`}
                    color={getSubjectColor(subject.name)}
                    variant="outlined"
                  />
                ))
              ) : (
                <Typography color="text.secondary">
                  No subjects data available
                </Typography>
              )}
            </Box>
          </CardContent>
        </Card>

        {/* Timetable */}
        <Paper elevation={3}>
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Weekly Timetable - No Free Periods
            </Typography>
            
            {loading ? (
              <Typography>Loading timetable...</Typography>
            ) : timetable ? (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold', bgcolor: 'primary.main', color: 'white' }}>
                        Time / Day
                      </TableCell>
                      {days.map((day) => (
                        <TableCell 
                          key={day} 
                          align="center" 
                          sx={{ fontWeight: 'bold', bgcolor: 'primary.main', color: 'white' }}
                        >
                          {getDayName(day)}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {periods.map((period, periodIndex) => (
                      <TableRow key={period}>
                        <TableCell sx={{ fontWeight: 'bold', bgcolor: 'grey.100' }}>
                          <Box>
                            <Typography variant="body2" fontWeight="bold">
                              Period {period}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {timeSlots[periodIndex]}
                            </Typography>
                          </Box>
                        </TableCell>
                        {days.map((day) => {
                          const slot = timetable[day]?.find(s => s.period === period);
                          return (
                            <TableCell key={`${day}-${period}`} align="center">
                              {slot ? (
                                <Box>
                                  <Typography variant="body2" fontWeight="bold" color="primary">
                                    {slot.subject}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    {slot.staff}
                                  </Typography>
                                  <br />
                                  <Typography variant="caption" color="text.secondary">
                                    {slot.room}
                                  </Typography>
                                </Box>
                              ) : (
                                <Typography variant="body2" color="text.secondary">
                                  No Class
                                </Typography>
                              )}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography>No timetable available</Typography>
            )}
          </Box>
        </Paper>

        {/* Break Times Info */}
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Break Schedule
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Chip label="Morning Break" color="warning" size="small" sx={{ mr: 1 }} />
                  <Typography variant="body2">10:45 AM - 11:15 AM</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Chip label="Lunch Break" color="success" size="small" sx={{ mr: 1 }} />
                  <Typography variant="body2">1:15 PM - 2:15 PM</Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </motion.div>
    </Box>
  );
};

export default StudentDashboard;