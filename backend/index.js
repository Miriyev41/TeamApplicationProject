// backend/index.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3000; // Or your preferred port

// Middleware
app.use(cors());
app.use(bodyParser.json());

// In-memory store for profile
let userProfile = null;

// POST /api/profile – Save profile
app.post('/api/profile', (req, res) => {
  const { weight, activityLevel, climate, dailyGoal } = req.body;

  if (!weight || !activityLevel || !climate || !dailyGoal) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  userProfile = { weight, activityLevel, climate, dailyGoal };
  res.status(200).json({ message: 'Profile saved successfully' });
});

// GET /api/profile – Retrieve profile
app.get('/api/profile', (req, res) => {
  if (!userProfile) {
    return res.status(404).json({ error: 'Profile not found' });
  }
  res.status(200).json(userProfile);
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
