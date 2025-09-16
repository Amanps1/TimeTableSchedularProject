import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [showOTP, setShowOTP] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const result = await login(email, password, otp)
    
    if (result.requiresOTP) {
      setShowOTP(true)
      setError('')
    } else if (!result.success) {
      setError(result.message)
    }
    
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center p-4">
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
            <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Smart Timetable</h1>
            <p className="text-gray-600">Sign in to your account</p>
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

          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="Enter your email"
                required
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="Enter your password"
                required
              />
            </motion.div>

            {showOTP && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-blue-50 border border-blue-200 rounded-lg p-4"
              >
                <label className="block text-sm font-medium text-blue-700 mb-2">Enter OTP</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="input-field"
                  placeholder="Enter 6-digit OTP"
                  maxLength={6}
                  required
                />
                <p className="text-sm text-blue-600 mt-2">OTP sent to your email. Check console for demo OTP.</p>
              </motion.div>
            )}

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full btn-primary justify-center py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {showOTP ? 'Verifying...' : 'Signing in...'}
                </div>
              ) : (
                showOTP ? 'Verify OTP' : 'Sign In'
              )}
            </motion.button>
          </form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mt-6 text-center"
          >
            <p className="text-gray-600 mb-3">
              Don't have an account?
            </p>
            <div className="flex justify-center gap-4">
              <Link to="/signup-staff" className="text-orange-600 hover:text-orange-700 font-medium">
                👨🏫 Staff Signup
              </Link>
              <Link to="/signup-student" className="text-purple-600 hover:text-purple-700 font-medium">
                🎓 Student Signup
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="mt-4 p-4 bg-gray-50 rounded-lg"
          >
            <p className="text-sm font-medium text-gray-700 mb-3">Demo Credentials:</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-white p-2 rounded border">
                <p className="font-medium text-primary-600">Admin</p>
                <p className="text-gray-600">admin@college.edu</p>
                <p className="text-gray-600">admin123</p>
              </div>
              <div className="bg-white p-2 rounded border">
                <p className="font-medium text-green-600">HOD</p>
                <p className="text-gray-600">hod@college.edu</p>
                <p className="text-gray-600">hod123</p>
              </div>
              <div className="bg-white p-2 rounded border">
                <p className="font-medium text-orange-600">Staff</p>
                <p className="text-gray-600">staff@college.edu</p>
                <p className="text-gray-600">staff123</p>
              </div>
              <div className="bg-white p-2 rounded border">
                <p className="font-medium text-purple-600">Student</p>
                <p className="text-gray-600">student@college.edu</p>
                <p className="text-gray-600">student123</p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

export default Login