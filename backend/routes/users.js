const express = require('express');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Get user profile by username
router.get('/profile/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user profile by id
router.get('/profile/id/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update user profile
router.put('/update', protect, async (req, res) => {
  const { username, bio, profilePic } = req.body;
  try {
    const user = await User.findByIdAndUpdate(req.user._id, { username, bio, profilePic }, { new: true }).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Follow/Unfollow user
router.post('/follow/:id', protect, async (req, res) => {
  try {
    const userToFollow = await User.findById(req.params.id);
    if (!userToFollow) return res.status(404).json({ message: 'User not found' });

    const isFollowing = req.user.following.includes(req.params.id);
    if (isFollowing) {
      req.user.following = req.user.following.filter(id => id.toString() !== req.params.id);
      userToFollow.followers = userToFollow.followers.filter(id => id.toString() !== req.user._id.toString());
    } else {
      req.user.following.push(req.params.id);
      userToFollow.followers.push(req.user._id);
    }
    await req.user.save();
    await userToFollow.save();
    res.json({ message: isFollowing ? 'Unfollowed' : 'Followed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get suggested users
router.get('/suggested', protect, async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user._id, $nin: req.user.following } }).limit(5).select('username profilePicURL followers fullName');
    const usersWithUid = users.map(user => ({ ...user.toObject(), uid: user._id }));
    res.json(usersWithUid);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Search users
router.get('/search', async (req, res) => {
  const { q } = req.query;
  try {
    const users = await User.find({ username: { $regex: q, $options: 'i' } }).select('username profilePicURL');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all users
router.get('/all', async (req, res) => {
  try {
    const users = await User.find({}).select('username profilePicURL');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
