"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const User = mongoose_1.default.model("User");
const utils = require("../../lib/utils");
//  Getters and Setters
const setTags = function (tags) { return tags.map(function (t) { return t.toLowerCase(); }); };
// Tweet Schema
const TweetSchema = new Schema({
    body: { type: String, default: "", trim: true, maxlength: 280 },
    user: { type: mongoose_1.default.Types.ObjectId, ref: "User" },
    comments: [
        {
            body: { type: String, default: "", maxlength: 280 },
            user: { type: mongoose_1.default.Types.ObjectId, ref: "User" },
            commenterName: { type: String, default: "" },
            commenterPicture: { type: String, default: "" },
            createdAt: { type: Date, default: Date.now }
        }
    ],
    tags: { type: [String], set: setTags },
    favorites: [{ type: mongoose_1.default.Types.ObjectId, ref: "User" }],
    favoriters: [{ type: mongoose_1.default.Types.ObjectId, ref: "User" }],
    favoritesCount: Number,
    createdAt: { type: Date, default: Date.now }
}, { usePushEach: true });
// Pre save hook
TweetSchema.pre("save", function (next) {
    const tweet = this;
    if (tweet.favorites) {
        tweet.favoritesCount = tweet.favorites.length;
    }
    if (tweet.favorites) {
        tweet.favoriters = tweet.favorites;
    }
    next();
});
// Validations in the schema
TweetSchema.path("body").validate(function (body) { return body.length > 0; }, "Tweet body cannot be blank");
TweetSchema.virtual("_favorites").set(function (user) {
    if (this.favorites.indexOf(user._id) === -1) {
        this.favorites.push(user._id);
    }
    else {
        this.favorites.splice(this.favorites.indexOf(user._id), 1);
    }
});
TweetSchema.methods = {
    uploadAndSave: function (images, callback) {
        // const imager = new Imager(imagerConfig, "S3");
        return this.save(callback);
    },
    addComment: function (user, comment, cb) {
        if (user.name) {
            this.comments.push({
                body: comment.body,
                user: user._id,
                commenterName: user.name,
                commenterPicture: user.github.avatar_url
            });
            this.save(cb);
        }
        else {
            this.comments.push({
                body: comment.body,
                user: user._id,
                commenterName: user.username,
                commenterPicture: user.github.avatar_url
            });
            this.save(cb);
        }
    },
    removeComment: function (commentId, cb) {
        let index = utils.indexof(this.comments, { id: commentId });
        if (~index) {
            this.comments.splice(index, 1);
        }
        else {
            return cb("not found");
        }
        this.save(cb);
    }
};
// ## Static Methods in the TweetSchema
TweetSchema.statics = {
    // Load tweets
    load: function (id, callback) {
        this.findOne({ _id: id })
            .populate("user", "name username provider github")
            .populate("comments.user")
            .exec(callback);
    },
    // List tweets
    list: function (options) {
        const criteria = options.criteria || {};
        return this.find(criteria)
            .populate("user", "name username provider github")
            .sort({ createdAt: -1 })
            .limit(options.perPage)
            .skip(options.perPage * options.page);
    },
    // List tweets
    limitedList: function (options) {
        const criteria = options.criteria || {};
        return this.find(criteria)
            .populate("user", "name username")
            .sort({ createdAt: -1 })
            .limit(options.perPage)
            .skip(options.perPage * options.page);
    },
    // Tweets of User
    userTweets: function (id, callback) {
        this.find({ user: mongoose_1.default.Types.ObjectId(id) })
            .toArray()
            .exec(callback);
    },
    // Count the number of tweets for a specific user
    countUserTweets: function (id, callback) {
        return this.find({ user: id })
            .countDocuments()
            .exec(callback);
    },
    // Count the app tweets by criteria
    countTweets: function (criteria) {
        return this.find(criteria).countDocuments();
    }
};
mongoose_1.default.model("Tweet", TweetSchema);
//# sourceMappingURL=tweets.js.map