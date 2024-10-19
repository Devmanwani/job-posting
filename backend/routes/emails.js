const express = require('express');
const Job = require('../models/Job');
const auth = require('../middleware/auth');
const sendEmail = require('../utils/sendEmail');

const router = express.Router();

router.post('/send-job-alert/:jobId', auth, async (req, res) => {
  try {
    const job = await Job.findOne({ _id: req.params.jobId, company: req.company.id });
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    const emailPromises = job.candidates.map(async (candidateEmail) => {
      const emailContent = `
        Job Title: ${job.title}
        Description: ${job.description}
        Experience Level: ${job.experienceLevel}
        End Date: ${job.endDate}
        
        This job alert is sent by ${req.company.name}.
      `;

      await sendEmail(candidateEmail, `Job Alert: ${job.title}`, emailContent);
    });

    await Promise.all(emailPromises);
    res.json({ message: 'Job alerts sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
