const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/user_profiles', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Define Mongoose schema
const profileSchema = new mongoose.Schema({
  userId: String,
  username: String,
  bio: String,
  avatarUrl: String,
  updatedAt: Date,
});

const Profile = mongoose.model('Profile', profileSchema);

// Fetch profile
app.get('/profile/:userId', async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.params.userId });
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Update profile
app.post('/profile', async (req, res) => {
  const { userId, username, bio, avatarUrl } = req.body;
  try {
    const updatedProfile = await Profile.findOneAndUpdate(
      { userId },
      { username, bio, avatarUrl, updatedAt: new Date() },
      { upsert: true, new: true }
    );
    res.json(updatedProfile);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Start server
app.listen(5000, () => console.log('Server running on http://localhost:5000'));
