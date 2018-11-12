var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var CustomStrategy = require('passport-custom').Strategy;
var office365Auth = require('office365-nodejs-authentication');
var mongoose = require('mongoose');
var User = mongoose.model('User');

passport.use(new CustomStrategy({
    usernameField: 'email'
  },
  function(username, password, done) {
    office365Auth(username, password, "RS Edge", (err, info)=>{
      if (err) { return done(err); }
      if(info.messageId){
        User.findOne({ email: username }).populate('department').exec(function (err, user) {
          if (err) { return done(err); }
          // Return if user not found in database
          if (!user) {
            createStaff(username);
          }
          // If credentials are correct, return the user object
          return done(null, user);
        });
      }
    });
  }
));

let createStaff = (email)=>{
  let user = new User;
  user.email = email;
  user.type = 'staff'

  user.save(function(err) {
    if(err) return next(err);
    return done(null, user);
  });
}

passport.use(new LocalStrategy({
    usernameField: 'email'
  },
  function(username, password, done) {
    User.findOne({ email: username }).populate('department').exec(function (err, user) {
      if (err) { return done(err); }
      // Return if user not found in database
      if (!user) {
        return done(null, false, {
          message: 'User not found'
        });
      }
      // Return if password is wrong
      if (!user.validPassword(password)) {
        return done(null, false, {
          message: 'Password is wrong'
        });
      }
      // If credentials are correct, return the user object
      return done(null, user);
    });
  }
));