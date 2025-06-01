// backend/server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// Mock database
let profile = {
  weight: '',
  activityLevel: 'Sedentary',
  climate: 'Temperate',
  dailyGoal: null,
};

let settings = {
  language: 'English',
};

// Get profile
app.get('/profile', (req, res) => {
  res.json(profile);
});

// Update profile
app.post('/profile', (req, res) => {
  const { weight, activityLevel, climate, dailyGoal } = req.body;
  profile = { weight, activityLevel, climate, dailyGoal };
  res.json({ success: true, profile });
});

// Get language settings
app.get('/settings', (req, res) => {
  res.json(settings);
});

// Update language setting
app.post('/settings', (req, res) => {
  const { language } = req.body;
  settings.language = language;
  res.json({ success: true, language });
});

app.listen(PORT, () => {
  console.log(`Backend server running at http://localhost:${PORT}`);
});
