const express = require('express');
const passport = require('passport');
const router = express.Router();
const { ensureGuest } = require('../config/auth');

// @route   GET /auth/login
// @desc    Login page
// @access  Public
router.get('/login', ensureGuest, (req, res) => {
  res.render('login', {
    title: 'Login'
  });
});

// @route   GET /auth/github
// @desc    Auth with GitHub
// @access  Public
router.get('/github', passport.authenticate('github'));

// @route   GET /auth/github/callback
// @desc    GitHub auth callback
// @access  Public
router.get(
  '/github/callback',
  passport.authenticate('github', { failureRedirect: '/auth/login' }),
  (req, res) => {
    req.flash('success_msg', 'Successfully logged in with GitHub');
    res.redirect('/dashboard');
  }
);

// @route   GET /auth/logout
// @desc    Logout user
// @access  Private
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error('Error during logout:', err);
      return next(err);
    }
    req.flash('success_msg', 'You are logged out');
    res.redirect('/auth/login');
  });
});

module.exports = router; 