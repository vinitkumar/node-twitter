var path = require('path'),
    rootPath = path.normalize(__dirname + '/..');
module.exports = {
  development: {
    db: 'mongodb://root:volvo76@ds039078.mongolab.com:39078/ntwitter',
    root: rootPath,
    app: {
      name: 'Node Twitter'
    },
    facebook: {
      clientID: "255350354640375",
      clientSecret: "0206d7cd66962dd59d90472d810c3464",
      callbackURL: "http://localhost:3000/auth/facebook/callback"
    },
    github: {
      clientID: 'c2e0f478634366e1289d',
      clientSecret: '0bfde82383deeb99b28d0f6a9eac001a0deb798a',
      callbackURL: 'http://localhost:3000/auth/github/callback'
    },
    twitter: {
       clientID: 'J3RJBEzrLd9lVloHf6uGQ',
       clientSecret: 'DwAEaZX84iFg2LYdWHLHQF9l4idAqQWPL2LTCPnEjM',
       callbackURL: "http://ntwitter.nodejitsu.com/auth/twitter/callback"
     },
  },
  test: {
    db: 'mongodb://localhost/noobjs_test21',
    root: rootPath,
    app: {
      name: 'Nodejs Express Mongoose Demo'
    },
    facebook: {
      clientID: "255350354640375",
      clientSecret: "0206d7cd66962dd59d90472d810c3464",
      callbackURL: "http://localhost:3000/auth/facebook/callback"
    },
    github: {
      clientID: 'c2e0f478634366e1289d',
      clientSecret: '0bfde82383deeb99b28d0f6a9eac001a0deb798a',
      callbackURL: 'http://127.0.0.1:3000/auth/github/callback'
    },
    twitter: {
       clientID: 'J3RJBEzrLd9lVloHf6uGQ',
       clientSecret: 'DwAEaZX84iFg2LYdWHLHQF9l4idAqQWPL2LTCPnEjM',
       callbackURL: "http://ntwitter.nodejitsu.com/auth/twitter/callback"
     }
  },
  production: {
    db: 'mongodb://root:volvo76@ds039078.mongolab.com:39078/ntwitter',
    root: rootPath,
    app: {
      name: 'Nodejs Express Mongoose Demo'
    },
    facebook: {
      clientID: "273381409494888",
      clientSecret: "7752245834fc257678f9695c6684c29b",
      callbackURL: "http://ntwitter.nodejitsu.com/auth/facebook/callback"
    },
    github: {
      clientID: 'c2e0f478634366e1289d',
      clientSecret: '0bfde82383deeb99b28d0f6a9eac001a0deb798a',
      callbackURL: 'http://ntwitter.nodejitsu.com/auth/github/callback'
    },
    twitter: {
       clientID: 'J3RJBEzrLd9lVloHf6uGQ',
       clientSecret: 'DwAEaZX84iFg2LYdWHLHQF9l4idAqQWPL2LTCPnEjM',
       callbackURL: "http://ntwitter.nodejitsu.com/auth/twitter/callback"
     },
  }
};
