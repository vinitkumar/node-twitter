"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const logger_1 = __importDefault(require("./middlewares/logger"));
const users = __importStar(require("../controllers/users"));
const apiv1 = __importStar(require("../controllers/apiv1"));
const chat = __importStar(require("../controllers/chat"));
const analytics = __importStar(require("../controllers/analytics"));
const tweets = __importStar(require("../controllers/tweets"));
const comments = __importStar(require("../controllers/comments"));
const favorites = __importStar(require("../controllers/favorites"));
const follows = __importStar(require("../controllers/follows"));
const activity = __importStar(require("../controllers/activity"));
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
    router.get("/auth/github", passport.authenticate("github", { failureRedirect: "/login" }), users.signin);
    router.get("/auth/github/callback", passport.authenticate("github", { failureRedirect: "/login" }), users.authCallback);
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
    router.get("/*", logger_1.default.analytics);
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
    router.post("/users/sessions", passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: "Invalid email or password"
    }), users.session);
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