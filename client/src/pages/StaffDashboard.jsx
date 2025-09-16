import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  CircularProgress,
  Alert
} from '@mui/material';
import api from '../services/api';

const StaffDashboard = () => {
  const [staffProfile, setStaffProfile] = useState(null);
  const [timetable, setTimetable] = useState([]);
  const [workload, setWorkload] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStaffData();
  }, []);

  const fetchStaffData = async () => {
    try {
      const [profileRes, timetableRes, workloadRes] = await Promise.all([
        api.get('/staff/profile'),
        api.get('/staff/timetable'),
        api.get('/staff/workload')
      ]);
      
      setStaffProfile(profileRes.data);
      setTimetable(timetableRes.data);
      setWorkload(workloadRes.data);
    } catch (error) {
      console.error('Error fetching staff data:', error);
      setError('Failed to load staff data');
    } finally {
      setLoading(false);
    }
  };

  const organizeTimetable = () => {
    const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'];
    const periods = [1, 2, 3, 4, 5, 6];
    const organized = {};

    days.forEach(day => {
      organized[day] = {};
      periods.forEach(period => {
        organized[day][period] = null;
      });
    });

    timetable.forEach(slot => {
      if (organized[slot.day]) {
        organized[slot.day][slot.period] = slot;
      }
    });

    return organized;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  const organizedTimetable = organizeTimetable();

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Staff Dashboard
      </Typography>
      
      {staffProfile && (
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Welcome, {staffProfile.name}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Department: {staffProfile.departmentId?.name}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Email: {staffProfile.email}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Expertise: {staffProfile.expertiseSubjects?.length || 0} subjects
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Workload
                </Typography>
                {workload && (
                  <>
                    <Typography variant="h4" color="primary">
                      {workload.currentHours}/{workload.maxHours}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Hours per week
                    </Typography>
                    <Chip 
                      label={`${workload.utilization}% Utilized`}
                      color={
                        parseFloat(workload.utilization) > 80 ? 'success' :
                        parseFloat(workload.utilization) > 50 ? 'warning' : 'error'
                      }
                      sx={{ mt: 1 }}
                    />
                  </>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            My Timetable
          </Typography>
          
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Time</TableCell>
                  <TableCell>Monday</TableCell>
                  <TableCell>Tuesday</TableCell>
                  <TableCell>Wednesday</TableCell>
                  <TableCell>Thursday</TableCell>
                  <TableCell>Friday</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {[
                  { period: 1, time: '8:45-9:45' },
                  { period: 2, time: '9:45-10:45' },
                  { period: 'BREAK', time: '10:45-11:15' },
                  { period: 3, time: '11:15-12:15' },
                  { period: 4, time: '12:15-1:15' },
                  { period: 'LUNCH', time: '1:15-2:15' },
                  { period: 5, time: '2:15-3:15' },
                  { period: 6, time: '3:15-4:15' }
                ].map((timeSlot) => (
                  <TableRow key={timeSlot.period}>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold">
                        {timeSlot.time}
                      </Typography>
                    </TableCell>
                    {timeSlot.period === 'BREAK' || timeSlot.period === 'LUNCH' ? (
                      <TableCell colSpan={5} align="center">
                        <Typography variant="body2" color="textSecondary">
                          {timeSlot.period === 'BREAK' ? 'BREAK TIME' : 'LUNCH BREAK'}
                        </Typography>
                      </TableCell>
                    ) : (
                      ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'].map(day => (
                        <TableCell key={day}>
                          {organizedTimetable[day][timeSlot.period] ? (
                            <Box>
                              <Typography variant="body2" fontWeight="bold">
                                {organizedTimetable[day][timeSlot.period].subjectId?.name}
                              </Typography>
                              <Typography variant="caption" color="textSecondary">
                                {organizedTimetable[day][timeSlot.period].subjectId?.code}
                              </Typography>
                              <Typography variant="caption" display="block" color="textSecondary">
                                Room: {organizedTimetable[day][timeSlot.period].room}
                              </Typography>
                            </Box>
                          ) : (
                            <Typography variant="body2" color="textSecondary">
                              Free
                            </Typography>
                          )}
                        </TableCell>
                      ))
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default StaffDashboard;