var async = require('async');




module.exports = function (app, passport, auth) {
  var users = require('../app/controllers/users');
  app.get('/login', users.login);
  app.get('/signup',users.signup);
  app.get('/logout', users.logout);
  app.post('/users', users.create);
  app.post('/users/sessions', passport.authenticate('local', {failureRedirect: '/login', failureFlash: 'Invalid email or password'}), users.session );
  app.get('/users/:userId', users.show);
  app.get('/auth/facebook', passport.authenticate('facebook',{scope: ['email', 'user_about_me'], failureRedirect: '/login' }), users.signin);
  app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }), users.authCallback);
  app.get('/auth/github', passport.authenticate('github', { failureRedirect: '/login' }), users.signin);
  app.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/login' }), users.authCallback);
  app.get('/auth/twitter', passport.authenticate('twitter', { failureRedirect: '/login' }), users.signin);
  app.get('/auth/twitter/callback', passport.authenticate('twitter', { successRedirect: '/', failureRedirect: '/login' }));


  app.param('userId', users.user);

  //tweets routes
  var tweets = require('../app/controllers/tweets');
  app.get('/tweets', tweets.index);
  app.get('/tweets/new', auth.requiresLogin, tweets.new);
  app.post('/tweets', auth.requiresLogin, tweets.create);
  app.get('/tweets/:id', tweets.show);
  app.get('/tweets/:id/edit', auth.requiresLogin, auth.tweet.hasAuthorization, tweets.edit);
  app.put('/tweets/:id', auth.requiresLogin, auth.tweet.hasAuthorization, tweets.update);
  app.del('/tweets/:id', auth.requiresLogin, auth.tweet.hasAuthorization, tweets.destroy);
  app.param('id', tweets.tweet);
  //home route
  app.get('/', auth.requiresLogin, tweets.index );

  //comment routes
  var comments = require('../app/controllers/comments');
  app.post('/tweets/:id/comments', auth.requiresLogin, comments.create);
  app.get('/tweets/:id/comments', auth.requiresLogin, comments.create);
  app.del('/tweets/:id/comments', auth.requiresLogin, comments.destroy);

  /**
   * Favorite routes
   */
   var favorites = require('../app/controllers/favorites');

   app.post('/tweets/:id/favorites', auth.requiresLogin, favorites.create);
   app.del('/tweets/:id/favorites', auth.requiresLogin, favorites.destroy);

   /**
    * Follow
    */
   var follows = require('../app/controllers/follows');

   app.post('/users/:userId/follow', auth.requiresLogin, follows.follow);
};
