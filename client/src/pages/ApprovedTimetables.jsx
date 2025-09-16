import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Chip
} from '@mui/material'
import { Schedule, CheckCircle } from '@mui/icons-material'
import api from '../services/api'

const ApprovedTimetables = () => {
  const [timetable, setTimetable] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchApprovedTimetable()
  }, [])

  const fetchApprovedTimetable = async () => {
    try {
      const response = await api.get('/staff/timetable')
      setTimetable(response.data)
    } catch (error) {
      console.error('Error fetching approved timetable:', error)
    } finally {
      setLoading(false)
    }
  }

  const groupTimetableByDay = () => {
    const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY']
    const grouped = {}
    
    days.forEach(day => {
      grouped[day] = timetable.filter(slot => slot.day === day).sort((a, b) => a.period - b.period)
    })
    
    return grouped
  }

  const timeSlots = [
    '9:00-10:00',
    '10:00-11:00', 
    '11:15-12:15',
    '12:15-1:15',
    '2:15-3:15',
    '3:15-4:15'
  ]

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography>Loading approved timetable...</Typography>
      </Box>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Box display="flex" alignItems="center" mb={3}>
        <CheckCircle color="success" sx={{ mr: 2 }} />
        <Typography variant="h4">
          My Approved Timetable
        </Typography>
      </Box>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" alignItems="center" mb={2}>
            <Schedule color="primary" sx={{ mr: 2 }} />
            <Typography variant="h6">Weekly Schedule</Typography>
          </Box>
          
          <Box display="flex" gap={2} mb={2}>
            <Chip 
              label={`Total Classes: ${timetable.length}`} 
              color="primary" 
              variant="outlined" 
            />
            <Chip 
              label="Status: Approved" 
              color="success" 
              variant="outlined" 
            />
          </Box>

          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Day</strong></TableCell>
                  {timeSlots.map((time, index) => (
                    <TableCell key={index} align="center">
                      <strong>Period {index + 1}</strong>
                      <br />
                      <Typography variant="caption" color="textSecondary">
                        {time}
                      </Typography>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.entries(groupTimetableByDay()).map(([day, slots]) => (
                  <TableRow key={day}>
                    <TableCell>
                      <Typography variant="body1" fontWeight="bold">
                        {day}
                      </Typography>
                    </TableCell>
                    {[1, 2, 3, 4, 5, 6].map(period => {
                      const slot = slots.find(s => s.period === period)
                      return (
                        <TableCell key={period} align="center">
                          {slot ? (
                            <Box>
                              <Typography variant="body2" fontWeight="bold" color="primary">
                                {slot.subjectId?.name || 'Subject'}
                              </Typography>
                              <Typography variant="caption" color="textSecondary">
                                {slot.subjectId?.code}
                              </Typography>
                              <br />
                              <Typography variant="caption" color="textSecondary">
                                Room: {slot.room}
                              </Typography>
                            </Box>
                          ) : (
                            <Typography variant="body2" color="textSecondary">
                              Free
                            </Typography>
                          )}
                        </TableCell>
                      )
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {timetable.length === 0 && (
        <Card>
          <CardContent>
            <Box textAlign="center" py={4}>
              <Schedule sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="textSecondary" gutterBottom>
                No Approved Timetable
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Your timetable is pending approval by the HOD or no classes have been assigned yet.
              </Typography>
            </Box>
          </CardContent>
        </Card>
      )}
    </motion.div>
  )
}

export default ApprovedTimetables