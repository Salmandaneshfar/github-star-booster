const express = require('express');
const router = express.Router();
const { ensureGuest } = require('../config/auth');

// @route   GET /
// @desc    Home page
// @access  Public
router.get('/', ensureGuest, (req, res) => {
  res.render('index', {
    title: 'GitHub Star Booster',
    layout: 'layouts/landing'
  });
});

// @route   GET /about
// @desc    About page
// @access  Public
router.get('/about', (req, res) => {
  res.render('about', {
    title: 'About GitHub Star Booster'
  });
});

module.exports = router; 