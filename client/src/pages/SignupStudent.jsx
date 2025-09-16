import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import api from '../services/api'

const SignupStudent = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    departmentId: ''
  })
  const [departments, setDepartments] = useState([])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchDepartments()
  }, [])

  const fetchDepartments = async () => {
    try {
      const response = await api.get('/auth/departments')
      setDepartments(response.data)
    } catch (error) {
      console.error('Error fetching departments:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await api.post('/auth/register', {
        ...formData,
        role: 'STUDENT'
      })

      setSuccess('Student registration successful! You can now login.')
      setTimeout(() => {
        window.location.href = '/'
      }, 2000)
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-center mb-8"
          >
            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl text-white">🎓</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Student Registration</h1>
            <p className="text-gray-600">Create Your Student Account</p>
          </motion.div>
          
          {error && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6"
            >
              {error}
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6"
            >
              {success}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input-field"
                placeholder="Enter your full name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="input-field"
                placeholder="student@college.edu"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="input-field"
                placeholder="Enter your password"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
              <select
                value={formData.departmentId}
                onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                className="input-field"
                required
              >
                <option value="">Select Your Department</option>
                {departments.map((dept) => (
                  <option key={dept._id} value={dept._id}>{dept.name}</option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {loading ? 'Creating Account...' : 'Register as Student'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              <Link to="/signup-staff" className="text-orange-600 hover:text-orange-700">Staff Signup</Link>
            </p>
            <p className="text-gray-600 mt-2">
              <Link to="/" className="text-gray-500 hover:text-gray-700">Back to Login</Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default SignupStudent