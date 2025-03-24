const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const axios = require('axios');
const Repository = require('../models/Repository');
const User = require('../models/User');

// @route   GET /starboost
// @desc    Star boost main page
// @access  Private
router.get('/', ensureAuthenticated, async (req, res) => {
  try {
    // Fetch repositories from MongoDB that the user can boost
    const repositories = await Repository.find({
      owner: { $ne: req.user._id },
      isActive: true
    }).populate('owner', 'username avatar');

    res.render('starboost/index', {
      title: 'Star Boost',
      repositories
    });
  } catch (error) {
    console.error('Error fetching repositories for boost:', error);
    req.flash('error_msg', 'Error fetching repositories for boost');
    res.redirect('/dashboard');
  }
});

// @route   POST /starboost/add/:id
// @desc    Add repository to star boost network
// @access  Private
router.post('/add/:id', ensureAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch repository details from GitHub
    const response = await axios.get(`https://api.github.com/repositories/${id}`, {
      headers: {
        'Authorization': `token ${req.user.accessToken}`
      }
    });

    const repoData = response.data;

    // Check if repository already exists
    const existingRepo = await Repository.findOne({ githubId: id });

    if (existingRepo) {
      req.flash('error_msg', 'Repository already in the boost network');
      return res.redirect('/dashboard');
    }

    // Create new repository in the boost network
    const newRepository = new Repository({
      owner: req.user._id,
      githubId: id,
      name: repoData.name,
      fullName: repoData.full_name,
      description: repoData.description,
      url: repoData.html_url,
      stargazersCount: repoData.stargazers_count,
      forksCount: repoData.forks_count,
      watchersCount: repoData.watchers_count,
      language: repoData.language,
      isPublic: !repoData.private
    });

    await newRepository.save();

    req.flash('success_msg', 'Repository added to the star boost network');
    res.redirect('/dashboard');
  } catch (error) {
    console.error('Error adding repository to boost network:', error);
    req.flash('error_msg', 'Error adding repository to boost network');
    res.redirect('/dashboard');
  }
});

// @route   POST /starboost/give-star/:id
// @desc    Give a star to a repository
// @access  Private
router.post('/give-star/:id', ensureAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;

    // Get repository from database
    const repository = await Repository.findById(id).populate('owner');
    
    if (!repository) {
      req.flash('error_msg', 'Repository not found');
      return res.redirect('/starboost');
    }

    // Star the repository on GitHub
    await axios.put(`https://api.github.com/user/starred/${repository.fullName}`, {}, {
      headers: {
        'Authorization': `token ${req.user.accessToken}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Length': 0
      }
    });

    // Update user stats
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { starsGiven: 1 }
    });

    // Update repository owner stats
    await User.findByIdAndUpdate(repository.owner._id, {
      $inc: { starsReceived: 1 }
    });

    req.flash('success_msg', `Successfully starred ${repository.name}`);
    res.redirect('/starboost');
  } catch (error) {
    console.error('Error giving star:', error);
    req.flash('error_msg', 'Error giving star to repository');
    res.redirect('/starboost');
  }
});

module.exports = router; 