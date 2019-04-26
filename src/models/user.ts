import mongoose, {Model, Schema} from "mongoose";
const Tweet = mongoose.model("Tweet");
import bcrypt from 'bcrypt';
const authTypes = ['github'];

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
    followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: Schema.Types.ObjectId, ref: "User" }],
    tweets: Number
  },
  { usePushEach: true }
);

type schemaOptions = {
  criteria: Object,
  perPage: bigint,
  page: bigint,
  select: string,
}

UserSchema.virtual("password")
  .set(function(password: string) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashedPassword = this.encryptPassword(password);
  })
  .get(function() {
    return this._password;
  });

const validatePresenceOf = function(value: string) {return value && value.length};

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
  if (
    !validatePresenceOf(this.password) &&
    authTypes.indexOf(this.provider) === -1
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
  addfollow: function(id: string, cb: Function) {
    this.findOne({ _id: id })
      .populate("followers")
      .exec(cb);
  },
  countUserTweets: function(id: string, cb: Function) {
    return Tweet.find({ user: id })
      .count()
      .exec(cb);
  },
  load: function(options: schemaOptions, cb: Function) {
    options.select = options.select || "name username github";
    return this.findOne(options.criteria)
      .select(options.select)
      .exec(cb);
  },
  list: function(options: schemaOptions) {
    const criteria = options.criteria || {};
    return this.find(criteria)
      .populate("user", "name username")
      .limit(options.perPage)
      .skip(options.perPage * options.page);
  },
  countTotalUsers: function() {
    return this.find({}).count();
  }
};

mongoose.model("User", UserSchema);
