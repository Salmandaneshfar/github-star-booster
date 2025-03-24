const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const axios = require('axios');
// const mongoose = require('mongoose');

// Load env vars
dotenv.config();

// Initialize Express
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB - Commented out for testing
// mongoose.connect(process.env.MONGO_URI)
//  .then(() => console.log('MongoDB Connected'))
//  .catch(err => console.log('MongoDB Connection Error:', err));

// EJS setup
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('layout', 'layouts/main');

// Body parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Session setup
app.use(session({
  secret: process.env.SESSION_SECRET || 'testsecret',
  resave: false,
  saveUninitialized: false
}));

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

// Flash messages
app.use(flash());

// Global variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

// Passport config - commenting this out for demo purposes
// require('./config/passport')(passport);

// Routes
app.get('/', (req, res) => {
  res.render('index', {
    title: 'GitHub Star Booster',
    layout: 'layouts/landing'
  });
});

app.get('/auth/login', (req, res) => {
  res.render('login', {
    title: 'Login'
  });
});

// Add GitHub auth routes for demo
app.get('/auth/github', (req, res) => {
  // For demo, redirect to dashboard mock
  req.flash('success_msg', 'This is a demo - GitHub auth would happen here in the real app');
  res.redirect('/dashboard-demo');
});

// Salmandaneshfar's real GitHub profile
app.get('/profile/salmandaneshfar', async (req, res) => {
  try {
    // Fetch the user's repositories from GitHub API
    const userResponse = await axios.get('https://api.github.com/users/salmandaneshfar');
    const reposResponse = await axios.get('https://api.github.com/users/salmandaneshfar/repos');
    
    const userData = userResponse.data;
    const repositories = reposResponse.data.map(repo => ({
      name: repo.name,
      description: repo.description || 'No description available',
      url: repo.html_url,
      stars: repo.stargazers_count
    }));

    // Sort by star count (descending)
    repositories.sort((a, b) => b.stars - a.stars);
    
    // Calculate total stars
    const totalStars = repositories.reduce((total, repo) => total + repo.stars, 0);
    
    const user = {
      username: userData.login,
      displayName: userData.name || userData.login,
      avatar: userData.avatar_url,
      bio: userData.bio,
      followers: userData.followers,
      following: userData.following,
      publicRepos: userData.public_repos,
      repositories
    };
    
    res.render('dashboard-demo', {
      title: `${userData.login}'s Dashboard`,
      user,
      totalStars
    });
  } catch (error) {
    console.error('Error fetching GitHub data:', error.message);
    req.flash('error_msg', 'Error fetching GitHub profile data');
    res.redirect('/');
  }
});

app.get('/dashboard-demo', (req, res) => {
  // Create a mock user for demo
  const mockUser = {
    username: 'demo-user',
    avatar: 'https://avatars.githubusercontent.com/u/12345678',
    repositories: [
      {
        name: 'github-star-booster',
        description: 'An application to help increase stars for GitHub repositories',
        url: 'https://github.com/Salmandaneshfar/github-star-booster',
        stars: 25
      },
      {
        name: 'awesome-project',
        description: 'Another cool project',
        url: '#',
        stars: 18
      }
    ]
  };
  
  res.render('dashboard-demo', {
    title: 'Dashboard Demo',
    user: mockUser,
    totalStars: 43
  });
});

app.get('/about', (req, res) => {
  res.render('about', {
    title: 'About GitHub Star Booster'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
}); 