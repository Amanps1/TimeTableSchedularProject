import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import api from '../services/api'

const Departments = () => {
  const [departments, setDepartments] = useState([])
  const [openDialog, setOpenDialog] = useState(false)
  const [formData, setFormData] = useState({})

  useEffect(() => {
    fetchDepartments()
  }, [])

  const fetchDepartments = async () => {
    try {
      const response = await api.get('/admin/departments')
      setDepartments(response.data)
    } catch (error) {
      console.error('Error fetching departments:', error)
    }
  }

  const handleCreate = async () => {
    try {
      await api.post('/admin/departments', formData)
      setOpenDialog(false)
      setFormData({})
      fetchDepartments()
    } catch (error) {
      console.error('Error creating department:', error)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Departments</h1>
        <button
          onClick={() => setOpenDialog(true)}
          className="btn-primary"
        >
          Add Department
        </button>
      </div>

      <div className="grid gap-4">
        {departments.map((dept) => (
          <motion.div
            key={dept._id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card"
          >
            <h3 className="text-xl font-semibold text-gray-900">{dept.name}</h3>
            <p className="text-gray-600">Code: {dept.code}</p>
          </motion.div>
        ))}
      </div>

      {openDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 w-96"
          >
            <h2 className="text-xl font-bold mb-4">Add Department</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Department Name"
                className="input-field"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <input
                type="text"
                placeholder="Department Code"
                className="input-field"
                value={formData.code || ''}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              />
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

export default Departments