"use strict";
exports.__esModule = true;
var createPagination = require("./analytics").createPagination;
var mongoose_1 = require("mongoose");
var Activity = mongoose_1["default"].model("Activity");
var Chat = mongoose_1["default"].model("Chat");
var User = mongoose_1["default"].model("User");
var logger = require("../middlewares/logger");
exports.chat = function (req, res, next, id) {
    Chat.load(id, function (err, chat) {
        if (err) {
            return next(err);
        }
        if (!chat) {
            return next(new Error("Failed to load tweet" + id));
        }
        req.chat = chat;
        next();
    });
};
exports.index = function (req, res) {
    // so basically this is going to be a list of all chats the user had till date.
    var page = (req.query.page > 0 ? req.query.page : 1) - 1;
    var perPage = 10;
    var options = {
        perPage: perPage,
        page: page,
        criteria: { github: { $exists: true } }
    };
    var users, count, pagination;
    User.list(options)
        .then(function (result) {
        users = result;
        return User.countDocuments();
    })
        .then(function (result) {
        count = result;
        pagination = createPagination(req, Math.ceil(result / perPage), page + 1);
        res.render("chat/index", {
            title: "Chat User List",
            users: users,
            page: page + 1,
            pagination: pagination,
            pages: Math.ceil(count / perPage)
        });
    })["catch"](function (error) {
        return res.render("pages/500", { errors: error.errors });
    });
};
exports.show = function (req, res) {
    res.send(req.chat);
};
exports.getChat = function (req, res) {
    var options = {
        criteria: { receiver: req.params.userid }
    };
    var chats;
    Chat.list(options).then(function (result) {
        chats = result;
        res.render("chat/chat", { chats: chats });
    });
};
exports.create = function (req, res) {
    var chat = new Chat({
        message: req.body.body,
        receiver: req.body.receiver,
        sender: req.user.id
    });
    logger.info("chat instance", chat);
    chat.save(function (err) {
        var activity = new Activity({
            activityStream: "sent a message to",
            activityKey: chat.id,
            receiver: req.body.receiver,
            sender: req.user.id
        });
        activity.save(function (err) {
            if (err) {
                logger.error(err);
                res.render("pages/500");
            }
        });
        logger.error(err);
        if (!err) {
            res.redirect(req.header("Referrer"));
        }
    });
};
