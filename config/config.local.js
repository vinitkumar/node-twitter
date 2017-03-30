const path = require('path'),
    rootPath = path.normalize(__dirname + '/..');
module.exports = {
  development: {
    db: 'mongodb://localhost/ntw2',
    root: rootPath,
    app: {
      name: 'Node Twitter'
    },
    facebook: {
      clientID: "476135909128021",
      clientSecret: "0f6a6403b1c9cb678164400032369a16",
      callbackURL: "http://localhost:3000/auth/facebook/callback"
    },
    github: {
      clientID: 'c2e0f478634366e1289d',
      clientSecret: '0bfde82383deeb99b28d0f6a9eac001a0deb798a',
      callbackURL: 'http://localhost:3000/auth/github/callback'
    }
  },
  test: {
    db: 'mongodb://localhost/noobjs_test21',
    root: rootPath,
    app: {
      name: 'Nodejs Express Mongoose Demo'
    },
    facebook: {
      clientID: "476135909128021",
      clientSecret: "0f6a6403b1c9cb678164400032369a16",
      callbackURL: "http://localhost:3000/auth/facebook/callback"
    },
    github: {
      clientID: 'c2e0f478634366e1289d',
      clientSecret: '0bfde82383deeb99b28d0f6a9eac001a0deb798a',
      callbackURL: 'http://localhost:3000/auth/github/callback'
    }
  },
  production: {
    db: 'mongodb://localhost/noobjs_prodd',
    root: rootPath,
    app: {
      name: 'Nodejs Express Mongoose Demo'
    },
    facebook: {
      clientID: "476135909128021",
      clientSecret: "0f6a6403b1c9cb678164400032369a16",
      callbackURL: "http://localhost:3000/auth/facebook/callback"
    },
    github: {
      clientID: 'c2e0f478634366e1289d',
      clientSecret: '0bfde82383deeb99b28d0f6a9eac001a0deb798a',
      callbackURL: 'http://localhost:3000/auth/github/callback'
    }
  }
};
