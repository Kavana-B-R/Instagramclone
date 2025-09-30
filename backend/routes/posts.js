const express = require('express');
const multer = require('multer');
const path = require('path');
const Post = require('../models/Post');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Multer config for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// Create post
router.post('/create', protect, upload.single('img'), async (req, res) => {
  const { caption } = req.body;
  const imgURL = req.file ? `http://localhost:5000/uploads/${req.file.filename}` : '';
  try {
    const post = new Post({ createdBy: req.user._id, caption, imgURL });
    await post.save();
    await post.populate('createdBy', 'username profilePic');
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get feed posts
router.get('/feed', protect, async (req, res) => {
  try {
    const posts = await Post.find({ createdBy: { $in: req.user.following } })
      .populate('createdBy', 'username profilePic')
      .populate('comments.createdBy', 'username profilePic')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user posts
router.get('/user/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) return res.status(404).json({ message: 'User not found' });
    const posts = await Post.find({ createdBy: user._id })
      .populate('createdBy', 'username profilePic')
      .populate('comments.createdBy', 'username profilePic')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

// Like/Unlike post
router.post('/:id/like', protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const isLiked = post.likes.includes(req.user._id);
    if (isLiked) {
      post.likes = post.likes.filter(id => id.toString() !== req.user._id.toString());
    } else {
      post.likes.push(req.user._id);
    }
    await post.save();
    res.json({ likes: post.likes.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add comment
router.post('/:id/comment', protect, async (req, res) => {
  const { comment } = req.body;
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const newComment = { comment, createdBy: req.user._id };
    post.comments.push(newComment);
    await post.save();
    await post.populate('comments.createdBy', 'username profilePic');
    res.json(post.comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete post
router.delete('/:id', protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post || post.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: 'Post deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all posts
router.get('/all', async (req, res) => {
  try {
    const posts = await Post.find({})
      .populate('createdBy', 'username profilePicURL')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
