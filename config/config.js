const path = require("path");
const rootPath = path.normalize(__dirname + "/..");
const DB = process.env.DB;

// Path to the file where environment variables
const dotenv = require("dotenv");
dotenv.config({path: ".env" });

module.exports = {
  development: {
    db: "mongodb://localhost/ntwitter",
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
    db: "mongodb://root:volvo76@ds039078.mongolab.com:39078/ntwitter",
    root: rootPath,
    app: {
      name: "Nodejs Express Mongoose Demo"
    },
    github: {
      clientSecret: "process.env.GITHUB_CLIENT_SECRET",
      clientID: "process.env.GITHUB_CLIENT_ID",
      // clientID: "c2e0f478634366e1289d",
      // clientSecret: "0bfde82383deeb99b28d0f6a9eac001a0deb798a",
      callbackURL: "http://localhost:3000/auth/github/callback"
    }
  },
  production: {
    db: DB,
    root: rootPath,
    app: {
      name: "Nodejs Express Mongoose Demo"
    },
    github: {
      clientID: "process.env.GITHUB_CLIENT_SECRET",
      clientSecret: "process.env.GITHUB_CLIENT_ID",
      // clientID: clientID,
      // clientSecret: clientSecret,
      callbackURL: "http://nitter.herokuapp.com/auth/github/callback"
    }
  }
};
