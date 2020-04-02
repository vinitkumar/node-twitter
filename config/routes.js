const express = require("express");
const router = express.Router();
const log = require("./middlewares/logger");

const users = require("../app/controllers/users");
const apiv1 = require("../app/controllers/apiv1");
const chat = require("../app/controllers/chat");
const analytics = require("../app/controllers/analytics");
const tweets = require("../app/controllers/tweets");
const comments = require("../app/controllers/comments");
const favorites = require("../app/controllers/favorites");
const follows = require("../app/controllers/follows");
const activity = require("../app/controllers/activity");

module.exports = (app, passport, auth) => {
  app.use("/", router);
  /**
   * Main unauthenticated routes
   */
  router.get("/login", users.login);
  router.get("/signup", users.signup);
  router.get("/logout", users.logout);

  /**
   * Authentication routes
   */
  router.get(
    "/auth/github",
    passport.authenticate("github", { failureRedirect: "/login" }),
    users.signin
  );
  router.get(
    "/auth/github/callback",
    passport.authenticate("github", { failureRedirect: "/login" }),
    users.authCallback
  );

  /**
   * API routes
   */
  router.get("/apiv1/tweets", apiv1.tweetList);
  router.get("/apiv1/users", apiv1.usersList);

  /**
   * Authentication middleware
   * All routes specified after this middleware require authentication in order
   * to access
   */
  router.use(auth.requiresLogin);
  /**
   * Analytics logging middleware
   * Anytime an authorized user makes a get request, it will be logged into
   * analytics
   */
  router.get("/*", log.analytics);

  /**
   * Acivity routes
   */
  router.get("/activities", activity.index);
  /**
   * Home route
   */
  router.get("/", tweets.index);
  /**
   * User routes
   */
  router.get("/users/:userId", users.show);
  router.get("/users/:userId/followers", users.showFollowers);
  router.get("/users/:userId/following", users.showFollowing);
  router.post("/users", users.create);
  router.post(
    "/users/sessions",
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: "Invalid email or password"
    }),
    users.session
  );
  router.post("/users/:userId/follow", follows.follow);
  router.post("/users/:userId/delete", users.delete);
  router.param("userId", users.user);

  /**
   * Chat routes
   */
  router.get("/chat", chat.index);
  router.get("/chat/:id", chat.show);
  router.get("/chat/get/:userid", chat.getChat);
  router.post("/chats", chat.create);
  /**
   * Analytics routes
   */
  router.get("/analytics", analytics.index);

  /**
   * Tweet routes
   */
  router
    .route("/tweets")
    .get(tweets.index)
    .post(tweets.create);

  router
    .route("/tweets/:id")
    .post(auth.tweet.hasAuthorization, tweets.update)
    .delete(auth.tweet.hasAuthorization, tweets.destroy);

  router.param("id", tweets.tweet);

  /**
   * Comment routes
   */
  router
    .route("/tweets/:id/comments")
    .get(comments.create)
    .post(comments.create)
    .delete(comments.destroy);

  /**
   * Favorite routes
   */
  router
    .route("/tweets/:id/favorites")
    .post(favorites.create)
    .delete(favorites.destroy);

  /**
   * Find tags
   */
  router
    .route("/tweets/hashtag/:tag")
    .get(tweets.findTag);
  
  /**
   * Page not found route (must be at the end of all routes)
   */
  router.use((req, res) => {
    res.status(404).render("pages/404", {
      url: req.originalUrl,
      error: "Not found"
    });
  });
};
