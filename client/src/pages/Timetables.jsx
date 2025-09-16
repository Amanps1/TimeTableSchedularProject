import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select
} from '@mui/material'
import { Schedule, CheckCircle, Pending, Cancel, Add, Visibility } from '@mui/icons-material'
import api from '../services/api'

const Timetables = () => {
  const [timetables, setTimetables] = useState([])
  const [sections, setSections] = useState([])
  const [openDialog, setOpenDialog] = useState(false)
  const [formData, setFormData] = useState({})
  const [selectedTimetable, setSelectedTimetable] = useState(null)
  const [timetableDetails, setTimetableDetails] = useState(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [timetableRes, sectionRes] = await Promise.all([
        api.get('/timetable'),
        api.get('/admin/sections')
      ])
      setTimetables(timetableRes.data)
      setSections(sectionRes.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const handleGenerate = async () => {
    try {
      const response = await api.post('/admin/generateTimetable', formData)
      if (response.data.success) {
        alert(`Successfully generated ${response.data.totalSolutions} timetable options!`)
      }
      setOpenDialog(false)
      setFormData({})
      fetchData()
    } catch (error) {
      console.error('Error generating timetable:', error)
      alert('Failed to generate timetable: ' + (error.response?.data?.message || error.message))
    }
  }

  const handleViewTimetable = async (timetableId) => {
    try {
      const response = await api.get(`/admin/timetables/${timetableId}`)
      setTimetableDetails(response.data)
      setSelectedTimetable(timetableId)
    } catch (error) {
      console.error('Error fetching timetable details:', error)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'APPROVED': return 'success'
      case 'REJECTED': return 'error'
      default: return 'warning'
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  const groupedTimetables = {
    pending: timetables.filter(t => t.status === 'PENDING'),
    approved: timetables.filter(t => t.status === 'APPROVED'),
    rejected: timetables.filter(t => t.status === 'REJECTED')
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        visible: { transition: { staggerChildren: 0.1 } }
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h4">
          Timetable Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpenDialog(true)}
        >
          Generate Timetable
        </Button>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <motion.div variants={cardVariants}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <Pending color="warning" sx={{ mr: 2 }} />
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      Pending Timetables
                    </Typography>
                    <Typography variant="h5">
                      {groupedTimetables.pending.length}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        <Grid item xs={12} sm={4}>
          <motion.div variants={cardVariants}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <CheckCircle color="success" sx={{ mr: 2 }} />
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      Approved Timetables
                    </Typography>
                    <Typography variant="h5">
                      {groupedTimetables.approved.length}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        <Grid item xs={12} sm={4}>
          <motion.div variants={cardVariants}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <Cancel color="error" sx={{ mr: 2 }} />
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      Rejected Timetables
                    </Typography>
                    <Typography variant="h5">
                      {groupedTimetables.rejected.length}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>

      <motion.div variants={cardVariants}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              All Generated Timetables
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Section</TableCell>
                    <TableCell>Academic Year</TableCell>
                    <TableCell>Semester</TableCell>
                    <TableCell>Generated By</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Slots</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {timetables.map((timetable) => (
                    <TableRow key={timetable._id}>
                      <TableCell>
                        <Typography variant="body2" fontWeight="bold">
                          {timetable.sectionId?.sectionName || 'Unknown'}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {timetable.sectionId?.departmentId?.name}
                        </Typography>
                      </TableCell>
                      <TableCell>{timetable.academicYear}</TableCell>
                      <TableCell>{timetable.semester}</TableCell>
                      <TableCell>{timetable.generatedBy?.name}</TableCell>
                      <TableCell>
                        <Chip
                          label={timetable.status}
                          color={getStatusColor(timetable.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{timetable.slots?.length || 0}</TableCell>
                      <TableCell>
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<Visibility />}
                          onClick={() => handleViewTimetable(timetable._id)}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            
            {timetables.length === 0 && (
              <Box textAlign="center" py={4}>
                <Schedule sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="textSecondary" gutterBottom>
                  No Timetables Generated
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Click "Generate Timetable" to create your first timetable
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Generate Timetable Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Generate AI-Optimized Timetable</DialogTitle>
        <DialogContent>
          <Box sx={{ minWidth: 300, pt: 1 }}>
            <FormControl fullWidth margin="dense" variant="outlined">
              <InputLabel>Select Section</InputLabel>
              <Select
                value={formData.sectionId || ''}
                onChange={(e) => setFormData({ ...formData, sectionId: e.target.value })}
                label="Select Section"
              >
                <MenuItem value="">
                  <em>Choose a section...</em>
                </MenuItem>
                {sections.map((section) => (
                  <MenuItem key={section._id} value={section._id}>
                    {section.sectionName} - {section.departmentId?.name} ({section.studentCount || 0} students)
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              margin="dense"
              label="Academic Year"
              fullWidth
              variant="outlined"
              placeholder="e.g., 2024-25"
              value={formData.academicYear || ''}
              onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
            />
            <FormControl fullWidth margin="dense" variant="outlined">
              <InputLabel>Semester</InputLabel>
              <Select
                value={formData.semester || ''}
                onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                label="Semester"
              >
                <MenuItem value="">
                  <em>Select semester...</em>
                </MenuItem>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                  <MenuItem key={sem} value={sem}>
                    Semester {sem}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleGenerate} 
            variant="contained"
            disabled={!formData.sectionId || !formData.academicYear || !formData.semester}
          >
            Generate Timetable
          </Button>
        </DialogActions>
      </Dialog>

      {/* Timetable Details Dialog */}
      <Dialog
        open={Boolean(selectedTimetable)}
        onClose={() => setSelectedTimetable(null)}
        maxWidth="xl"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center">
            <Schedule color="primary" sx={{ mr: 2 }} />
            Timetable Details
          </Box>
        </DialogTitle>
        <DialogContent>
          {timetableDetails && (
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Day</strong></TableCell>
                    <TableCell align="center"><strong>Period 1</strong><br/>9:00-10:00</TableCell>
                    <TableCell align="center"><strong>Period 2</strong><br/>10:00-11:00</TableCell>
                    <TableCell align="center"><strong>Period 3</strong><br/>11:15-12:15</TableCell>
                    <TableCell align="center"><strong>Period 4</strong><br/>12:15-1:15</TableCell>
                    <TableCell align="center"><strong>Period 5</strong><br/>2:15-3:15</TableCell>
                    <TableCell align="center"><strong>Period 6</strong><br/>3:15-4:15</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'].map(day => {
                    const daySlots = timetableDetails.slots.filter(slot => slot.day === day).sort((a, b) => a.period - b.period)
                    return (
                      <TableRow key={day}>
                        <TableCell><strong>{day}</strong></TableCell>
                        {[1, 2, 3, 4, 5, 6].map(period => {
                          const slot = daySlots.find(s => s.period === period)
                          return (
                            <TableCell key={period} align="center">
                              {slot ? (
                                <Box>
                                  <Typography variant="body2" fontWeight="bold" color="primary">
                                    {slot.subjectId?.name}
                                  </Typography>
                                  <Typography variant="caption" display="block">
                                    {slot.staffId?.name}
                                  </Typography>
                                  <Typography variant="caption" color="textSecondary">
                                    {slot.room}
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
                    )
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedTimetable(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </motion.div>
  )
}

export default Timetables