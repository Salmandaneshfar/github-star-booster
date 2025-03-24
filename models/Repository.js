const mongoose = require('mongoose');

const RepositorySchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  githubId: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  fullName: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  url: {
    type: String,
    required: true
  },
  stargazersCount: {
    type: Number,
    default: 0
  },
  forksCount: {
    type: Number,
    default: 0
  },
  watchersCount: {
    type: Number,
    default: 0
  },
  language: {
    type: String
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Repository', RepositorySchema); 