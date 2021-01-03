const path = require("path");
const rootPath = path.normalize(__dirname + "/..");

const envPath = process.env.ENVPATH || ".env";
const dotenv = require("dotenv");
// Path to the file where environment variables
dotenv.config({path: envPath });

module.exports = {
  development: {
    db: process.env.DB,
    port: process.env.PORT,
    root: rootPath,
    app: {
      name: "Node Twitter"
    },
    github: {
      // GITHUB_CLIENT_SECRET and GITHUB_CLIENT_ID should be defined in .env file
      // which is stored locally on your computer or those variables values
      // can be passed from Docker container
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      clientID: process.env.GITHUB_CLIENT_ID,
      callbackURL: "http://localhost:3000/auth/github/callback"
    }
  },
  test: {
    //db: process.env.DB,
    // Hack to allow tests run
    db: "mongodb://root:volvo76@ds039078.mongolab.com:39078/ntwitter",
    root: rootPath,
    app: {
      name: "Nodejs Express Mongoose Demo"
    },
    github: {
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      clientID: process.env.GITHUB_CLIENT_ID,
      callbackURL: "http://localhost:3000/auth/github/callback"
    }
  },
  production: {
    db: process.env.DB,
    root: rootPath,
    app: {
      name: "Nodejs Express Mongoose Demo"
    },
    github: {
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      clientID: process.env.GITHUB_CLIENT_ID,
      callbackURL: "http://nitter.herokuapp.com/auth/github/callback"
    }
  }
};
