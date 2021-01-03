"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// ## Tweet Controller
const mongoose_1 = __importDefault(require("mongoose"));
const Tweet = mongoose_1.default.model("Tweet");
const User = mongoose_1.default.model("User");
exports.tweetList = (req, res) => {
    const page = (req.query.page > 0 ? req.query.page : 1) - 1;
    const perPage = 15;
    const options = {
        perPage: perPage,
        page: page
    };
    let tweets, count;
    Tweet.limitedList(options)
        .then(function (result) {
        tweets = result;
        return Tweet.countDocuments();
    })
        .then(function (result) {
        count = result;
        return res.send(tweets);
    })
        .catch(function (error) {
        return res.render("pages/500", { errors: error.errors });
    });
};
exports.usersList = (req, res) => {
    const page = (req.query.page > 0 ? req.query.page : 1) - 1;
    const perPage = 15;
    const options = {
        perPage: perPage,
        page: page
    };
    let users, count;
    User.list(options)
        .then(function (result) {
        users = result;
        return User.countDocuments();
    })
        .then(function (result) {
        count = result;
        return res.send(users);
    })
        .catch(function (error) {
        return res.render("pages/500", { errors: error.errors });
    });
};
//# sourceMappingURL=apiv1.js.map