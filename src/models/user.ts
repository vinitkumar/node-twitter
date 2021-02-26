import mongoose from "mongoose";
import bcrypt from "bcrypt-nodejs";
const Tweet = mongoose.model("Tweet");
const Schema = mongoose.Schema;
const authTypes = ['github'];

export type UserDocument = mongoose.Document & {
  _id: string,
  name: string,
  email: string,
  username: string,
  provider: string,
  hashedPassword: string,
  salt: string,
  github: {},
  followers: [{ }],
  following: [{ }],
  tweets: number
};


// ## Define UserSchema
const UserSchema = new Schema(
  {
    name: String,
    email: String,
    username: String,
    provider: String,
    hashedPassword: String,
    salt: String,
    github: {},
    followers: [{ type: mongoose.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Types.ObjectId, ref: "User" }],
    tweets: Number
  },
  { usePushEach: true }
);

UserSchema.virtual("password")
  .set(function(password: string) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashedPassword = this.encryptPassword(password);
  })
  .get(function() {
    return this._password;
  });

const validatePresenceOf = function (value: string) { return value && value.length};

UserSchema.path("name").validate(function(name: string) {
  if (authTypes.indexOf(this.provider) !== -1) {
    return true;
  }
  return name.length;
}, "Name cannot be blank");

UserSchema.path("email").validate(function(email: string) {
  if (authTypes.indexOf(this.provider) !== -1) {
    return true;
  }
  return email.length;
}, "Email cannot be blank");

UserSchema.path("username").validate(function(username: string) {
  if (authTypes.indexOf(this.provider) !== -1) {
    return true;
  }
  return username.length;
}, "username cannot be blank");

UserSchema.path("hashedPassword").validate(function(hashedPassword: string) {
  if (authTypes.indexOf(this.provider) !== -1) {
    return true;
  }
  return hashedPassword.length;
}, "Password cannot be blank");

UserSchema.pre("save", function(next) {
  const user = this as UserDocument;
  if (
    !validatePresenceOf(user.hashedPassword) &&
    authTypes.indexOf(user.provider) === -1
  ) {
    next(new Error("Invalid password"));
  } else {
    next();
  }
});

UserSchema.methods = {
  authenticate: function(plainText: string) {
    return this.encryptPassword(plainText) === this.hashedPassword;
  },

  makeSalt: function() {
    return Math.round(new Date().valueOf() * Math.random());
  },

  encryptPassword: function(password: string) {
    if (!password) {
      return "";
    }
    let salt = this.makeSalt();
    return bcrypt.hashSync(password, salt)
  },
};

UserSchema.statics = {
  //  we neeed to remove this method
  addfollow: function(id: string, cb: any) {
    this.findOne({ _id: id })
      .populate("followers")
      .exec(cb);
  },
  countUserTweets: function(id: string, cb: any) {
    return Tweet.find({ user: id })
      .countDocuments()
      .exec(cb);
  },
  load: function(options: any, cb: any) {
    options.select = options.select || "name username github";
    return this.findOne(options.criteria)
      .select(options.select)
      .exec(cb);
  },
  list: function(options: any) {
    const criteria = options.criteria || {};
    return this.find(criteria)
      .populate("user", "name username")
      .limit(options.perPage)
      .skip(options.perPage * options.page);
  },
  countTotalUsers: function() {
    return this.find({}).countDocuments();
  }
};

mongoose.model("User", UserSchema);
