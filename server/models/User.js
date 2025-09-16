const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['ADMIN', 'HOD', 'STAFF', 'STUDENT'], required: true },
  departmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' }
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function(password) {
  // Handle both hashed and plain text passwords for demo
  if (this.password.startsWith('$2a$') || this.password.startsWith('$2b$')) {
    return bcrypt.compare(password, this.password);
  } else {
    // For demo data with plain text passwords
    return password === this.password;
  }
};

module.exports = mongoose.model('User', userSchema);