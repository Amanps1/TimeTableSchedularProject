# Smart Timetable Scheduler (SIH 2025)

A comprehensive web-based timetable management system with AI-powered optimization and role-based access control.

## 🚀 Features

### Core Modules
- **Admin Module**: Manage departments, staff, subjects, and generate AI-optimized timetables
- **HOD Module**: Review and approve timetables, monitor staff workload distribution
- **Staff Module**: View personal timetables, apply for leave, request schedule changes
- **Student Module**: Access timetables, select electives, view live updates

### AI Engine
- **Genetic Algorithm** optimization for conflict-free scheduling
- **Constraint Satisfaction Problem (CSP)** for rule enforcement
- **Automatic rescheduling** when staff applies for leave
- **Workload balancing** across faculty members

### Key Rules Implemented
- 30 hours/week fixed slots
- Maximum 18 teaching hours per staff
- Minimum 30 students per elective
- 70 students = 1 staff allocation
- Maximum 6 hours/day per staff
- Block teaching support
- Automatic clash detection

## 🛠️ Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** authentication
- **bcryptjs** for password hashing

### Frontend
- **React.js** with Vite
- **Material-UI** for components
- **Framer Motion** for animations
- **Axios** for API calls

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd TimeTable
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Configure environment variables**
   ```bash
   # In server/.env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/timetable_db
   JWT_SECRET=your_jwt_secret_key_here_make_it_strong
   NODE_ENV=development
   ```

4. **Start MongoDB**
   ```bash
   # If using local MongoDB
   mongod
   ```

5. **Run the application**
   ```bash
   # Development mode (runs both server and client)
   npm run dev
   
   # Or run separately
   npm run server  # Backend on port 5000
   npm run client  # Frontend on port 3000
   ```

## 🔐 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@college.edu | admin123 |
| HOD | hod@college.edu | hod123 |
| Staff | staff@college.edu | staff123 |
| Student | student@college.edu | student123 |

## 📊 Database Schema

### Collections
- **Users**: Authentication and role management
- **Departments**: Academic departments
- **Sections**: Class sections with student count
- **Subjects**: Core, elective, and honors subjects
- **Staff**: Faculty profiles with expertise
- **Timetables**: Generated schedules
- **Slots**: Individual time slots
- **Requests**: Staff change requests
- **Leaves**: Leave applications

## 🤖 AI Engine Details

### Genetic Algorithm Implementation
- **Population Size**: 50 individuals
- **Generations**: 100 iterations
- **Mutation Rate**: 10%
- **Fitness Function**: Considers workload balance, clash avoidance, constraint satisfaction

### Constraint Satisfaction
- Hard constraints: No staff/room clashes, workload limits
- Soft constraints: Workload distribution, preference optimization

### Auto-Rescheduling
- Triggered on leave approval
- Finds substitute staff with same subject expertise
- Reschedules within the same week when possible

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user

### Admin Routes
- `POST /api/admin/departments` - Create department
- `POST /api/admin/staff` - Add staff member
- `POST /api/admin/generate-timetable` - Generate AI timetable
- `GET /api/admin/workload-report` - Staff workload analysis

### HOD Routes
- `GET /api/hod/pending-timetables` - Pending approvals
- `PATCH /api/hod/timetables/:id/status` - Approve/reject timetable
- `GET /api/hod/staff-workload` - Department workload

### Staff Routes
- `GET /api/staff/timetable` - Personal timetable
- `POST /api/staff/leave` - Apply for leave
- `POST /api/staff/request-change` - Request schedule change

### Student Routes
- `GET /api/student/timetable` - Class timetable
- `POST /api/student/choose-elective` - Select electives
- `GET /api/student/live-updates` - Recent changes

## 🔄 Workflow

1. **Admin** creates departments, adds staff, and defines subjects
2. **Admin** generates AI-optimized timetable using genetic algorithm
3. **HOD** reviews and approves/rejects the generated timetable
4. **Staff** can view their schedules and apply for leave
5. **Students** access approved timetables and select electives
6. **System** automatically reschedules when leave is approved

## 🎨 UI Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Smooth Animations**: Framer Motion for enhanced UX
- **Role-based Dashboards**: Customized interface for each user type
- **Real-time Updates**: Live timetable changes
- **Modern Material Design**: Clean and intuitive interface

## 🚀 Deployment

### Production Build
```bash
# Build client
cd client && npm run build

# Start production server
cd ../server && npm start
```

### Environment Variables (Production)
```bash
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/timetable_db
JWT_SECRET=your_production_jwt_secret
PORT=5000
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and queries, please contact the development team or create an issue in the repository.

---

**Smart Timetable Scheduler** - Revolutionizing academic scheduling with AI-powered optimization! 🎓✨