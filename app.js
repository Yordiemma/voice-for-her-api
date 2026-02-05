const express = require('express');
const app = express();
require('dotenv').config();

const { connectDB, Report } = require('./db');
connectDB();

const crypto = require('crypto');
const PORT = process.env.PORT || 3000;

app.use(express.json());

const rateLimitStore = {};

app.get('/', (req, res) => {
  res.status(200).send('Voice for Her API is running');
});



// GET /stats (admin / teacher / homepage)
app.get('/stats', async (req, res) => {
  try {
    const totalReports = await Report.countDocuments();

    const byCountry = await Report.aggregate([
      { $group: { _id: '$country', count: { $sum: 1 } } }
    ]);

    const byAbuseType = await Report.aggregate([
      { $group: { _id: '$abuseType', count: { $sum: 1 } } }
    ]);

    res.status(200).json({
      totalReports,
      byCountry,
      byAbuseType
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to load statistics' });
  }
});


app.post('/reports', async (req, res) => {
  const { abuseType, age, country, contactInfo } = req.body;
  const ip = req.ip;
  const now = Date.now();

  const THREE_HOURS = 3 * 60 * 60 * 1000;

  if (!rateLimitStore[ip]) rateLimitStore[ip] = [];
  rateLimitStore[ip] = rateLimitStore[ip].filter(t => now - t < THREE_HOURS);

  if (rateLimitStore[ip].length >= 2) {
    return res.status(429).json({ error: 'Too many reports' });
  }

  const allowedTypes = ['physical', 'verbal', 'emotional', 'sexual', 'online'];
  if (!allowedTypes.includes(abuseType)) {
    return res.status(400).json({ error: 'Invalid abuse type' });
  }

  if (typeof age !== 'number' || age < 1 || age > 120) {
    return res.status(400).json({ error: 'Invalid age' });
  }

  if (!country || typeof country !== 'string') {
    return res.status(400).json({ error: 'Country required' });
  }

  let contactRemovalToken = null;
  if (contactInfo) contactRemovalToken = crypto.randomUUID();

  const report = new Report({
    abuseType,
    age,
    country,
    contactInfo,
    contactRemovalToken
  });

  await report.save();
  rateLimitStore[ip].push(now);

 res.status(201).json({
  message: contactRemovalToken
    ? 'Report submitted successfully. Save your token if you want to delete your contact information later.'
    : 'Report submitted successfully',
  contactRemovalToken
});

});

app.delete('/reports/contact', async (req, res) => {
  if (!req.body || !req.body.token) {
    return res.status(400).json({ error: 'Token required' });
  }

  const { token } = req.body;

  const report = await Report.findOne({ contactRemovalToken: token });
  if (!report) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  report.contactInfo = undefined;
  report.contactRemovalToken = undefined;
  await report.save();

  res.status(200).json({ message: 'Contact information removed' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
