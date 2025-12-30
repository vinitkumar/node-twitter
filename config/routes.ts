import { Express, Router } from 'express';
import { PassportStatic } from 'passport';
import * as log from './middlewares/logger';
import * as users from '../app/controllers/users';
import * as apiv1 from '../app/controllers/apiv1';
import * as chat from '../app/controllers/chat';
import * as analytics from '../app/controllers/analytics';
import * as tweets from '../app/controllers/tweets';
import * as comments from '../app/controllers/comments';
import * as favorites from '../app/controllers/favorites';
import * as follows from '../app/controllers/follows';
import * as activity from '../app/controllers/activity';
import * as auth from './middlewares/authorization';

export default (
  app: Express,
  passport: PassportStatic,
  authorization: typeof auth
): void => {
  const router = Router();
  app.use('/', router);

  /**
   * Main unauthenticated routes
   */
  router.get('/login', users.login);
  router.get('/signup', users.signup);
  router.get('/logout', users.logout);

  /**
   * Authentication routes
   */
  router.get(
    '/auth/github',
    passport.authenticate('github', { failureRedirect: '/login' }),
    users.signin
  );
  router.get(
    '/auth/github/callback',
    passport.authenticate('github', { failureRedirect: '/login' }),
    users.authCallback
  );

  /**
   * API routes
   */
  router.get('/apiv1/tweets', apiv1.tweetList);
  router.get('/apiv1/users', apiv1.usersList);

  /**
   * Authentication middleware
   * All routes specified after this middleware require authentication in order
   * to access
   */
  router.use(authorization.requiresLogin);

  /**
   * Analytics logging middleware
   * Anytime an authorized user makes a get request, it will be logged into
   * analytics
   */
  router.get('/*path', log.analytics);

  /**
   * Activity routes
   */
  router.get('/activities', activity.index);

  /**
   * Home route
   */
  router.get('/', tweets.index);

  /**
   * User routes
   */
  router.get('/users/:userId', users.show);
  router.get('/users/:userId/followers', users.showFollowers);
  router.get('/users/:userId/following', users.showFollowing);
  router.post('/users', users.create);
  router.post(
    '/users/sessions',
    passport.authenticate('local', {
      failureRedirect: '/login',
      failureFlash: 'Invalid email or password'
    }),
    users.session
  );
  router.post('/users/:userId/follow', follows.follow);
  router.post('/users/:userId/delete', users.deleteUser);
  router.param('userId', users.user);

  /**
   * Chat routes
   */
  router.get('/chat', chat.index);
  router.get('/chat/:id', chat.show);
  router.get('/chat/get/:userid', chat.getChat);
  router.post('/chats', chat.create);

  /**
   * Analytics routes
   */
  router.get('/analytics', analytics.index);

  /**
   * Tweet routes
   */
  router
    .route('/tweets')
    .get(tweets.index)
    .post(tweets.create);

  router
    .route('/tweets/:id')
    .post(authorization.tweet.hasAuthorization, tweets.update)
    .delete(authorization.tweet.hasAuthorization, tweets.destroy);

  router.param('id', tweets.tweet);

  /**
   * Comment routes
   */
  router
    .route('/tweets/:id/comments')
    .get(comments.create)
    .post(comments.create)
    .delete(comments.destroy);

  /**
   * Favorite routes
   */
  router
    .route('/tweets/:id/favorites')
    .post(favorites.create)
    .delete(favorites.destroy);

  /**
   * Find tags
   */
  router.route('/tweets/hashtag/:tag').get(tweets.findTag);

  /**
   * Page not found route (must be at the end of all routes)
   */
  router.use((req, res) => {
    res.status(404).render('pages/404', {
      url: req.originalUrl,
      error: 'Not found'
    });
  });
};
