import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Grid,
  CircularProgress
} from '@mui/material';
import api from '../services/api';

const HODDashboard = () => {
  const [departmentStaff, setDepartmentStaff] = useState([]);
  const [hodProfile, setHodProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHODData();
  }, []);

  const fetchHODData = async () => {
    try {
      const [profileRes, staffRes] = await Promise.all([
        api.get('/hod/profile'),
        api.get('/hod/department-staff')
      ]);
      
      setHodProfile(profileRes.data);
      setDepartmentStaff(staffRes.data);
    } catch (error) {
      console.error('Error fetching HOD data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        HOD Dashboard
      </Typography>
      
      {hodProfile && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Welcome, {hodProfile.name}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Head of Department - {hodProfile.departmentId?.name}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {hodProfile.qualification} • {hodProfile.experience} years experience
            </Typography>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Department Staff ({departmentStaff.length})
          </Typography>
          
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Workload</TableCell>
                  <TableCell>Efficiency</TableCell>
                  <TableCell>Expertise</TableCell>
                  <TableCell>Subjects</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {departmentStaff.map((staff) => (
                  <TableRow key={staff.staffId}>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold">
                        {staff.name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="textSecondary">
                        {staff.email}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {staff.currentWorkload}/{staff.maxHours} hours
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={`${staff.efficiency}%`}
                        color={
                          parseFloat(staff.efficiency) > 80 ? 'success' :
                          parseFloat(staff.efficiency) > 50 ? 'warning' : 'error'
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {staff.expertiseCount} subjects
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ maxWidth: 200 }}>
                        {staff.subjects.length > 50 ? 
                          `${staff.subjects.substring(0, 50)}...` : 
                          staff.subjects
                        }
                      </Typography>
                    </TableCell>
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

export default HODDashboard;