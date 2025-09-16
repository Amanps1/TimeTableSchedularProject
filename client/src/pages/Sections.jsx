import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material'
import { School, People, Class } from '@mui/icons-material'
import api from '../services/api'

const Sections = () => {
  const [sections, setSections] = useState([])
  const [departmentInfo, setDepartmentInfo] = useState(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [sectionsRes, deptRes] = await Promise.all([
        api.get('/hod/sections'),
        api.get('/hod/department')
      ])
      setSections(sectionsRes.data)
      setDepartmentInfo(deptRes.data)
    } catch (error) {
      console.error('Error fetching sections:', error)
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        visible: { transition: { staggerChildren: 0.1 } }
      }}
    >
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Department Sections
        </Typography>
        {departmentInfo && (
          <Typography variant="h6" color="textSecondary">
            {departmentInfo.name} ({departmentInfo.code}) Department
          </Typography>
        )}
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <motion.div variants={cardVariants}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <Class color="primary" sx={{ mr: 2 }} />
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      Total Sections
                    </Typography>
                    <Typography variant="h5">
                      {sections.length}
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
                  <People color="success" sx={{ mr: 2 }} />
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      Total Students
                    </Typography>
                    <Typography variant="h5">
                      {sections.reduce((total, section) => total + (section.studentCount || 0), 0)}
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
                  <School color="info" sx={{ mr: 2 }} />
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      Average Class Size
                    </Typography>
                    <Typography variant="h5">
                      {sections.length > 0 ? 
                        Math.round(sections.reduce((total, section) => total + (section.studentCount || 0), 0) / sections.length)
                        : 0
                      }
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
              Section Details
            </Typography>
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Section Name</strong></TableCell>
                    <TableCell><strong>Semester</strong></TableCell>
                    <TableCell><strong>Student Count</strong></TableCell>
                    <TableCell><strong>Academic Year</strong></TableCell>
                    <TableCell><strong>Status</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sections.map((section) => (
                    <TableRow key={section._id}>
                      <TableCell>
                        <Typography variant="body1" fontWeight="bold">
                          {section.sectionName}
                        </Typography>
                      </TableCell>
                      <TableCell>{section.semester}</TableCell>
                      <TableCell>{section.studentCount || 'N/A'}</TableCell>
                      <TableCell>{section.academicYear || 'N/A'}</TableCell>
                      <TableCell>
                        <Chip 
                          label="Active" 
                          color="success" 
                          size="small" 
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            
            {sections.length === 0 && (
              <Box textAlign="center" py={4}>
                <Typography color="textSecondary">
                  No sections found for your department
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}

export default Sections