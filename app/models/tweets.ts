import mongoose, { Schema, Document } from 'mongoose';
import * as utils from '../../lib/utils';

//  Getters and Setters
const setTags = (tags: string[]): string[] => tags.map((t) => t.toLowerCase());

export interface IComment {
  body: string;
  user: Schema.Types.ObjectId;
  commenterName: string;
  commenterPicture: string;
  createdAt: Date;
}

export interface ITweet extends Document {
  body: string;
  user: Schema.Types.ObjectId;
  comments: IComment[];
  tags: string[];
  favorites: Schema.Types.ObjectId[];
  favoriters: Schema.Types.ObjectId[];
  favoritesCount: number;
  createdAt: Date;
  uploadAndSave(images: any[]): Promise<ITweet>;
  addComment(user: any, comment: any): Promise<ITweet>;
  removeComment(commentId: string): Promise<ITweet>;
}

// Tweet Schema
const TweetSchema = new Schema<ITweet>(
  {
    body: { type: String, default: '', trim: true, maxlength: 280 },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    comments: [
      {
        body: { type: String, default: '', maxlength: 280 },
        user: { type: Schema.Types.ObjectId, ref: 'User' },
        commenterName: { type: String, default: '' },
        commenterPicture: { type: String, default: '' },
        createdAt: { type: Date, default: Date.now }
      }
    ],
    tags: { type: [String], set: setTags },
    favorites: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    favoriters: [{ type: Schema.Types.ObjectId, ref: 'User' }], // same as favorites
    favoritesCount: Number,
    createdAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

// Pre save hook
TweetSchema.pre('save', function (this: any) {
  if (this.favorites) {
    this.favoritesCount = this.favorites.length;
  }
  if (this.favorites) {
    this.favoriters = this.favorites;
  }
});

// Validations in the schema
TweetSchema.path('body').validate(
  (body: string) => body.length > 0,
  'Tweet body cannot be blank'
);

TweetSchema.virtual('_favorites').set(function (this: ITweet, user: any) {
  const index = this.favorites.indexOf(user._id);
  if (index === -1) {
    this.favorites.push(user._id);
  } else {
    this.favorites.splice(index, 1);
  }
});

TweetSchema.methods = {
  uploadAndSave: async function (this: any, images: any[]) {
    // const imager = new Imager(imagerConfig, "S3");
    if (!images || !images.length) {
      return this.save();
    }
    // imager.upload(
    //   images,
    //   (err, cdnUri, files) => {
    //     if (err) {
    //       return callback(err);
    //     }
    //     if (files.length) {
    //       this.image = { cdnUri: cdnUri, files: files };
    //     }
    //     this.save(callback);
    //   },
    //   "article"
    // );
  },
  addComment: async function (this: any, user: any, comment: any) {
    const commenterName = user.name || user.username;
    const commenterPicture = user.github?.avatar_url || '';

    this.comments.push({
      body: comment.body,
      user: user._id,
      commenterName: commenterName,
      commenterPicture: commenterPicture
    });
    return this.save();
  },

  removeComment: async function (this: any, commentId: string) {
    const index = this.comments.findIndex((c: any) => c.id === commentId);
    if (index !== -1) {
      this.comments.splice(index, 1);
    } else {
      throw new Error('not found');
    }
    return this.save();
  }
};

// ## Static Methods in the TweetSchema
TweetSchema.statics = {
  // Load tweets
  load: async function (id: string) {
    return this.findOne({ _id: id } as any)
      .populate('user', 'name username provider github')
      .populate('comments.user')
      .exec();
  },
  // List tweets
  list: function (options: any) {
    const criteria = options.criteria || {};
    return this.find(criteria as any)
      .populate('user', 'name username provider github')
      .sort({ createdAt: -1 })
      .limit(options.perPage)
      .skip(options.perPage * options.page);
  },
  // List tweets
  limitedList: function (options: any) {
    const criteria = options.criteria || {};
    return this.find(criteria as any)
      .populate('user', 'name username')
      .sort({ createdAt: -1 })
      .limit(options.perPage)
      .skip(options.perPage * options.page);
  },
  // Tweets of User
  userTweets: async function (id: string) {
    return this.find({ user: id } as any).exec();
  },

  // Count the number of tweets for a specific user
  countUserTweets: async function (id: string) {
    return this.find({ user: id } as any).countDocuments().exec();
  },

  // Count the app tweets by criteria
  countTweets: function (criteria: any) {
    return this.find(criteria as any).countDocuments();
  }
};

mongoose.model('Tweet', TweetSchema);
