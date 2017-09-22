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
    "/auth/facebook",
    passport.authenticate("facebook", {
      scope: ["email", "user_about_me"],
      failureRedirect: "/login"
    }),
    users.signin
  );
  app.get(
    "/auth/facebook/callback",
    passport.authenticate("facebook", { failureRedirect: "/login" }),
    users.authCallback
  );
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
  app.get(
    "/auth/twitter",
    passport.authenticate("twitter", { failureRedirect: "/login" }),
    users.signin
  );
  app.get(
    "/auth/twitter/callback",
    passport.authenticate("twitter", {
      successRedirect: "/",
      failureRedirect: "/login"
    })
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
  app.get("/tweets", tweets.index);
  app.post("/tweets", auth.requiresLogin, tweets.create);
  app.get("/tweets/:id", tweets.show);
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

  //home route
  app.get("/", auth.requiresLogin, tweets.index);

  //comment routes
  const comments = require("../app/controllers/comments");
  app.post("/tweets/:id/comments", auth.requiresLogin, comments.create);
  app.get("/tweets/:id/comments", auth.requiresLogin, comments.create);
  app.del("/tweets/:id/comments", auth.requiresLogin, comments.destroy);

  /**
   * Favorite routes
   */
  const favorites = require("../app/controllers/favorites");

  app.post("/tweets/:id/favorites", auth.requiresLogin, favorites.create);
  app.del("/tweets/:id/favorites", auth.requiresLogin, favorites.destroy);

  /**
    * Follow
    */
  const follows = require("../app/controllers/follows");

  app.post("/users/:userId/follow", auth.requiresLogin, follows.follow);
};
