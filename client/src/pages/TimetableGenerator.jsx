import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent,
  Chip,
  Alert
} from '@mui/material';
import { motion } from 'framer-motion';
import axios from 'axios';

const TimetableGenerator = () => {
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [selectedSection, setSelectedSection] = useState('A');
  const [subjects, setSubjects] = useState([]);
  const [staff, setStaff] = useState([]);
  const [generatedTimetable, setGeneratedTimetable] = useState(null);
  const [loading, setLoading] = useState(false);
  const [aiRules, setAiRules] = useState([]);

  const departments = [
    { code: 'CSE', name: 'Computer Science and Engineering' },
    { code: 'ECE', name: 'Electronics and Communication Engineering' },
    { code: 'MECH', name: 'Mechanical Engineering' },
    { code: 'CIVIL', name: 'Civil Engineering' }
  ];

  const semesters = [1, 2, 3, 4, 5, 6, 7, 8];
  const sections = ['A', 'B', 'C'];
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
  const periods = [1, 2, 3, 4, 5, 6];

  useEffect(() => {
    if (selectedDepartment && selectedSemester) {
      fetchSubjects();
      generateAIRules();
    }
  }, [selectedDepartment, selectedSemester]);

  const fetchSubjects = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `/api/admin/subjects/${selectedDepartment}/${selectedSemester}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSubjects(response.data);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  const generateAIRules = () => {
    const departmentRules = {
      CSE: [
        'Programming labs should be scheduled in 2-hour blocks',
        'Core programming subjects in morning slots (8:45-12:15)',
        'Database and Algorithm subjects need computer lab access',
        'Maximum 6 hours per day per staff member',
        'No staff should teach more than 18 hours per week'
      ],
      ECE: [
        'Circuit lab sessions must be in 2-hour blocks',
        'Communication theory in morning, practical in afternoon',
        'VLSI design requires uninterrupted 3-hour sessions',
        'Maximum 6 hours per day per staff member',
        'No staff should teach more than 18 hours per week'
      ],
      MECH: [
        'Workshop sessions require 3-hour continuous blocks',
        'Thermodynamics lab needs morning slots for better conditions',
        'Manufacturing processes need full day lab sessions',
        'Maximum 6 hours per day per staff member',
        'No staff should teach more than 18 hours per week'
      ],
      CIVIL: [
        'Surveying practicals need morning slots (better lighting)',
        'Concrete lab sessions require 3-hour blocks for curing time',
        'Drawing sessions require 2-hour continuous blocks',
        'Maximum 6 hours per day per staff member',
        'No staff should teach more than 18 hours per week'
      ]
    };

    setAiRules(departmentRules[selectedDepartment] || []);
  };

  const generateTimetable = async () => {
    if (!selectedDepartment || !selectedSemester || !selectedSection) {
      alert('Please select department, semester, and section');
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.post(
        '/api/admin/generate-timetable',
        {
          department: selectedDepartment,
          semester: selectedSemester,
          section: selectedSection,
          aiRules
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setGeneratedTimetable(response.data.weeklySchedule);
    } catch (error) {
      console.error('Error generating timetable:', error);
      alert('Error generating timetable. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getDayName = (day) => {
    return day.charAt(0).toUpperCase() + day.slice(1);
  };

  const getTimeSlot = (period) => {
    const timeSlots = [
      '8:45-9:45',
      '9:45-10:45', 
      '11:15-12:15',
      '12:15-1:15',
      '2:15-3:15',
      '3:15-4:15'
    ];
    return timeSlots[period - 1] || '';
  };

  return (
    <Box sx={{ p: 3 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
          Department-wise Timetable Generator
        </Typography>

        {/* Selection Controls */}
        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
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
            <Grid item xs={12} md={4}>
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
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Section</InputLabel>
                <Select
                  value={selectedSection}
                  onChange={(e) => setSelectedSection(e.target.value)}
                  label="Section"
                >
                  {sections.map((section) => (
                    <MenuItem key={section} value={section}>
                      Section {section}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Button
              variant="contained"
              size="large"
              onClick={generateTimetable}
              disabled={loading || !selectedDepartment || !selectedSemester}
              sx={{ px: 4, py: 1.5 }}
            >
              {loading ? 'Generating...' : 'Generate AI-Optimized Timetable'}
            </Button>
          </Box>
        </Paper>

        {/* AI Rules Display */}
        {aiRules.length > 0 && (
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                AI Rules for {selectedDepartment} Department
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {aiRules.map((rule, index) => (
                  <Chip
                    key={index}
                    label={rule}
                    color="primary"
                    variant="outlined"
                    size="small"
                  />
                ))}
              </Box>
            </CardContent>
          </Card>
        )}

        {/* Subjects Display */}
        {subjects.length > 0 && (
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Subjects for {selectedDepartment} - Semester {selectedSemester}
              </Typography>
              <Grid container spacing={1}>
                {subjects.map((subject, index) => (
                  <Grid item key={index}>
                    <Chip
                      label={`${subject.name} (${subject.credits}cr)`}
                      color="secondary"
                      variant="outlined"
                    />
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        )}

        {/* Generated Timetable */}
        {generatedTimetable && (
          <Paper elevation={3}>
            <Box sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Generated Timetable - {selectedDepartment} Semester {selectedSemester} Section {selectedSection}
              </Typography>
              
              <Alert severity="info" sx={{ mb: 2 }}>
                <strong>No Free Periods Policy:</strong> All 30 periods (5 days × 6 periods) are filled with classes. 
                Staff workload is balanced with maximum 18 hours/week and 6 hours/day limits.
              </Alert>

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
                    {periods.map((period) => (
                      <TableRow key={period}>
                        <TableCell sx={{ fontWeight: 'bold', bgcolor: 'grey.100' }}>
                          <Box>
                            <Typography variant="body2" fontWeight="bold">
                              Period {period}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {getTimeSlot(period)}
                            </Typography>
                          </Box>
                        </TableCell>
                        {days.map((day) => {
                          const slot = generatedTimetable[day]?.find(s => s.period === period);
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
                                <Typography variant="body2" color="error">
                                  Error: Missing Class
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

              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Button
                  variant="outlined"
                  color="success"
                  sx={{ mr: 2 }}
                >
                  Send to HOD for Approval
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                >
                  Generate Another Option
                </Button>
              </Box>
            </Box>
          </Paper>
        )}
      </motion.div>
    </Box>
  );
};

export default TimetableGenerator;