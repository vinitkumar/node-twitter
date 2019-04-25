"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const logger_1 = __importDefault(require("./middlewares/logger"));
const users_1 = __importDefault(require("../controllers/users"));
const apiv1_1 = __importDefault(require("../controllers/apiv1"));
const chat_1 = __importDefault(require("../controllers/chat"));
const analytics_1 = __importDefault(require("../controllers/analytics"));
const tweets_1 = __importDefault(require("../controllers/tweets"));
const comments_1 = __importDefault(require("../controllers/comments"));
const favorites_1 = __importDefault(require("../controllers/favorites"));
const follows_1 = __importDefault(require("../controllers/follows"));
const activity_1 = __importDefault(require("../controllers/activity"));
module.exports = (app, passport, auth) => {
    app.use("/", router);
    /**
     * Main unauthenticated routes
     */
    router.get("/login", users_1.default.login);
    router.get("/signup", users_1.default.signup);
    router.get("/logout", users_1.default.logout);
    /**
     * Authentication routes
     */
    router.get("/auth/github", passport.authenticate("github", { failureRedirect: "/login" }), users_1.default.signin);
    router.get("/auth/github/callback", passport.authenticate("github", { failureRedirect: "/login" }), users_1.default.authCallback);
    /**
     * API routes
     */
    router.get("/apiv1/tweets", apiv1_1.default.tweetList);
    router.get("/apiv1/users", apiv1_1.default.usersList);
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
    router.get("/*", logger_1.default.analytics);
    /**
     * Acivity routes
     */
    router.get("/activities", activity_1.default.index);
    /**
     * Home route
     */
    router.get("/", tweets_1.default.index);
    /**
     * User routes
     */
    router.get("/users/:userId", users_1.default.show);
    router.get("/users/:userId/followers", users_1.default.showFollowers);
    router.get("/users/:userId/following", users_1.default.showFollowing);
    router.post("/users", users_1.default.create);
    router.post("/users/sessions", passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: "Invalid email or password"
    }), users_1.default.session);
    router.post("/users/:userId/follow", follows_1.default.follow);
    router.post("/users/:userId/delete", users_1.default.delete);
    router.param("userId", users_1.default.user);
    /**
     * Chat routes
     */
    router.get("/chat", chat_1.default.index);
    router.get("/chat/:id", chat_1.default.show);
    router.get("/chat/get/:userid", chat_1.default.getChat);
    router.post("/chats", chat_1.default.create);
    /**
     * Analytics routes
     */
    router.get("/analytics", analytics_1.default.index);
    /**
     * Tweet routes
     */
    router
        .route("/tweets")
        .get(tweets_1.default.index)
        .post(tweets_1.default.create);
    router
        .route("/tweets/:id")
        .post(auth.tweet.hasAuthorization, tweets_1.default.update)
        .delete(auth.tweet.hasAuthorization, tweets_1.default.destroy);
    router.param("id", tweets_1.default.tweet);
    /**
     * Comment routes
     */
    router
        .route("/tweets/:id/comments")
        .get(comments_1.default.create)
        .post(comments_1.default.create)
        .delete(comments_1.default.destroy);
    /**
     * Favorite routes
     */
    router
        .route("/tweets/:id/favorites")
        .post(favorites_1.default.create)
        .delete(favorites_1.default.destroy);
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
//# sourceMappingURL=routes.js.map