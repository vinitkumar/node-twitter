var async = require('async');

module.exports = function (app, passport, auth) {
  var users = require('../app/controllers/users');
  app.get('/login', users.login);
  app.get('signup', users.signup);
  app.get('/logout', users.logout);
  app.post('/users', users.create);
 app.post('/users/session', passport.authenticate('local', {failureRedirect: '/login', failureFlash: 'Invalid email or password.'}), users.session);
  app.get('/users/:userId', users.show);
  app.get('/auth/facebook/', passport.authenticate('facebook', { scope: ['email', 'user_about_me'], failureRedirect:'/login'}), users.authCallback);
  app.get('/auth/facebook/callback', passport.authenticate('github', {failureRedirect:'/login'}), users.authCallback);
  app.get('/auth/github', passport.authenticate('github', { failureRedirect:'/login'}), users.signin);
  app.get('/auth/github/callback', passport.authenticate('github', {
    failureRedirect:'/login'}),users.authCallback);
  app.get('/auth/twitter', passport.authenticate('twitter', {
    failureRedirect:'/login'}), users.signin);
  app.get('/auth/twitter/callback', passport.authenticate('twitter',{failureRedirect:'/login'}), users.authCallback);
  app.get('/auth/google', passport.authenticate('google', { failureRedirect:'/login', scope:'http://www.google.com/feeds'}), users.signin);
  app.get('/auth/google/callback', passport.authenticate('google', {failureRedirect:'/login', scope: 'http://www.google.com/m8/feeds' }),
  users.authCallback);

  app.param('userId', users.user);


  var tweets = require('../app/controllers/tweets');
  app.get('/tweets', tweets.index);
  app.get('/tweets/new', auth.requiresLogin, tweets.new);
  app.post('/tweets', auth.requiresLogin, tweets.create);
  app.get('/tweets/:id', tweets.show);
  app.get('/tweets/:id/edit', auth.requiresLogin, auth.tweet.hasAuthorization, tweets.update);
  app.put('/tweets/:id', auth.requiresLogin, auth.tweet.hasAuthorization,
    tweets.destroy);

  app.param('id', tweets.article);

  app.get('/', tweets.index);

};
