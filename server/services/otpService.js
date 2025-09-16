const crypto = require('crypto');
const OTP = require('../models/OTP');

class OTPService {
  generateOTP() {
    return crypto.randomInt(100000, 999999).toString();
  }

  async createOTP(email) {
    const otp = this.generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await OTP.deleteMany({ email }); // Remove existing OTPs
    
    const otpDoc = new OTP({
      email,
      otp,
      expiresAt
    });
    
    await otpDoc.save();
    
    // Simulate email sending (in production, use nodemailer)
    console.log(`OTP for ${email}: ${otp}`);
    
    return otp;
  }

  async verifyOTP(email, otp) {
    const otpDoc = await OTP.findOne({
      email,
      otp,
      expiresAt: { $gt: new Date() },
      verified: false
    });

    if (!otpDoc) {
      return false;
    }

    otpDoc.verified = true;
    await otpDoc.save();
    
    return true;
  }
}

module.exports = new OTPService();