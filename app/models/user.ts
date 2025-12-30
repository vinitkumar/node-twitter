import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';

const Tweet = mongoose.model('Tweet');
const authTypes = ['github'];

export interface IUser extends Document {
  name: string;
  email: string;
  username: string;
  provider: string;
  hashedPassword: string;
  salt: string;
  github: any;
  followers: Schema.Types.ObjectId[];
  following: Schema.Types.ObjectId[];
  tweets: number;
  _password?: string;
  password?: string;
  authenticate(plainText: string): boolean;
  makeSalt(): number;
  encryptPassword(password: string): string;
}

const UserSchema = new Schema<IUser>(
  {
    name: String,
    email: String,
    username: String,
    provider: String,
    hashedPassword: String,
    salt: String,
    github: {},
    followers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    following: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    tweets: Number
  },
  { timestamps: true }
);

UserSchema.virtual('password')
  .set(function (this: any, password: string) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashedPassword = this.encryptPassword(password);
  })
  .get(function (this: any) {
    return this._password;
  });

const validatePresenceOf = (value: string): boolean => !!(value && value.length > 0);

UserSchema.path('name').validate(
  function (this: any, name: string) {
    if (authTypes.indexOf(this.provider) !== -1) {
      return true;
    }
    return name && name.length > 0;
  },
  'Name cannot be blank'
);

UserSchema.path('email').validate(
  function (this: any, email: string) {
    if (authTypes.indexOf(this.provider) !== -1) {
      return true;
    }
    return email && email.length > 0;
  },
  'Email cannot be blank'
);

UserSchema.path('username').validate(
  function (this: any, username: string) {
    if (authTypes.indexOf(this.provider) !== -1) {
      return true;
    }
    return username && username.length > 0;
  },
  'username cannot be blank'
);

UserSchema.path('hashedPassword').validate(
  function (this: any, hashedPassword: string) {
    if (authTypes.indexOf(this.provider) !== -1) {
      return true;
    }
    return hashedPassword && hashedPassword.length > 0;
  },
  'Password cannot be blank'
);

UserSchema.pre('save', function (this: any, next: any) {
  if (
    !validatePresenceOf(this.password) &&
    authTypes.indexOf(this.provider) === -1
  ) {
    next(new Error('Invalid password'));
  } else {
    next();
  }
});

UserSchema.methods = {
  authenticate: function (this: any, plainText: string): boolean {
    return this.encryptPassword(plainText) === this.hashedPassword;
  },

  makeSalt: function (this: any): number {
    return Math.round(new Date().valueOf() * Math.random());
  },

  encryptPassword: function (this: any, password: string): string {
    if (!password) {
      return '';
    }
    const salt = this.makeSalt();
    return bcrypt.hashSync(password, salt);
  }
};

UserSchema.statics = {
  addfollow: function (id: string, cb: any) {
    return this.findOne({ _id: id })
      .populate('followers')
      .exec(cb);
  },
  countUserTweets: function (id: string, cb: any) {
    Tweet.countDocuments({ user: id } as any, cb);
  },
  load: function (options: any, cb: any) {
    options.select = options.select || 'name username github';
    return this.findOne(options.criteria)
      .select(options.select)
      .exec(cb);
  },
  list: function (options: any) {
    const criteria = options.criteria || {};
    return this.find(criteria)
      .populate('user', 'name username')
      .limit(options.perPage)
      .skip(options.perPage * options.page);
  },
  countTotalUsers: function () {
    return this.find({}).countDocuments();
  }
};

mongoose.model('User', UserSchema);
