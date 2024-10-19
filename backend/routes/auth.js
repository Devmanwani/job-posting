const express = require('express');
const jwt = require('jsonwebtoken');
const Company = require('../models/Company');
const sendEmail = require('../utils/sendEmail');
const auth = require('../middleware/auth');

const router = express.Router();

// Helper function to generate OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

router.get('/getCompany', async (req, res) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const company = await Company.findOne({ _id: decoded.id });

    if (!company) {
      throw new Error();
    }

    res.status(200).json({ name: company.name, isVerified: company.isVerified, email: company.email })

  } catch (error) {
    console.log(error);
    res.status(401).json({ message: 'Please authenticate' });
  }
});

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, mobile } = req.body;
    let company = await Company.findOne({ email });
    if (company) {
      return res.json({ message: 'Company already exists' });
    }

    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // OTP expires in 5 minutes

    company = new Company({ name, email, password, mobile, otp, otpExpires });
    await company.save();

    await sendEmail(email, 'Verify your account', `Your OTP is: ${otp}. It will expire in 5 minutes.`);

    res.status(201).json({ message: 'Company registered. Please check your email for OTP verification.' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/verify', async (req, res) => {
  try {
    const { email, otp } = req.body;
    const company = await Company.findOne({ email });

    if (!company) {
      return res.status(400).json({ message: 'Company not found' });
    }

    if (company.isVerified) {
      return res.status(400).json({ message: 'Company already verified' });
    }

    if (company.otp !== otp || company.otpExpires < new Date()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    company.isVerified = true;
    company.otp = undefined;
    company.otpExpires = undefined;
    await company.save();

    res.json({ message: 'Account verified successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/resend-otp', async (req, res) => {
  try {
    const { email } = req.body;
    const company = await Company.findOne({ email });

    if (!company) {
      return res.status(400).json({ message: 'Company not found' });
    }

    if (company.isVerified) {
      return res.status(400).json({ message: 'Company already verified' });
    }

    if (company.otpExpires && company.otpExpires > new Date()) {
      const timeLeft = Math.ceil((company.otpExpires - new Date()) / 1000 / 60);
      return res.status(400).json({ message: `Please wait ${timeLeft} minutes before requesting a new OTP` });
    }

    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // OTP expires in 5 minutes

    company.otp = otp;
    company.otpExpires = otpExpires;
    await company.save();

    await sendEmail(email, 'New OTP for account verification', `Your new OTP is: ${otp}. It will expire in 5 minutes.`);

    res.json({ message: 'New OTP sent successfully' });
  } catch (error) {
    console.log(erorr);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const company = await Company.findOne({ email });
    if (!company || !(await company.comparePassword(password))) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }


    const token = jwt.sign({ id: company._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/logout', auth, (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

module.exports = router;
