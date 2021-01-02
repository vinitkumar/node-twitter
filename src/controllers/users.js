"use strict";
exports.__esModule = true;
var Tweet = Mongoose.model("Tweet");
var User = Mongoose.model("User");
var Analytics = Mongoose.model("Analytics");
var logger = require("../middlewares/logger");
exports.signin = function (req, res) { };
exports.authCallback = function (req, res) {
    res.redirect("/");
};
exports.login = function (req, res) {
    var tweetCount, userCount, analyticsCount;
    var options = {};
    Analytics.list(options)
        .then(function () {
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
exports.signup = function (req, res) {
    res.render("pages/login", {
        title: "Sign up",
        user: new User()
    });
};
exports.logout = function (req, res) {
    req.logout();
    res.redirect("/login");
};
exports.session = function (req, res) {
    res.redirect("/");
};
exports.create = function (req, res, next) {
    var user = new User(req.body);
    user.provider = "local";
    user
        .save()["catch"](function (error) {
        return res.render("pages/login", { errors: error.errors, user: user });
    })
        .then(function () {
        return req.login(user);
    })
        .then(function () {
        return res.redirect("/");
    })["catch"](function (error) {
        return next(error);
    });
};
exports.list = function (req, res) {
    var page = (req.query.page > 0 ? req.query.page : 1) - 1;
    var perPage = 5;
    var options = {
        perPage: perPage,
        page: page,
        criteria: { github: { $exists: true } }
    };
    var users, count;
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
    })["catch"](function (error) {
        return res.render("pages/500", { errors: error.errors });
    });
};
exports.show = function (req, res) {
    var user = req.profile;
    var reqUserId = user._id;
    var userId = reqUserId.toString();
    var page = (req.query.page > 0 ? req.query.page : 1) - 1;
    var options = {
        perPage: 100,
        page: page,
        criteria: { user: userId }
    };
    var tweets, tweetCount;
    var followingCount = user.following.length;
    var followerCount = user.followers.length;
    Tweet.list(options)
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
    })["catch"](function (error) {
        return res.render("pages/500", { errors: error.errors });
    });
};
exports.user = function (req, res, next, id) {
    User.findOne({ _id: id }).exec(function (err, user) {
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
exports.showFollowers = function (req, res) {
    showFollowers(req, res, "followers");
};
exports.showFollowing = function (req, res) {
    showFollowers(req, res, "following");
};
exports["delete"] = function (req, res) {
    Tweet.remove({ user: req.user._id })
        .then(function () {
        User.findByIdAndRemove(req.user._id)
            .then(function () {
            return res.redirect("/login");
        })["catch"](function () {
            res.render("pages/500");
        });
    })["catch"](function () {
        res.render("pages/500");
    });
};
function showFollowers(req, res, type) {
    var user = req.profile;
    var followers = user[type];
    var tweetCount;
    var followingCount = user.following.length;
    var followerCount = user.followers.length;
    var userFollowers = User.find({ _id: { $in: followers } }).populate("user", "_id name username github");
    Tweet.countUserTweets(user._id).then(function (result) {
        tweetCount = result;
        userFollowers.exec(function (err, users) {
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
