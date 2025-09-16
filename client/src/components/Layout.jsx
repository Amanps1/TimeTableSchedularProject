import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'

const Layout = ({ children }) => {
  const { user, logout } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)

  const menuItems = {
    ADMIN: [
      { text: 'Dashboard', icon: '📊', path: '/' },
      { text: 'Departments', icon: '🏢', path: '/departments' },
      { text: 'Staff', icon: '👥', path: '/staff' },
      { text: 'Timetables', icon: '📅', path: '/timetables' }
    ],
    HOD: [
      { text: 'Dashboard', icon: '📊', path: '/' },
      { text: 'Pending Approvals', icon: '⏳', path: '/approvals' },
      { text: 'Staff Workload', icon: '📈', path: '/workload' },
      { text: 'Sections', icon: '🏫', path: '/sections' }
    ],
    STAFF: [
      { text: 'Dashboard', icon: '📊', path: '/' },
      { text: 'My Workload', icon: '📈', path: '/workload' },
      { text: 'Approved Timetables', icon: '✅', path: '/approved-timetables' }
    ],
    STUDENT: [
      { text: 'Dashboard', icon: '📊', path: '/' },
      { text: 'My Timetable', icon: '📅', path: '/timetable' },
      { text: 'Electives', icon: '📚', path: '/electives' }
    ]
  }

  const roleColors = {
    ADMIN: 'bg-red-500',
    HOD: 'bg-green-500',
    STAFF: 'bg-orange-500',
    STUDENT: 'bg-purple-500'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40"
      >
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors lg:hidden"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                  </svg>
                </div>
                <h1 className="text-xl font-bold text-gray-900 hidden sm:block">Smart Timetable</h1>
              </div>
            </div>

            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className={`w-8 h-8 ${roleColors[user?.role]} rounded-full flex items-center justify-center text-white font-medium text-sm`}>
                  {user?.name?.charAt(0)}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.role}</p>
                </div>
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50"
                  >
                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="flex">
        {/* Desktop Sidebar */}
        <motion.aside
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="hidden lg:block w-64 bg-white shadow-sm border-r border-gray-200 min-h-screen"
        >
          <nav className="p-4 space-y-2">
            {menuItems[user?.role]?.map((item, index) => (
              <motion.div
                key={item.text}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ x: 4 }}
              >
                <Link
                  to={item.path}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-primary-50 hover:text-primary-700 transition-all duration-200"
                >
                <span className="text-lg">{item.icon}</span>
                <span className="font-medium">{item.text}</span>
                </Link>
              </motion.div>
            ))}
          </nav>
        </motion.aside>

        {/* Mobile Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden"
                onClick={() => setSidebarOpen(false)}
              />
              <motion.aside
                initial={{ x: -300 }}
                animate={{ x: 0 }}
                exit={{ x: -300 }}
                className="fixed left-0 top-0 w-64 h-full bg-white shadow-xl z-50 lg:hidden"
              >
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-gray-900">Menu</h2>
                    <button
                      onClick={() => setSidebarOpen(false)}
                      className="p-2 rounded-lg hover:bg-gray-100"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
                <nav className="p-4 space-y-2">
                  {menuItems[user?.role]?.map((item) => (
                    <Link
                      key={item.text}
                      to={item.path}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-primary-50 hover:text-primary-700 transition-colors"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <span className="text-lg">{item.icon}</span>
                      <span className="font-medium">{item.text}</span>
                    </Link>
                  ))}
                </nav>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  )
}

export default Layout