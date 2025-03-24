const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const axios = require('axios');
const User = require('../models/User');
const Repository = require('../models/Repository');

// @route   GET /dashboard
// @desc    Dashboard
// @access  Private
router.get('/', ensureAuthenticated, async (req, res) => {
  try {
    // Fetch user's repositories from GitHub API
    const response = await axios.get('https://api.github.com/user/repos', {
      headers: {
        'Authorization': `token ${req.user.accessToken}`
      }
    });

    // Sort repositories by star count (descending)
    const repositories = response.data.sort((a, b) => b.stargazers_count - a.stargazers_count);

    // Calculate total stars
    const totalStars = repositories.reduce((total, repo) => total + repo.stargazers_count, 0);

    res.render('dashboard/index', {
      title: 'Dashboard',
      user: req.user,
      repositories,
      totalStars
    });
  } catch (error) {
    console.error('Error fetching repositories:', error);
    req.flash('error_msg', 'Error fetching repositories');
    res.redirect('/');
  }
});

// @route   GET /dashboard/repository/:id
// @desc    View repository details
// @access  Private
router.get('/repository/:id', ensureAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch repository details from GitHub API
    const response = await axios.get(`https://api.github.com/repositories/${id}`, {
      headers: {
        'Authorization': `token ${req.user.accessToken}`
      }
    });

    const repository = response.data;

    res.render('dashboard/repository', {
      title: repository.name,
      repository
    });
  } catch (error) {
    console.error('Error fetching repository details:', error);
    req.flash('error_msg', 'Error fetching repository details');
    res.redirect('/dashboard');
  }
});

module.exports = router; 