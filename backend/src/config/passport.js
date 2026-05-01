const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID || 'mock_client_id',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'mock_client_secret',
    callbackURL: '/api/v1/auth/google/callback'
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if user exists
      let user = await User.findOne({ 'auth.googleId': profile.id });
      
      if (user) {
        return done(null, user);
      }
      
      // Check if email exists
      user = await User.findOne({ 'auth.email': profile.emails[0].value });
      if (user) {
        // Link google account to existing email
        user.auth.googleId = profile.id;
        await user.save();
        return done(null, user);
      }

      // Create new user
      user = await User.create({
        auth: {
          email: profile.emails[0].value,
          googleId: profile.id
        },
        profile: {
          name: profile.displayName,
          avatar: profile.photos[0].value
        },
        role: 'user'
      });

      done(null, user);
    } catch (error) {
      done(error, null);
    }
  }
));
