"use strict";
exports.__esModule = true;
// ## Tweet Controller
var mongoose_1 = require("mongoose");
var Tweet = mongoose_1["default"].model("Tweet");
var User = mongoose_1["default"].model("User");
exports.tweetList = function (req, res) {
    var page = (req.query.page > 0 ? req.query.page : 1) - 1;
    var perPage = 15;
    var options = {
        perPage: perPage,
        page: page
    };
    var tweets, count;
    Tweet.limitedList(options)
        .then(function (result) {
        tweets = result;
        return Tweet.countDocuments();
    })
        .then(function (result) {
        count = result;
        return res.send(tweets);
    })["catch"](function (error) {
        return res.render("pages/500", { errors: error.errors });
    });
};
exports.usersList = function (req, res) {
    var page = (req.query.page > 0 ? req.query.page : 1) - 1;
    var perPage = 15;
    var options = {
        perPage: perPage,
        page: page
    };
    var users, count;
    User.list(options)
        .then(function (result) {
        users = result;
        return User.countDocuments();
    })
        .then(function (result) {
        count = result;
        return res.send(users);
    })["catch"](function (error) {
        return res.render("pages/500", { errors: error.errors });
    });
};
