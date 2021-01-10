"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Tweet = mongoose_1.default.model("Tweet");
const User = mongoose_1.default.model("User");
const Analytics = mongoose_1.default.model("Analytics");
const logger = require("../middlewares/logger");
exports.signin = (req, res) => { };
exports.authCallback = (req, res) => {
    res.redirect("/");
};
exports.login = (req, res) => {
    let tweetCount, userCount, analyticsCount;
    let options = {};
    Analytics.statics.list(options)
        .then(() => {
        return Analytics.countDocuments();
    })
        .then(function (result) {
        analyticsCount = result;
        return Tweet.countTweets();
    })
        .then(function (result) {
        tweetCount = result;
        return User.countTotalUsers();
    })
        .then(function (result) {
        userCount = result;
        logger.info(tweetCount);
        logger.info(userCount);
        logger.info(tweetCount);
        res.render("pages/login", {
            title: "Login",
            message: req.flash("error"),
            userCount: userCount,
            tweetCount: tweetCount,
            analyticsCount: analyticsCount
        });
    });
};
exports.signup = (req, res) => {
    res.render("pages/login", {
        title: "Sign up",
        user: new User()
    });
};
exports.logout = (req, res) => {
    req.logout();
    res.redirect("/login");
};
exports.session = (req, res) => {
    res.redirect("/");
};
exports.create = (req, res, next) => {
    const user = new User(req.body);
    user.provider = "local";
    user
        .save()
        .catch(function (error) {
        return res.render("pages/login", { errors: error.errors, user: user });
    })
        .then(() => {
        return req.login(user);
    })
        .then(() => {
        return res.redirect("/");
    })
        .catch(function (error) {
        return next(error);
    });
};
exports.list = (req, res) => {
    const page = (req.query.page > 0 ? req.query.page : 1) - 1;
    const perPage = 5;
    const options = {
        perPage: perPage,
        page: page,
        criteria: { github: { $exists: true } }
    };
    let users, count;
    User.list(options)
        .then(function (result) {
        users = result;
        return User.countDocuments();
    })
        .then(function (result) {
        count = result;
        res.render("pages/user-list", {
            title: "List of Users",
            users: users,
            page: page + 1,
            pages: Math.ceil(count / perPage)
        });
    })
        .catch(function (error) {
        return res.render("pages/500", { errors: error.errors });
    });
};
exports.show = (req, res) => {
    const user = req.profile;
    const reqUserId = user._id;
    const userId = reqUserId.toString();
    const page = (req.query.page > 0 ? req.query.page : 1) - 1;
    const options = {
        perPage: 100,
        page: page,
        criteria: { user: userId }
    };
    let tweets, tweetCount;
    let followingCount = user.following.length;
    let followerCount = user.followers.length;
    Tweet.statics.list(options)
        .then(function (result) {
        tweets = result;
        return Tweet.countUserTweets(reqUserId);
    })
        .then(function (result) {
        tweetCount = result;
        res.render("pages/profile", {
            title: "Tweets from " + user.name,
            user: user,
            tweets: tweets,
            tweetCount: tweetCount,
            followerCount: followerCount,
            followingCount: followingCount
        });
    })
        .catch(function (error) {
        return res.render("pages/500", { errors: error.errors });
    });
};
exports.user = (req, res, next, id) => {
    User.findOne({ _id: id }).exec((err, user) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return next(new Error("failed to load user " + id));
        }
        req.profile = user;
        next();
    });
};
exports.showFollowers = (req, res) => {
    showFollowers(req, res, "followers");
};
exports.showFollowing = (req, res) => {
    showFollowers(req, res, "following");
};
exports.delete = (req, res) => {
    const user = req.user;
    Tweet.remove({ user: user._id })
        .then(() => {
        User.findByIdAndRemove(user._id)
            .then(() => {
            return res.redirect("/login");
        })
            .catch(() => {
            res.render("pages/500");
        });
    })
        .catch(() => {
        res.render("pages/500");
    });
};
function showFollowers(req, res, type) {
    let user = req.profile;
    let followers = user[type];
    let followingCount = user.following.length;
    let followerCount = user.followers.length;
    let userFollowers = User.find({ _id: { $in: followers } }).populate("user", "_id name username github");
    Tweet.countUserTweets(user._id).then(function (result) {
        let tweetCount = result;
        userFollowers.exec((err, users) => {
            if (err) {
                return res.render("pages/500");
            }
            res.render("pages/followers", {
                user: user,
                followers: users,
                tweetCount: tweetCount,
                followerCount: followerCount,
                followingCount: followingCount
            });
        });
    });
}
//# sourceMappingURL=users.js.map