import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  Chip,
  Grid
} from '@mui/material'
import { Schedule, Assessment, Person } from '@mui/icons-material'
import api from '../services/api'

const StaffWorkload = () => {
  const [workload, setWorkload] = useState({})
  const [profile, setProfile] = useState({})
  const [timetable, setTimetable] = useState([])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [workloadRes, profileRes, timetableRes] = await Promise.all([
        api.get('/staff/workload'),
        api.get('/staff/profile'),
        api.get('/staff/timetable')
      ])
      setWorkload(workloadRes.data)
      setProfile(profileRes.data)
      setTimetable(timetableRes.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const getUtilizationColor = (utilization) => {
    if (utilization > 85) return 'error'
    if (utilization > 70) return 'warning'
    return 'success'
  }

  const getUtilizationText = (utilization) => {
    if (utilization > 85) return 'Overloaded'
    if (utilization > 70) return 'High Load'
    return 'Normal'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Typography variant="h4" gutterBottom>
        My Workload & Profile
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Person color="primary" sx={{ mr: 2 }} />
                <Typography variant="h6">Profile</Typography>
              </Box>
              <Typography variant="body1" gutterBottom>
                <strong>Name:</strong> {profile.name}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Email:</strong> {profile.email}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Department:</strong> {profile.departmentId?.name}
              </Typography>
              <Typography variant="body2" sx={{ mt: 2, mb: 1 }}>
                <strong>Expertise ({profile.expertiseSubjects?.length || 0} subjects):</strong>
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={1}>
                {profile.expertiseSubjects?.slice(0, 5).map((subject) => (
                  <Chip
                    key={subject._id}
                    label={subject.name}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Assessment color="primary" sx={{ mr: 2 }} />
                <Typography variant="h6">Current Workload</Typography>
              </Box>
              <Typography variant="h4" gutterBottom>
                {workload.currentHours || 0}/{workload.maxHours || 18}h
              </Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Utilization: {workload.utilization || 0}%
              </Typography>
              <LinearProgress
                variant="determinate"
                value={Math.min(workload.utilization || 0, 100)}
                color={getUtilizationColor(workload.utilization || 0)}
                sx={{ mt: 1, mb: 2 }}
              />
              <Chip
                label={getUtilizationText(workload.utilization || 0)}
                color={getUtilizationColor(workload.utilization || 0)}
                size="small"
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Schedule color="primary" sx={{ mr: 2 }} />
                <Typography variant="h6">Schedule Summary</Typography>
              </Box>
              <Typography variant="body1" gutterBottom>
                <strong>Total Classes:</strong> {timetable.length}
              </Typography>
              <Typography variant="body2" sx={{ mt: 2, mb: 1 }}>
                <strong>Classes by Day:</strong>
              </Typography>
              {['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'].map(day => {
                const daySlots = timetable.filter(slot => slot.day === day)
                return (
                  <Typography key={day} variant="body2">
                    {day}: {daySlots.length} classes
                  </Typography>
                )
              })}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </motion.div>
  )
}

export default StaffWorkload