const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const crypto = require('crypto');
const authTypes = ['github', 'facebook', 'twitter'];

// ## Define UserSchema
const UserSchema = new Schema({
    name: String,
    email: String,
    username: String,
    provider: String,
    hashedPassword: String,
    salt: String,
    facebook: {},
    twitter: {},
    github: {},
    followers: [{type: Schema.ObjectId, ref: 'User'}],
    following: [{type: Schema.ObjectId, ref: 'User'}],
    tweets: Number
});

UserSchema
  .virtual('password')
  .set(function(password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashedPassword = this.encryptPassword(password);
  })
  .get(function() {
    return this._password;
  });

const validatePresenceOf = value => value && value.length;

UserSchema.path('name').validate(function(name) {
  if (authTypes.indexOf(this.provider) !== -1) {
    return true;
  }
  return name.length;
}, 'Name cannot be blank');

UserSchema.path('email').validate(function(email) {
  if (authTypes.indexOf(this.provider) !== -1) {
    return true;
  }
  return email.length;
}, 'Email cannot be blank');

UserSchema.path('username').validate(function(username) {
  if (authTypes.indexOf(this.provider) !== -1) {
    return true;
  }
  return username.length;
}, 'username cannot be blank');

UserSchema.path('hashedPassword').validate(function(hashedPassword) {
  if (authTypes.indexOf(this.provider) !== -1) {
    return true;
  }
  return hashedPassword.length;
}, 'Password cannot be blank');

UserSchema.pre('save', function(next) {
  if (!validatePresenceOf(this.password) && authTypes.indexOf(this.provider) === -1) {
    next(new Error('Invalid password'));
  } else {
    next();
  }
});

UserSchema.methods = {
  // Methods on the Schema
  follow: function(id) {
    if (this.following.indexOf(id) === -1) {
      this.following.push(id);
    } else {
      this.following.splice(this.following.indexOf(id), 1);
    }
    console.log(this.following);
  },

  authenticate: function(plainText) {
    return this.encryptPassword(plainText) === this.hashedPassword;
  },

  makeSalt: function() {
    return String(Math.round((new Date().valueOf() * Math.random())));
  },

  encryptPassword: function(password) {
    if (!password) {
      return '';
    }
    return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
  }

};

UserSchema.statics = {
  addfollow: function(id, cb) {
    this.findOne({_id: id})
      .populate('followers')
      .exec(cb);
  },
  list: function(options, cb) {
    const criteria = options.criteria || {};
    this.find(criteria)
      .populate('user', 'name username')
      .limit(options.perPage)
      .skip(options.perPage * options.page)
      .exec(cb);
  }
};

mongoose.model('User', UserSchema);
