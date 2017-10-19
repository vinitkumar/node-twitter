module.exports = (app, passport, auth) => {
  const users = require("../app/controllers/users");
  const apiv1 = require("../app/controllers/apiv1");
  const chat = require('../app/controllers/chat');
  const analytics = require("../app/controllers/analytics");
  const tweets = require("../app/controllers/tweets");
  const comments = require("../app/controllers/comments");
  const favorites = require("../app/controllers/favorites");
  const follows = require("../app/controllers/follows");

  /**
   * Main routes
   */
  app.get("/", auth.requiresLogin, tweets.index);
  app.get("/login", users.login);
  app.get("/signup", users.signup);
  app.get("/logout", users.logout);
  app.post("/users", users.create);
  app.get("/userslist", users.list);

  /**
   * User routes
   */
  app.post(
    "/users/sessions",
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: "Invalid email or password"
    }),
    users.session
  );
  app.get("/users/:userId", users.show);
  app.get("/users/:userId/followers", users.showFollowers);
  app.get("/users/:userId/following", users.showFollowing);
  app.post("/users/:userId/follow", auth.requiresLogin, follows.follow);
  app.param("userId", users.user);

  /**
   * Authentication routes
   */
  app.get(
    "/auth/github",
    passport.authenticate("github", { failureRedirect: "/login" }),
    users.signin
  );
  app.get(
    "/auth/github/callback",
    passport.authenticate("github", { failureRedirect: "/login" }),
    users.authCallback
  );

  /**
   * API routes
   */
  app.get("/apiv1/tweets", apiv1.tweetList);
  app.get("/apiv1/users", apiv1.usersList);

  /**
   * Chat routes
   */
  app.get('/chat', auth.requiresLogin, chat.index);
  app.get('/chat/:id', auth.requiresLogin, chat.show);
  app.get('/chat/get/:userid', auth.requiresLogin, chat.getChat);
  app.post('/chats', auth.requiresLogin, chat.create);
  /**
  * Analytics routes
  */
  app.get("/analytics", analytics.index);

  /**
   * Tweet routes
   */
  app.get("/tweets", tweets.index);
  app.post("/tweets", auth.requiresLogin, tweets.create);
  app.post(
    "/tweets/:id",
    auth.requiresLogin,
    auth.tweet.hasAuthorization,
    tweets.update
  );
  app.del(
    "/tweets/:id",
    auth.requiresLogin,
    auth.tweet.hasAuthorization,
    tweets.destroy
  );
  app.param("id", tweets.tweet);

  /**
   * Comment routes
   */
  app.post("/tweets/:id/comments", auth.requiresLogin, comments.create);
  app.get("/tweets/:id/comments", auth.requiresLogin, comments.create);
  app.del("/tweets/:id/comments", auth.requiresLogin, comments.destroy);

  /**
   * Favorite routes
   */
  app.post("/tweets/:id/favorites", auth.requiresLogin, favorites.create);
  app.del("/tweets/:id/favorites", auth.requiresLogin, favorites.destroy);
};
