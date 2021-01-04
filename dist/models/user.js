"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const bcrypt_nodejs_1 = __importDefault(require("bcrypt-nodejs"));
const Tweet = mongoose_1.default.model("Tweet");
const Schema = mongoose_1.default.Schema;
const authTypes = ['github'];
// ## Define UserSchema
const UserSchema = new Schema({
    name: String,
    email: String,
    username: String,
    provider: String,
    hashedPassword: String,
    salt: String,
    github: {},
    followers: [{ type: mongoose_1.default.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose_1.default.Types.ObjectId, ref: "User" }],
    tweets: Number
}, { usePushEach: true });
UserSchema.virtual("password")
    .set(function (password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashedPassword = this.encryptPassword(password);
})
    .get(function () {
    return this._password;
});
const validatePresenceOf = function (value) { return value && value.length; };
UserSchema.path("name").validate(function (name) {
    if (authTypes.indexOf(this.provider) !== -1) {
        return true;
    }
    return name.length;
}, "Name cannot be blank");
UserSchema.path("email").validate(function (email) {
    if (authTypes.indexOf(this.provider) !== -1) {
        return true;
    }
    return email.length;
}, "Email cannot be blank");
UserSchema.path("username").validate(function (username) {
    if (authTypes.indexOf(this.provider) !== -1) {
        return true;
    }
    return username.length;
}, "username cannot be blank");
UserSchema.path("hashedPassword").validate(function (hashedPassword) {
    if (authTypes.indexOf(this.provider) !== -1) {
        return true;
    }
    return hashedPassword.length;
}, "Password cannot be blank");
UserSchema.pre("save", function (next) {
    const user = this;
    if (!validatePresenceOf(user.hashedPassword) &&
        authTypes.indexOf(user.provider) === -1) {
        next(new Error("Invalid password"));
    }
    else {
        next();
    }
});
UserSchema.methods = {
    authenticate: function (plainText) {
        return this.encryptPassword(plainText) === this.hashedPassword;
    },
    makeSalt: function () {
        return Math.round(new Date().valueOf() * Math.random());
    },
    encryptPassword: function (password) {
        if (!password) {
            return "";
        }
        let salt = this.makeSalt();
        return bcrypt_nodejs_1.default.hashSync(password, salt);
    },
};
UserSchema.statics = {
    addfollow: function (id, cb) {
        this.findOne({ _id: id })
            .populate("followers")
            .exec(cb);
    },
    countUserTweets: function (id, cb) {
        return Tweet.find({ user: id })
            .countDocuments()
            .exec(cb);
    },
    load: function (options, cb) {
        options.select = options.select || "name username github";
        return this.findOne(options.criteria)
            .select(options.select)
            .exec(cb);
    },
    list: function (options) {
        const criteria = options.criteria || {};
        return this.find(criteria)
            .populate("user", "name username")
            .limit(options.perPage)
            .skip(options.perPage * options.page);
    },
    countTotalUsers: function () {
        return this.find({}).countDocuments();
    }
};
mongoose_1.default.model("User", UserSchema);
//# sourceMappingURL=user.js.map