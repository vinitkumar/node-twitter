
var path = require('path'),
    rootPath = path.normalize(__dirname + '/..');
module.exports = {
    development: {
        db: 'mongodb://localhost/ntwitter',
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
            clientID: 'e3930cf94c772ba10ef1',
            clientSecret: 'fb1284b1874444a9c0c55c963092f836596ecc56',
            callbackURL: 'http://localhost:3000/auth/github/callback'
        }
    },
    test: {
        db: 'mongodb://localhost/ntwitter',
        root: rootPath,
        app: {
            name: 'Nodejs Express Mongoose Demo'
        },
        facebook: {
            clientID: "680920985255957",
            clientSecret: "2d5c19f6b02432195afa3ab01b36d405",
            callbackURL: "http://localhost:3000/auth/facebook/callback"
        },
        github: {
            clientID: 'e3930cf94c772ba10ef1',
            clientSecret: 'fb1284b1874444a9c0c55c963092f836596ecc56',
            callbackURL: 'http://localhost:3000/auth/github/callback'
        }
    },
    production: {
        db: 'mongodb://localhost/ntwitter',
        root: rootPath,
        app: {
            name: 'Nodejs Express Mongoose Demo'
        },
        facebook: {
            clientID: "680920985255957",
            clientSecret: "2d5c19f6b02432195afa3ab01b36d405",
            callbackURL: "http://localhost:3000/auth/facebook/callback"
        },
        github: {
            clientID: 'e3930cf94c772ba10ef1',
            clientSecret: 'fb1284b1874444a9c0c55c963092f836596ecc56',
            callbackURL: 'http://localhost:3000/auth/github/callback'
        }
    }
}; 