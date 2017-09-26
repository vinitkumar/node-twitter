let async = require("async");

module.exports = (app, passport, auth) => {
  const users = require("../app/controllers/users");
  app.get("/login", users.login);
  app.get("/signup", users.signup);
  app.get("/logout", users.logout);
  app.post("/users", users.create);
  app.get("/userslist", users.list);
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
   * API related code
   */
  const apiv1 = require("../app/controllers/apiv1");
  app.get("/apiv1/tweets", apiv1.tweetList);
  app.get("/apiv1/users", apiv1.usersList);

  /**
  * Analytics related code
  */
  const analytics = require("../app/controllers/analytics");
  app.get("/analytics", analytics.index);

  app.param("userId", users.user);

  //tweets routes
  const tweets = require("../app/controllers/tweets");
  app.route("/tweets")
    .get(tweets.index)
    .post(auth.requiresLogin, tweets.create);
  app.route("/tweets/:id")
    .get(tweets.show)
    .post(
      auth.requiresLogin,
      auth.tweet.hasAuthorization,
      tweets.update)
    .del(
      auth.requiresLogin,
      auth.tweet.hasAuthorization,
      tweets.destroy);
  app.param("id", tweets.tweet);

  //home route
  app.get("/", auth.requiresLogin, tweets.index);

  //comment routes
  const comments = require("../app/controllers/comments");
  app.route("/tweets/:id/comments")
    .post(auth.requiresLogin, comments.create)
    .get(auth.requiresLogin, comments.create)
    .del(auth.requiresLogin, comments.destroy);
  
  /**
   * Favorite routes
   */
  const favorites = require("../app/controllers/favorites");
  
  app.route("/tweets/:id/favorites")
    .post(auth.requiresLogin, favorites.create)
    .del(auth.requiresLogin, favorites.destroy);
  
  /**
    * Follow
    */
  const follows = require("../app/controllers/follows");

  app.post("/users/:userId/follow", auth.requiresLogin, follows.follow);
};
