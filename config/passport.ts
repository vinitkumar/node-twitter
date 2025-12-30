import { PassportStatic } from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GitHubStrategy } from 'passport-github';
import mongoose from 'mongoose';

interface GithubConfig {
  clientSecret: string | undefined;
  clientID: string | undefined;
  callbackURL: string;
}

interface Config {
  github: GithubConfig;
}

export default (passport: PassportStatic, config: Config): void => {
  const User = mongoose.model('User');

  // serialize sessions
  passport.serializeUser((user: any, done: any) => {
    done(null, user.id);
  });

  passport.deserializeUser((id: string, done: any) => {
    User.findOne({ _id: id }, (err: any, user: any) => {
      done(err, user);
    });
  });

  // use local strategy
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password'
      },
      (email: string, password: string, done: any) => {
        User.findOne({ email: email }, (err: any, user: any) => {
          if (err) {
            return done(err);
          }
          if (!user) {
            return done(null, false, { message: 'Unknown user' });
          }
          if (!user.authenticate(password)) {
            return done(null, false, { message: 'Invalid password' });
          }
          return done(null, user);
        });
      }
    )
  );

  // use github strategy
  passport.use(
    new GitHubStrategy(
      {
        clientID: config.github.clientID || '',
        clientSecret: config.github.clientSecret || '',
        callbackURL: config.github.callbackURL
      },
      (accessToken: string, refreshToken: string, profile: any, done: any) => {
        const options = {
          criteria: { 'github.id': parseInt(profile.id) }
        };
        (User as any).load(options, (err: any, user: any) => {
          if (!user) {
            user = new User({
              name: profile.displayName,
              // email: profile.emails[0].value,
              username: profile.username,
              provider: 'github',
              github: profile._json
            });
            user.save((err: any) => {
              if (err) console.log(err);
              return done(err, user);
            });
          } else {
            User.findOne(
              { username: profile.username },
              (err: any, user: any) => {
                user.github = profile._json;
                user.save();
                return done(err, user);
              }
            );
          }
        });
      }
    )
  );
};
