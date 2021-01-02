"use strict";
exports.__esModule = true;
var mongoose_1 = require("mongoose");
var User = mongoose_1["default"].model("User");
var Activity = mongoose_1["default"].model("Activity");
var logger = require("../middlewares/logger");
exports.follow = function (req, res) {
    var user = req.user;
    var id = req.url.split("/")[2];
    // push the current user in the follower list of the target user
    var currentId = user.id;
    User.findOne({ _id: id }, function (err, user) {
        if (user.followers.indexOf(currentId) === -1) {
            user.followers.push(currentId);
        }
        user.save(function (err) {
            if (err) {
                logger.error(err);
            }
        });
    });
    // Over here, we find the id of the user we want to follow
    // and add the user to the following list of the current
    // logged in user
    User.findOne({ _id: currentId }, function (err, user) {
        if (user.following.indexOf(id) === -1) {
            user.following.push(id);
        }
        user.save(function (err) {
            var activity = new Activity({
                activityStream: "followed by",
                activityKey: user,
                sender: currentId,
                receiver: user
            });
            activity.save(function (err) {
                if (err) {
                    logger.error(err);
                    res.render("pages/500");
                }
            });
            if (err) {
                res.status(400);
            }
            res.status(201).send({});
        });
    });
};
