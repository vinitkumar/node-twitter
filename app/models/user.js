/**
 * Module dependencies
 */

var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , crypto = require('crypto')
  , _ = require('underscore')
  , authTypes = ['github', 'facebook']



var UserSchema = new Schema({
  name: String,
  email: String,
  username: String,
  provider: String,
  hashed_password: String,
  salt: String,
  facebook: {},
  github: {},
  follows: [{ type: Schema.ObjectId, ref: 'User'}],
  followers: [{ type: Schema.ObjectId, ref: 'User'}],
  following: [{ type: Schema.ObjectId, ref: 'User'}],
  followersCount: Number,
  tweets: Number
});


UserSchema
  .virtual('password')
  .set(function(password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashed_password = this.encryptPassword(password);
  })
  .get(function() { return this._password; });


var validatePresenceOf = function (value) {
  return value && value.length;
};

UserSchema.path('name').validate(function (name) {
  if (authTypes.indexOf(this.provider) !== -1) return true;
  return name.length;
}, 'Name cannot be blank');

UserSchema.path('email').validate(function (email) {
  if (authTypes.indexOf(this.provider) !== -1) return true;
  return email.length;
}, 'Email cannot be blank');

UserSchema.path('username').validate(function (username) {
  if (authTypes.indexOf(this.provider) !== -1) return true;
  return username.length;
}, 'username cannot be blank');

UserSchema.path('hashed_password').validate(function (hashed_password) {
  if (authTypes.indexOf(this.provider) !== -1) return true;
  return hashed_password.length;
}, 'Password cannot be blank');


/**
 * Pre-save hook
 */

UserSchema.pre('save', function (next) {
  if (!this.isNew) return next();
  if (this.follows) this.followersCount = this.follows.length
  if (this.follows) this.followers = this.follows
  next()
  if (!validatePresenceOf(this.password)&& authTypes.indexOf(this.provider) === -1)
    next(new Error('Invalid password'));
  else
    next();
});

UserSchema.virtual('_follows').set(function (user) {
  if (this.follows.indexOf(user._id) == -1) {
    this.follows.push(user._id)
  } else {
    this.follows.splice(this.follows.indexOf(user._id), 1)
  }
})

UserSchema.methods = {
  /**
   * Authenticate
   * @param {String} plainText
   * @return {Boolean} [description]
   * @api public
   */

  authenticate: function (plainText) {
    return this.encryptPassword(plainText) === this.hashed_password;
  },

  makeSalt: function () {
    return Math.round((new Date().valueOf() * Math.random())) + '';
  },

  encryptPassword: function (password) {
    if (!password) return '';
    return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
  }

};

mongoose.model('User', UserSchema);
