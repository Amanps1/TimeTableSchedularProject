import { Routes, Route, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from './context/AuthContext'
import Login from './pages/Login'
import SignupStaff from './pages/SignupStaff'
import SignupStudent from './pages/SignupStudent'
import AdminDashboard from './pages/AdminDashboard'
import HODDashboard from './pages/HODDashboard'
import StaffDashboard from './pages/StaffDashboard'
import StudentDashboard from './pages/StudentDashboard'
import Departments from './pages/Departments'
import Staff from './pages/Staff'
import Timetables from './pages/Timetables'
import PendingApprovals from './pages/PendingApprovals'
import PendingApprovalsAdmin from './pages/PendingApprovalsAdmin'
import StaffWorkload from './pages/StaffWorkload'
import TimetableGenerator from './pages/TimetableGenerator'
import ApprovedTimetables from './pages/ApprovedTimetables'
import Sections from './pages/Sections'
import Layout from './components/Layout'

function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center min-h-screen"
      >
        Loading...
      </motion.div>
    )
  }

  if (!user) {
    return (
      <Routes>
        <Route path="/signup-staff" element={<SignupStaff />} />
        <Route path="/signup-student" element={<SignupStudent />} />
        <Route path="*" element={<Login />} />
      </Routes>
    )
  }

  const getRoutes = () => {
    switch (user.role) {
      case 'ADMIN':
        return (
          <Routes>
            <Route path="/" element={<AdminDashboard />} />
            <Route path="/dashboard" element={<AdminDashboard />} />
            <Route path="/departments" element={<Departments />} />
            <Route path="/staff" element={<Staff />} />
            <Route path="/timetables" element={<Timetables />} />
            <Route path="/pending-approvals" element={<PendingApprovalsAdmin />} />
            <Route path="/timetable-generator" element={<TimetableGenerator />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        )
      case 'HOD':
        return (
          <Routes>
            <Route path="/" element={<HODDashboard />} />
            <Route path="/dashboard" element={<HODDashboard />} />
            <Route path="/approvals" element={<PendingApprovals />} />
            <Route path="/workload" element={<StaffWorkload />} />
            <Route path="/sections" element={<Sections />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        )
      case 'STAFF':
        return (
          <Routes>
            <Route path="/" element={<StaffDashboard />} />
            <Route path="/dashboard" element={<StaffDashboard />} />
            <Route path="/workload" element={<StaffWorkload />} />
            <Route path="/approved-timetables" element={<ApprovedTimetables />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        )
      case 'STUDENT':
        return (
          <Routes>
            <Route path="/" element={<StudentDashboard />} />
            <Route path="/dashboard" element={<StudentDashboard />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        )
      default:
        return <Navigate to="/login" />
    }
  }

  return (
    <Layout>
      {getRoutes()}
    </Layout>
  )
}

export default App