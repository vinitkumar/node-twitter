const mongoose = require("mongoose");
const GitHubStrategy = require("passport-github").Strategy;
const User = mongoose.model("User");

module.exports = (passport, config) => {
  // require('./initializer')

  // serialize sessions
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findOne({ _id: id }, (err, user) => {
      done(err, user);
    });
  });


  // use github strategy
  passport.use(
    new GitHubStrategy(
      {
        clientID: config.github.clientID,
        clientSecret: config.github.clientSecret,
        callbackURL: config.github.callbackURL
      },
      (accessToken, refreshToken, profile, done) => {
        const options = {
          criteria: { "github.id": parseInt(profile.id) }
        };
        User.load(options, (err, user) => {
          if (!user) {
            user = new User({
              name: profile.displayName,
              // email: profile.emails[0].value,
              username: profile.username,
              provider: "github",
              github: profile._json
            });
            user.save(err => {
              if (err) console.log(err);
              return done(err, user);
            });
          } else {
            User.findOne({ username: profile.username }, function(err, user) {
              user.github = profile._json;
              user.save();
              return done(err, user);
            });
          }
        });
      }
    )
  );
};
