import express, { Express } from 'express';
import cookieParser from 'cookie-parser';
import cookieSession from 'cookie-session';
import * as fs from 'fs';
import passport from 'passport';
import mongoose from 'mongoose';
import promiseRetry from 'promise-retry';
import config from './config/config';
import * as auth from './config/middlewares/authorization';
import passportConfig from './config/passport';
import expressConfig from './config/express';
import routesConfig from './config/routes';

const env = process.env.NODE_ENV || 'development';
const cfg = config[env as keyof typeof config];
const app: Express = express();
const port = process.env.PORT || 3000;
const cookieParserKey = process.env.COOKIE_KEY || 'super55';
const sessionKey1 = process.env.SESSIONKEYONE || 'key1';
const sessionKey2 = process.env.SESSIONKEYTWO || 'key2';

app.use(cookieParser(cookieParserKey));
app.use(
  cookieSession({
    name: 'session',
    keys: [sessionKey1, sessionKey2]
  })
);

// Fix for passport compatibility with cookie-session
// cookie-session doesn't have regenerate/save methods that passport expects
app.use((req: any, res, next) => {
  if (req.session && !req.session.regenerate) {
    req.session.regenerate = (cb: (err?: Error) => void) => {
      cb();
    };
  }
  if (req.session && !req.session.save) {
    req.session.save = (cb: (err?: Error) => void) => {
      cb();
    };
  }
  next();
});

interface PromiseRetryOptions {
  retries: number;
  factor: number;
  minTimeout: number;
  maxTimeout: number;
}

const promiseRetryOptions: PromiseRetryOptions = {
  retries: 10,
  factor: 2,
  minTimeout: 1000,
  maxTimeout: 5000
};

const connect = async (): Promise<typeof mongoose> => {
  return promiseRetry((retry: any, number: any) => {
    console.log(
      `MongoClient connecting to ${cfg.db} - retry number: ${number}`
    );
    return mongoose
      .connect(cfg.db as string)
      .catch(retry);
  }, promiseRetryOptions);
};

const modelsPath = __dirname + '/app/models';
fs.readdirSync(modelsPath).forEach((file) => {
  // Only load .js or .ts files, skip .map and other files
  if (file.endsWith('.js') || file.endsWith('.ts')) {
    // Skip .d.ts declaration files
    if (!file.endsWith('.d.ts')) {
      require(modelsPath + '/' + file);
    }
  }
});

passportConfig(passport, cfg);
expressConfig(app, cfg, passport);
routesConfig(app, passport, auth);

app.listen(port);
console.log('Express app started on port ' + port);

connect();

export default app;
