import { Express, Request, Response, NextFunction } from 'express';
import session from 'express-session';
import compression from 'compression';
import errorHandler from 'errorhandler';
import MongoStore from 'connect-mongo';
import flash from 'connect-flash';
import helpers from 'view-helpers';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import cookieParser from 'cookie-parser';
import Raven from 'raven';
import moment from 'moment';
import morgan from 'morgan';
import { PassportStatic } from 'passport';

interface AppConfig {
  name: string;
}

interface EnvConfig {
  db: string | undefined;
  root: string;
  app: AppConfig;
}

// Disable Raven console alerts
Raven.disableConsoleAlerts();

export default (
  app: Express,
  config: EnvConfig,
  passport: PassportStatic
): void => {
  app.set('showStackError', true);
  app.locals.moment = moment;

  // use morgan for logging
  app.use(
    morgan('dev', {
      skip: (req: Request, res: Response) => {
        return res.statusCode < 400;
      },
      stream: process.stderr
    })
  );

  // use morgan for logging
  app.use(
    morgan('dev', {
      skip: (req: Request, res: Response) => {
        return res.statusCode >= 400;
      },
      stream: process.stdout
    })
  );

  // setup Sentry to get any crashes
  if (process.env.SENTRY_DSN !== null) {
    Raven.config(process.env.SENTRY_DSN).install();
    app.use(Raven.requestHandler());
    app.use(Raven.errorHandler());
  }

  app.use(
    compression({
      filter: (req: Request, res: Response) => {
        return /json|text|javascript|css/.test(
          res.getHeader('Content-Type') as string
        );
      },
      level: 9
    })
  );

  // app.use(favicon());
  app.use(express.static(config.root + '/public'));

  if (process.env.NODE_ENV === 'development') {
    app.use(errorHandler());
    app.locals.pretty = true;
  }

  app.set('views', config.root + '/app/views');
  app.set('view engine', 'pug');

  app.use(helpers(config.app.name));
  app.use(cookieParser());
  app.use(
    bodyParser.urlencoded({
      extended: true
    })
  );
  app.use(bodyParser.json());
  app.use(methodOverride('_method'));
  app.use(
    session({
      secret: process.env.SECRET || 'your-secret-key',
      resave: false,
      saveUninitialized: false,
      store: new MongoStore({
        mongoUrl: config.db,
        collection: 'sessions'
      })
    })
  );

  app.use(flash());
  app.use(passport.initialize());
  app.use(passport.session());
  app.disable('view cache');

  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    if (err.message.indexOf('not found') !== -1) {
      return next();
    }
    console.log(err.stack);
    res.status(500).render('pages/500', { error: err.stack });
  });
};
