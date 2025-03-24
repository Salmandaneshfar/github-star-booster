const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../models/User');

module.exports = function(passport) {
  passport.use(
    new GitHubStrategy({
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL,
      scope: ['user:email', 'read:user', 'public_repo']
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user exists
        let user = await User.findOne({ githubId: profile.id });

        if (user) {
          // Update access token
          user.accessToken = accessToken;
          await user.save();
          return done(null, user);
        }

        // Create new user
        const newUser = new User({
          githubId: profile.id,
          username: profile.username,
          displayName: profile.displayName || profile.username,
          avatar: profile.photos && profile.photos[0] ? profile.photos[0].value : '',
          email: profile.emails && profile.emails[0] ? profile.emails[0].value : '',
          accessToken
        });

        await newUser.save();
        return done(null, newUser);
      } catch (err) {
        console.error(err);
        return done(err, null);
      }
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });
}; 