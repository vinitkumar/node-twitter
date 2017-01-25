var path = require('path');
var rootPath = path.normalize(__dirname + '/..');

module.exports = {
  development: {
    db: 'mongodb://localhost:27017/test',
    root: rootPath,
    app: {
      name: 'Node Twitter'
    },
    github: {
      clientID: '48f4a99ce717f5531ff2',
      clientSecret: '26b13bec1117b421a5ca1b81b0fea8f77e59146e',
      callbackURL: 'http://localhost:3000/auth/github/callback'
    }
  },
  test: {
    db: 'mongodb://localhost:27017/test',
    root: rootPath,
    app: {
      name: 'Nodejs Express Mongoose Demo'
    },
    github: {
      clientID: '48f4a99ce717f5531ff2',
      clientSecret: '26b13bec1117b421a5ca1b81b0fea8f77e59146e',
      callbackURL: 'http://tatwitter.herokuapp.com/auth/github/callback'
    }
  },
  production: {
    db: 'mongodb://localhost:27017/test',
    root: rootPath,
    app: {
      name: 'Nodejs Express Mongoose Demo'
    },
    github: {
      clientID: '48f4a99ce717f5531ff2',
      clientSecret: '26b13bec1117b421a5ca1b81b0fea8f77e59146e',
      callbackURL: 'http://tatwitter.herokuapp.com/auth/github/callback'
    }
  }
};
