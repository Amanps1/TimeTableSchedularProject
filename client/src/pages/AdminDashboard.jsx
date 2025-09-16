import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  LinearProgress,
  Divider,
  IconButton,
  Tooltip
} from '@mui/material'
import { 
  Add, 
  School, 
  People, 
  Schedule, 
  Assessment,
  TrendingUp,
  Dashboard,
  Analytics,
  Settings,
  Refresh,
  Launch,
  AutoAwesome
} from '@mui/icons-material'
import api from '../services/api'

const AdminDashboard = () => {
  const navigate = useNavigate()
  const [stats, setStats] = useState({})
  const [departments, setDepartments] = useState([])
  const [staff, setStaff] = useState([])
  const [timetables, setTimetables] = useState([])
  const [sections, setSections] = useState([])
  const [openDialog, setOpenDialog] = useState('')
  const [formData, setFormData] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [deptRes, staffRes, timetableRes, sectionsRes] = await Promise.all([
        api.get('/admin/departments').catch(() => ({ data: [] })),
        api.get('/admin/staff').catch(() => ({ data: [] })),
        api.get('/timetable').catch(() => ({ data: [] })),
        api.get('/admin/sections').catch(() => ({ data: [] }))
      ])
      
      console.log('Departments data:', deptRes.data)
      setDepartments(deptRes.data || [])
      setStaff(staffRes.data || [])
      setTimetables(timetableRes.data || [])
      setSections(sectionsRes.data || [])
      
      // Calculate comprehensive stats
      const timetables = timetableRes.data || []
      const staff = staffRes.data || []
      const departments = deptRes.data || []
      const sections = sectionsRes.data || []
      
      setStats({
        totalTimetables: timetables.length,
        pendingTimetables: timetables.filter(t => t.status === 'PENDING').length,
        approvedTimetables: timetables.filter(t => t.status === 'APPROVED').length,
        totalStaff: staff.length,
        totalDepartments: departments.length,
        totalSections: sections.length,
        efficiency: Math.round((timetables.filter(t => t.status === 'APPROVED').length / Math.max(timetables.length, 1)) * 100)
      })
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const handleCreateDepartment = async () => {
    try {
      await api.post('/admin/departments', formData)
      setOpenDialog('')
      setFormData({})
      fetchData()
    } catch (error) {
      console.error('Error creating department:', error)
    }
  }

  const handleGenerateTimetable = () => {
    navigate('/timetable-generator')
    setOpenDialog('')
    setFormData({})
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  const StatCard = ({ title, value, icon, color, trend, onClick, subtitle }) => (
    <motion.div variants={cardVariants}>
      <Card 
        sx={{ 
          cursor: onClick ? 'pointer' : 'default',
          background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`,
          border: `1px solid ${color}20`,
          '&:hover': onClick ? { 
            transform: 'translateY(-4px)', 
            boxShadow: `0 8px 25px ${color}25`,
            transition: 'all 0.3s ease'
          } : {},
          transition: 'all 0.3s ease',
          position: 'relative',
          overflow: 'hidden'
        }}
        onClick={onClick}
      >
        <Box
          sx={{
            position: 'absolute',
            top: -20,
            right: -20,
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: `${color}10`,
            opacity: 0.5
          }}
        />
        <CardContent sx={{ position: 'relative', zIndex: 1 }}>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box>
              <Typography color="textSecondary" variant="body2" gutterBottom>
                {title}
              </Typography>
              <Typography variant="h4" fontWeight="bold" color={color}>
                {value}
              </Typography>
              {subtitle && (
                <Typography variant="caption" color="textSecondary">
                  {subtitle}
                </Typography>
              )}
            </Box>
            <Avatar sx={{ bgcolor: color, width: 56, height: 56 }}>
              {icon}
            </Avatar>
          </Box>
          {trend && (
            <Box display="flex" alignItems="center" mt={1}>
              <TrendingUp sx={{ color: 'success.main', fontSize: 16, mr: 0.5 }} />
              <Typography variant="caption" color="success.main">
                +{trend}% from last month
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        visible: { transition: { staggerChildren: 0.1 } }
      }}
      style={{ padding: '24px' }}
    >
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h3" fontWeight="bold" gutterBottom>
            Admin Dashboard
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Smart Timetable Management System
          </Typography>
        </Box>
        <Box display="flex" gap={1}>
          <Tooltip title="Refresh Data">
            <IconButton onClick={fetchData} color="primary">
              <Refresh />
            </IconButton>
          </Tooltip>
          <Button
            variant="contained"
            startIcon={<AutoAwesome />}
            onClick={() => navigate('/timetable-generator')}
            sx={{
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
            }}
          >
            Generate AI Timetable
          </Button>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Departments"
            value={stats.totalDepartments || 0}
            icon={<School />}
            color="#1976d2"
            trend={12}
            onClick={() => navigate('/departments')}
            subtitle="CSE, ECE, MECH, CIVIL"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Staff"
            value={stats.totalStaff || 0}
            icon={<People />}
            color="#388e3c"
            trend={8}
            onClick={() => navigate('/staff')}
            subtitle="Active faculty members"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Generated Timetables"
            value={stats.totalTimetables || 0}
            icon={<Schedule />}
            color="#f57c00"
            trend={25}
            onClick={() => navigate('/timetables')}
            subtitle={`${stats.approvedTimetables || 0} approved`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="System Efficiency"
            value={`${stats.efficiency || 0}%`}
            icon={<Assessment />}
            color="#7b1fa2"
            trend={5}
            subtitle="Approval rate"
          />
        </Grid>
      </Grid>

      {/* Main Content */}
      <Grid container spacing={3}>
        {/* Departments Section */}
        <Grid item xs={12} lg={6}>
          <motion.div variants={cardVariants}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Box display="flex" alignItems="center">
                    <Dashboard sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h6" fontWeight="bold">
                      Departments Overview
                    </Typography>
                  </Box>
                  <Button
                    startIcon={<Add />}
                    variant="outlined"
                    size="small"
                    onClick={() => setOpenDialog('department')}
                  >
                    Add Department
                  </Button>
                </Box>
                <Divider sx={{ mb: 2 }} />
                
                {departments && departments.length > 0 ? (
                  <Box>
                    {departments.map((dept, index) => (
                      <Box key={dept._id || index} mb={2}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                          <Box display="flex" alignItems="center">
                            <Avatar 
                              sx={{ 
                                width: 32, 
                                height: 32, 
                                mr: 2, 
                                bgcolor: ['#1976d2', '#388e3c', '#f57c00', '#7b1fa2'][index % 4] 
                              }}
                            >
                              {dept.code || 'N/A'}
                            </Avatar>
                            <Box>
                              <Typography variant="body1" fontWeight="medium">
                                {dept.name || 'Unknown Department'}
                              </Typography>
                              <Typography variant="caption" color="textSecondary">
                                Code: {dept.code || 'N/A'}
                              </Typography>
                            </Box>
                          </Box>
                          <IconButton size="small" onClick={() => navigate(`/department/${dept._id}`)}>
                            <Launch fontSize="small" />
                          </IconButton>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={75 + (index * 5)} 
                          sx={{ height: 4, borderRadius: 2 }}
                        />
                        <Typography variant="caption" color="textSecondary">
                          {75 + (index * 5)}% staff utilization
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                ) : (
                  <Box textAlign="center" py={4}>
                    <School sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
                    <Typography color="textSecondary" mb={2}>
                      {departments === null ? 'Loading departments...' : 'No departments found.'}
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<Add />}
                      onClick={() => setOpenDialog('department')}
                    >
                      Add First Department
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Recent Timetables */}
        <Grid item xs={12} lg={6}>
          <motion.div variants={cardVariants}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Box display="flex" alignItems="center">
                    <Analytics sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h6" fontWeight="bold">
                      Recent Timetables
                    </Typography>
                  </Box>
                  <Button
                    startIcon={<AutoAwesome />}
                    variant="contained"
                    size="small"
                    onClick={() => navigate('/timetable-generator')}
                  >
                    Generate New
                  </Button>
                </Box>
                <Divider sx={{ mb: 2 }} />
                
                {timetables.length > 0 ? (
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Section</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell>Created</TableCell>
                          <TableCell>Action</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {timetables.slice(0, 5).map((timetable) => (
                          <TableRow key={timetable._id} hover>
                            <TableCell>
                              <Typography variant="body2" fontWeight="medium">
                                {timetable.sectionId?.sectionName || 'N/A'}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={timetable.status}
                                color={
                                  timetable.status === 'APPROVED' ? 'success' : 
                                  timetable.status === 'PENDING' ? 'warning' : 'error'
                                }
                                size="small"
                                variant="outlined"
                              />
                            </TableCell>
                            <TableCell>
                              <Typography variant="caption">
                                {new Date(timetable.createdAt).toLocaleDateString()}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <IconButton size="small">
                                <Launch fontSize="small" />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Box textAlign="center" py={4}>
                    <Schedule sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
                    <Typography color="textSecondary" mb={2}>
                      No timetables generated yet.
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<AutoAwesome />}
                      onClick={() => navigate('/timetable-generator')}
                    >
                      Generate Your First Timetable
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>

      {/* Department Dialog */}
      <Dialog open={openDialog === 'department'} onClose={() => setOpenDialog('')} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center">
            <School sx={{ mr: 1 }} />
            Add New Department
          </Box>
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Department Name"
            fullWidth
            variant="outlined"
            placeholder="e.g., Computer Science and Engineering"
            value={formData.name || ''}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Department Code"
            fullWidth
            variant="outlined"
            placeholder="e.g., CSE"
            value={formData.code || ''}
            onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenDialog('')}>Cancel</Button>
          <Button 
            onClick={handleCreateDepartment} 
            variant="contained"
            disabled={!formData.name || !formData.code}
          >
            Create Department
          </Button>
        </DialogActions>
      </Dialog>
    </motion.div>
  )
}

export default AdminDashboard