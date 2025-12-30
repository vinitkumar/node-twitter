import * as path from 'path';
import * as dotenv from 'dotenv';

const rootPath = path.normalize(__dirname + '/..');

const envPath = process.env.ENVPATH || '.env';
// Path to the file where environment variables
dotenv.config({ path: envPath });

interface GithubConfig {
  clientSecret: string | undefined;
  clientID: string | undefined;
  callbackURL: string;
}

interface AppConfig {
  name: string;
}

interface EnvConfig {
  db: string | undefined;
  port?: string | undefined;
  root: string;
  app: AppConfig;
  github: GithubConfig;
}

interface AllConfigs {
  development: EnvConfig;
  test: EnvConfig;
  production: EnvConfig;
}

const config: AllConfigs = {
  development: {
    db: process.env.DB,
    port: process.env.PORT,
    root: rootPath,
    app: {
      name: 'Node Twitter'
    },
    github: {
      // GITHUB_CLIENT_SECRET and GITHUB_CLIENT_ID should be defined in .env file
      // which is stored locally on your computer or those variables values
      // can be passed from Docker container
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      clientID: process.env.GITHUB_CLIENT_ID,
      callbackURL: 'http://localhost:3000/auth/github/callback'
    }
  },
  test: {
    //db: process.env.DB,
    // Hack to allow tests run
    db: 'mongodb://root:volvo76@ds039078.mongolab.com:39078/ntwitter',
    root: rootPath,
    app: {
      name: 'Nodejs Express Mongoose Demo'
    },
    github: {
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      clientID: process.env.GITHUB_CLIENT_ID,
      callbackURL: 'http://localhost:3000/auth/github/callback'
    }
  },
  production: {
    db: process.env.DB,
    root: rootPath,
    app: {
      name: 'Nodejs Express Mongoose Demo'
    },
    github: {
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      clientID: process.env.GITHUB_CLIENT_ID,
      callbackURL: 'http://nitter.herokuapp.com/auth/github/callback'
    }
  }
};

export default config;
