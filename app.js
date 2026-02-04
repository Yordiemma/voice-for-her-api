const express = require('express');
const app = express();

require('dotenv').config();

const connectDB = require('./db');
connectDB();

const PORT = process.env.PORT || 3000;

const crypto = require('crypto');

app.use(express.json());


const rateLimitStore = {};


app.get('/', (req, res) => {
  res.status(200).send('Voice for Her API is running');
});


// POST /reports
app.post('/reports', (req, res) => {
  const { abuseType, age, country, contactInfo } = req.body;
  const ip = req.ip;
  const now = Date.now();

  // ---- RATE LIMIT: 2 reports per 3 hours ----
  const THREE_HOURS = 3 * 60 * 60 * 1000;

  if (!rateLimitStore[ip]) {
    rateLimitStore[ip] = [];
  }

  // remove old timestamps
  rateLimitStore[ip] = rateLimitStore[ip].filter(
    time => now - time < THREE_HOURS
  );

  if (rateLimitStore[ip].length >= 2) {
    return res.status(429).json({
      error: 'Too many reports from this IP. Please try again later.'
    });
  }

  // ---- INPUT VALIDATION ----
  const allowedTypes = ['physical', 'verbal', 'emotional', 'sexual', 'online'];

  if (!allowedTypes.includes(abuseType)) {
    return res.status(400).json({ error: 'Invalid abuse type' });
  }

  if (typeof age !== 'number' || age < 1 || age > 120) {
    return res.status(400).json({ error: 'Invalid age' });
  }

  if (!country || typeof country !== 'string') {
    return res.status(400).json({ error: 'Country is required' });
  }

  // ---- TOKEN GENERATION only if contact info exists) ----
  let contactRemovalToken = null;

  if (contactInfo) {
    contactRemovalToken = crypto.randomUUID();
  }

  // ---- SAVE RATE LIMIT ----
  rateLimitStore[ip].push(now);


  res.status(201).json({
    message: 'Report submitted successfully',
    contactRemovalToken
  });
});





app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
