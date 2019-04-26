import mongoose, {Document, Model, Schema} from "mongoose";
import utils from "../lib/utils";
import { HttpException } from "../config/HttpException";

//  Getters and Setters
const getTags = function (tags: Array<string>) { return tags.join(",")};

const setTags = function (tags: string) { return tags.split(","); }

type schemaOptions = {
  criteria: Object,
  perPage: bigint,
  page: bigint,
  select: string,
}

interface iGithub extends Document {
  avatar_url: string,
}

interface iUser extends Document {
  username: string,
  _id: string,
  name: string,
  github: iGithub
}

interface iComment extends Document {
  body: string,
}

// Tweet Schema
const TweetSchema = new Schema(
  {
    body: { type: String, default: "", trim: true, maxlength: 280 },
    user: { type: Schema.Types.ObjectId, ref: "User" },
    comments: [
      {
        body: { type: String, default: "", maxlength: 280 },
        user: { type: Schema.Types.ObjectId, ref: "User" },
        commenterName: { type: String, default: "" },
        commenterPicture: { type: String, default: "" },
        createdAt: { type: Date, default: Date.now }
      }
    ],
    tags: { type: [], get: getTags, set: setTags },
    favorites: [{ type: Schema.Types.ObjectId, ref: "User" }],
    favoriters: [{ type: Schema.Types.ObjectId, ref: "User" }], // same as favorites
    favoritesCount: Number,
    createdAt: { type: Date, default: Date.now }
  },
  { usePushEach: true }
);

// Pre save hook
TweetSchema.pre("save", function(next) {
  if (this.favorites) {
    this.favoritesCount = this.favorites.length;
  }
  if (this.favorites) {
    this.favoriters = this.favorites;
  }
  next();
});

// Validations in the schema
TweetSchema.path("body").validate(
 function (body: string) { return body.length > 0},
  "Tweet body cannot be blank"
);

TweetSchema.virtual("_favorites").set(function(user: iUser) {
  if (this.favorites.indexOf(user._id) === -1) {
    this.favorites.push(user._id);
  } else {
    this.favorites.splice(this.favorites.indexOf(user._id), 1);
  }
});

TweetSchema.methods = {
  uploadAndSave: function(images: Array<string>, callback: Function) {
    // const imager = new Imager(imagerConfig, "S3");
    this.save();
  },
  addComment: function(user: iUser, comment: iComment, cb: Function) {
    if (user.name) {
      this.comments.push({
        body: comment.body,
        user: user._id,
        commenterName: user.name,
        commenterPicture: user.github.avatar_url
      });
      this.save(cb);
    } else {
      this.comments.push({
        body: comment.body,
        user: user._id,
        commenterName: user.username,
        commenterPicture: user.github.avatar_url
      });

      this.save(cb);
    }
  },

  removeComment: function(commentId: string, cb: Function) {
    let index = utils.indexof(this.comments, { id: commentId });
    if (~index) {
      this.comments.splice(index, 1);
    } else {
      return cb("not found");
    }
    this.save(cb);
  }
};

// ## Static Methods in the TweetSchema
TweetSchema.statics = {
  // Load tweets
  load: function(id: bigint, callback: Function) {
    this.findOne({ _id: id })
      .populate("user", "name username provider github")
      .populate("comments.user")
      .exec(callback);
  },
  // List tweets
  list: function(options: schemaOptions) {
    const criteria = options.criteria || {};
    return this.find(criteria)
      .populate("user", "name username provider github")
      .sort({ createdAt: -1 })
      .limit(options.perPage)
      .skip(options.perPage * options.page);
  },
  // List tweets
  limitedList: function(options: schemaOptions) {
    const criteria = options.criteria || {};
    return this.find(criteria)
      .populate("user", "name username")
      .sort({ createdAt: -1 })
      .limit(options.perPage)
      .skip(options.perPage * options.page);
  },
  // Tweets of User
  userTweets: function(id: bigint, callback: Function) {
    this.find({ user: id })
      .toArray()
      .exec(callback);
  },

  // Count the number of tweets for a specific user
  countUserTweets: function(id: bigint, callback: Function) {
    return this.find({ user: id })
      .count()
      .exec(callback);
  },

  // Count the total app tweets
  countTotalTweets: function() {
    return this.find({}).count();
  }
};

mongoose.model("Tweet", TweetSchema);
