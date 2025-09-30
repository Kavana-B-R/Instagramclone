const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  caption: { type: String },
  imgURL: { type: String, required: true },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [{
    comment: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  }],
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);
