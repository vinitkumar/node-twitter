import mongoose from "mongoose";
const GitHubStrategy = require("passport-github").Strategy;
const User = mongoose.model("User");

module.exports = (passport: any, config: any) => {
  // require('./initializer')

  // serialize sessions
  passport.serializeUser((user: any, done: any) => {
    done(null, user.id);
  });

  passport.deserializeUser((id: any, done: any) => {
    User.findOne({ _id: id }, (err: mongoose.Error, user) => {
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
      (accessToken: any, refreshToken: any, profile: any, done: any) => {
        const options = {
          criteria: { "github.id": parseInt(profile.id) }
        };
        User.load(options, (err: mongoose.Error, user: typeof User) => {
          if (!user) {
            user = new User({
              name: profile.displayName,
              // email: profile.emails[0].value,
              username: profile.username,
              provider: "github",
              github: profile._json
            });
            user.save(function (err: mongoose.Error) {
              if (err) console.log(err);
              return done(err, user);
            });
          } else {
            User.findOne({ username: profile.username }, function(err: mongoose.Error, user) {
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
