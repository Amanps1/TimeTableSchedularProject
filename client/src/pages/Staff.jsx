import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import api from '../services/api'

const Staff = () => {
  const [staff, setStaff] = useState([])
  const [departments, setDepartments] = useState([])
  const [subjects, setSubjects] = useState([])
  const [openDialog, setOpenDialog] = useState(false)
  const [formData, setFormData] = useState({})
  const [selectedSubjects, setSelectedSubjects] = useState([])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [staffRes, deptRes, subjectRes] = await Promise.all([
        api.get('/admin/staff'),
        api.get('/admin/departments'),
        api.get('/admin/subjects')
      ])
      setStaff(staffRes.data)
      setDepartments(deptRes.data)
      setSubjects(subjectRes.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const handleCreate = async () => {
    try {
      await api.post('/admin/staff', {
        ...formData,
        expertiseSubjects: selectedSubjects
      })
      setOpenDialog(false)
      setFormData({})
      setSelectedSubjects([])
      fetchData()
    } catch (error) {
      console.error('Error creating staff:', error)
      alert('Error creating staff: ' + (error.response?.data?.message || error.message))
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Staff Management</h1>
        <button
          onClick={() => setOpenDialog(true)}
          className="btn-primary"
        >
          Add Staff
        </button>
      </div>

      <div className="grid gap-4">
        {staff.map((member) => (
          <motion.div
            key={member._id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{member.name}</h3>
                <p className="text-gray-600">Department: {member.departmentId?.name}</p>
                <p className="text-gray-600">Max Hours: {member.maxHours}</p>
                <p className="text-gray-600">Current Workload: {member.currentWorkload}</p>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">Expertise Subjects:</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {member.expertiseSubjects?.map(subject => (
                      <span key={subject._id} className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                        {subject.name} (Sem {subject.semester})
                      </span>
                    )) || <span className="text-gray-400 text-xs">No subjects assigned</span>}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className="inline-block bg-primary-100 text-primary-800 px-2 py-1 rounded text-sm">
                  {member.expertiseSubjects?.length || 0} Subjects
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {openDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 w-96 max-h-96 overflow-y-auto"
          >
            <h2 className="text-xl font-bold mb-4">Add Staff Member</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Staff Name"
                className="input-field"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <input
                type="email"
                placeholder="Email"
                className="input-field"
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              <input
                type="password"
                placeholder="Password"
                className="input-field"
                value={formData.password || ''}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <select
                className="input-field"
                value={formData.departmentId || ''}
                onChange={(e) => {
                  setFormData({ ...formData, departmentId: e.target.value })
                  setSelectedSubjects([])
                }}
              >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept._id} value={dept._id}>{dept.name}</option>
                ))}
              </select>
              
              {formData.departmentId && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Expertise Subjects (by Semester)
                  </label>
                  <div className="max-h-48 overflow-y-auto border rounded p-3 bg-gray-50">
                    {[1,2,3,4,5,6,7,8].map(semester => {
                      const semesterSubjects = subjects.filter(s => 
                        s.departmentId === formData.departmentId && s.semester === semester
                      )
                      if (semesterSubjects.length === 0) return null
                      
                      return (
                        <div key={semester} className="mb-4 p-2 bg-white rounded border">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-blue-800">📚 Semester {semester}</h4>
                            <span className="text-xs text-gray-500">{semesterSubjects.length} subjects</span>
                          </div>
                          <div className="grid grid-cols-1 gap-1">
                            {semesterSubjects.map(subject => (
                              <label key={subject._id} className="flex items-center p-1 hover:bg-blue-50 rounded">
                                <input
                                  type="checkbox"
                                  checked={selectedSubjects.includes(subject._id)}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setSelectedSubjects([...selectedSubjects, subject._id])
                                    } else {
                                      setSelectedSubjects(selectedSubjects.filter(id => id !== subject._id))
                                    }
                                  }}
                                  className="mr-2 text-blue-600"
                                />
                                <div className="flex-1">
                                  <span className="text-sm font-medium">{subject.name}</span>
                                  <div className="text-xs text-gray-500">
                                    {subject.code} • {subject.type} • {subject.credits} credits • {subject.hoursPerWeek}h/week
                                  </div>
                                </div>
                              </label>
                            ))}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Selected: {selectedSubjects.length} subjects
                  </p>
                </div>
              )}
            </div>
            <div className="flex gap-2 mt-6">
              <button onClick={() => setOpenDialog(false)} className="btn-secondary">
                Cancel
              </button>
              <button onClick={handleCreate} className="btn-primary">
                Create
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  )
}

export default Staff