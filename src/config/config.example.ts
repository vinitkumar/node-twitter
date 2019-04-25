import path from "path";
const rootPath = path.normalize(__dirname + "/..");

module.exports = {
  development: {
    db: "",
    root: rootPath,
    app: {
      name: "Node Twitter"
    },
    github: {
      clientID: "",
      clientSecret: "",
      callbackURL: ""
    }
  },
  test: {
    db: "",
    root: rootPath,
    app: {
      name: "Node Twitter"
    },
    github: {
      clientID: "",
      clientSecret: "",
      callbackURL: ""
    }
  },
  production: {
    db: "",
    root: rootPath,
    app: {
      name: "Node Twitter"
    },
    github: {
      clientID: "",
      clientSecret: "",
      callbackURL: ""
    }
  }
};
