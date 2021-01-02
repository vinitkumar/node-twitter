"use strict";
exports.__esModule = true;
//@ts-check
var utils = require("../../lib/utils");
var mongoose_1 = require("mongoose");
var Activity = mongoose_1["default"].model("Activity");
var logger = require("../middlewares/logger");
exports.load = function (req, res, next, id) {
    var tweet = req.tweet;
    utils.findByParam(tweet.comments, { id: id }, function (err, comment) {
        if (err) {
            return next(err);
        }
        req.comment = comment;
        next();
    });
};
// ### Create Comment
exports.create = function (req, res) {
    var tweet = req.tweet;
    var user = req.user;
    if (!req.body.body) {
        return res.redirect("/");
    }
    tweet.addComment(user, req.body, function (err) {
        if (err) {
            logger.error(err);
            return res.render("pages/500");
        }
        var activity = new Activity({
            activityStream: "added a comment",
            activityKey: tweet.id,
            sender: user,
            receiver: req.tweet.user
        });
        logger.info(activity);
        activity.save(function (err) {
            if (err) {
                logger.error(err);
                return res.render("pages/500");
            }
        });
        res.redirect("/");
    });
};
// ### Delete Comment
exports.destroy = function (req, res) {
    // delete a comment here.
    var comment = req.comment;
    comment.remove(function (err) {
        if (err) {
            res.send(400);
        }
        res.send(200);
    });
};
