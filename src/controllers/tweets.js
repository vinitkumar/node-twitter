"use strict";
exports.__esModule = true;
// ## Tweet Controller
var createPagination = require("./analytics").createPagination;
var mongoose_1 = require("mongoose");
var Tweet = mongoose_1["default"].model("Tweet");
var User = mongoose_1["default"].model("User");
var Analytics = mongoose_1["default"].model("Analytics");
var _ = require("underscore");
var logger = require("../middlewares/logger");
exports.tweet = function (req, res, next, id) {
    Tweet.load(id, function (err, tweet) {
        if (err) {
            return next(err);
        }
        if (!tweet) {
            return next(new Error("Failed to load tweet" + id));
        }
        req.tweet = tweet;
        next();
    });
};
// ### Create a Tweet
exports.create = function (req, res) {
    var tweet = new Tweet(req.body);
    tweet.user = req.user;
    tweet.tags = parseHashtag(req.body.body);
    tweet.uploadAndSave({}, function (err) {
        if (err) {
            res.render("pages/500", { error: err });
        }
        else {
            res.redirect("/");
        }
    });
};
// ### Update a tweet
exports.update = function (req, res) {
    var tweet = req.tweet;
    tweet = _.extend(tweet, { body: req.body.tweet });
    tweet.uploadAndSave({}, function (err) {
        if (err) {
            return res.render("pages/500", { error: err });
        }
        res.redirect("/");
    });
};
// ### Delete a tweet
exports.destroy = function (req, res) {
    var tweet = req.tweet;
    tweet.remove(function (err) {
        if (err) {
            return res.render("pages/500");
        }
        res.redirect("/");
    });
};
// ### Parse a hashtag
function parseHashtag(inputText) {
    var regex = /(?:^|\s)(?:#)([a-zA-Z\d]+)/g;
    var matches = [];
    var match;
    while ((match = regex.exec(inputText)) !== null) {
        matches.push(match[1]);
    }
    return matches;
}
exports.parseHashtag = parseHashtag;
var showTweets = function (req, res, criteria) {
    var findCriteria = criteria || {};
    var page = (req.query.page > 0 ? req.query.page : 1) - 1;
    var perPage = 10;
    var options = {
        perPage: perPage,
        page: page,
        criteria: findCriteria
    };
    var followingCount = req.user.following.length;
    var followerCount = req.user.followers.length;
    var tweets, tweetCount, pageViews, analytics, pagination;
    User.countUserTweets(req.user._id).then(function (result) {
        tweetCount = result;
    });
    Tweet.list(options)
        .then(function (result) {
        tweets = result;
        return Tweet.countTweets(findCriteria);
    })
        .then(function (result) {
        pageViews = result;
        pagination = createPagination(req, Math.ceil(pageViews / perPage), page + 1);
        return Analytics.list({ perPage: 15 });
    })
        .then(function (result) {
        analytics = result;
        res.render("pages/index", {
            title: "List of Tweets",
            tweets: tweets,
            analytics: analytics,
            page: page + 1,
            tweetCount: tweetCount,
            pagination: pagination,
            followerCount: followerCount,
            followingCount: followingCount,
            pages: Math.ceil(pageViews / perPage)
        });
    })["catch"](function (error) {
        logger.error(error);
        res.render("pages/500");
    });
};
// ### Find a tag
exports.findTag = function (req, res) {
    var tag = req.params.tag;
    showTweets(req, res, { tags: tag.toLowerCase() });
};
exports.index = function (req, res) {
    showTweets(req, res);
};
