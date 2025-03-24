const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  githubId: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  displayName: {
    type: String
  },
  email: {
    type: String
  },
  avatar: {
    type: String
  },
  accessToken: {
    type: String
  },
  starsGiven: {
    type: Number,
    default: 0
  },
  starsReceived: {
    type: Number,
    default: 0
  },
  repositories: [
    {
      repoId: String,
      name: String,
      description: String,
      url: String,
      stars: Number
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', UserSchema); 