/**
 * Module dependencies
 */

var Mongoose = require('mongoose')
  , User = Mongoose.model('User');

exports.signin = function (req, res) {};

/**
 * Auth callback
 */

exports.authCallback = function (req, res, next) {
  res.render('/')
}



/**
 * Show Login form
 */

exports.login = function (req, res) {
  res.render('users/login', {
    title: 'Login',
    message: req.flash('error')
  });
};


/**
 * Show signup form
 */

exports.signup = function (req, res) {
  res.render('users/signup', {
    title: 'Sign up',
    user: new User()
  });
};

/**
 * Logout
 */

exports.logout = function (req, res) {
  req.logout()
  res.redirect('/login')
}

/**
 * Session
 */

exports.session = function (req, res) {
  res.redirect('/');
};


/**
 * Create user
 */


exports.create = function (req, res) {
  var user = new User(req.body);
  user.provider = 'local';
  user.save(function (err) {
    if (err) {
      return res.render('users/signup', { errors: err.errors, user: user });
    }
    req.logIn(user, function (err) {
      if (err) return next(err);
      return res.redirect('/');
    });
  });
};


exports.show = function (req, res) {
  var user = req.profile
  console.log({title:user.name, user: user})
  res.send(user)
  //  res.render('users/show', {
  //   title: user.name,
  //   user: user
  // })
}


/**
 * Find user by id
 */

exports.user = function (req, res, next, id) {
  User
    .findOne({ _id: id})
    .exec(function (err, user) {
      if (err) return next(err);
      if (!user) return next(new Error('failed to load user '+ id));
      req.profile = user;
      next();
    });
};


