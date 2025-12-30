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

  passport.deserializeUser(async (id: string, done: any) => {
    try {
      const user = await User.findOne({ _id: id });
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });

  // use local strategy
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password'
      },
      async (email: string, password: string, done: any) => {
        try {
          const user: any = await User.findOne({ email: email });
          if (!user) {
            return done(null, false, { message: 'Unknown user' });
          }
          if (!user.authenticate(password)) {
            return done(null, false, { message: 'Invalid password' });
          }
          return done(null, user);
        } catch (err) {
          return done(err);
        }
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
      async (accessToken: string, refreshToken: string, profile: any, done: any) => {
        try {
          const options = {
            criteria: { 'github.id': parseInt(profile.id) }
          };
          let user: any = await (User as any).load(options);
          if (!user) {
            user = new User({
              name: profile.displayName,
              // email: profile.emails[0].value,
              username: profile.username,
              provider: 'github',
              github: profile._json
            });
            await user.save();
            return done(null, user);
          } else {
            const existingUser: any = await User.findOne({ username: profile.username });
            if (existingUser) {
              existingUser.github = profile._json;
              await existingUser.save();
              return done(null, existingUser);
            }
            return done(null, user);
          }
        } catch (err) {
          console.log(err);
          return done(err, null);
        }
      }
    )
  );
};
