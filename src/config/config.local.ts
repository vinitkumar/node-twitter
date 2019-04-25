const path = require("path"),
  rootPath = path.normalize(__dirname + "/..");

module.exports = {
  development: {
    db: "mongodb://localhost/ntw2",
    root: rootPath,
    app: {
      name: "Node Twitter"
    },
    github: {
      clientID: "c2e0f478634366e1289d",
      clientSecret: "0bfde82383deeb99b28d0f6a9eac001a0deb798a",
      callbackURL: "http://localhost:3000/auth/github/callback"
    }
  },
  test: {
    db: "mongodb://localhost/noobjs_test21",
    root: rootPath,
    app: {
      name: "Nodejs Express Mongoose Demo"
    },
    github: {
      clientID: "c2e0f478634366e1289d",
      clientSecret: "0bfde82383deeb99b28d0f6a9eac001a0deb798a",
      callbackURL: "http://localhost:3000/auth/github/callback"
    }
  },
  production: {
    db: "mongodb://localhost/noobjs_prodd",
    root: rootPath,
    app: {
      name: "Nodejs Express Mongoose Demo"
    },
    github: {
      clientID: "c2e0f478634366e1289d",
      clientSecret: "0bfde82383deeb99b28d0f6a9eac001a0deb798a",
      callbackURL: "http://localhost:3000/auth/github/callback"
    }
  }
};
