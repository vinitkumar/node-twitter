var async = require('async')

module.exports = function (app, passport, auth) {
  var users = require('../app/controllers/users')
  app.get('/login', users.login)
  app.get('/register', users.signup)
  app.get('/logout', users.logout)
  app.get('/users', users.create)
  app.post('/users/session', passport.authenticate('local', {failureRedirect: '/login', failureFlash: 'Invalid email or password.'}), users.session)
  app.get('/users/:userId', users.show)
  app.get('/auth/facebook', passport.authenticate('facebook', { scope: [ 'email', 'user_about_me'], failureRedirect: '/login' }), users.signin)
  app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }), users.authCallback)
  app.get('/auth/github', passport.authenticate('github', { failureRedirect: '/login' }), users.signin)
  app.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/login' }), users.authCallback)
  app.get('/', users.index)
  //tweets controller
  var tweets = require('../app/controllers/tweets')
  app.get('/home', tweets.show)
}

