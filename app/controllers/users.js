const Mongoose = require('mongoose');
const Tweet = Mongoose.model('Tweet');
const User = Mongoose.model('User');
const Analytics = Mongoose.model('Analytics');

/**
 * logAnalytics - Gets all the request and feeds to our analytics
 * sysyem
 *
 * @param  {type} req Request
 */
function logAnalytics(req) {
  var url = req.protocol + '://' + req.get('host') + req.originalUrl;
  var analytics = new Analytics(
    {
      ip: req.ip,
      user: req.user,
      url: url
    }
  );
  analytics.save(err => {
    if (err) {
      console.log(err);
    }
  });
}

exports.signin = (req, res) => {};

exports.authCallback = (req, res) => {
  res.redirect('/');
};

exports.login = (req, res) => {
  res.render('users/login', {
    title: 'Login',
    message: req.flash('error')
  });
};

exports.signup = (req, res) => {
  res.render('users/signup', {
    title: 'Sign up',
    user: new User()
  });
};

exports.logout = (req, res) => {
  logAnalytics(req);
  req.logout();
  res.redirect('/login');
};

exports.session = (req, res) => {
  res.redirect('/');
};

exports.create = (req, res, next) => {
  logAnalytics(req);
  var user = new User(req.body);
  user.provider = 'local';
  user.save(err => {
    if (err) {
      return res.render('users/signup', {errors: err.errors, user: user});
    }
    req.logIn(user, err => {
      if (err) {
        return next(err);
      }
      return res.redirect('/');
    });
  });
};

exports.list = (req, res) => {
  logAnalytics(req);
  var page = (req.param('page') > 0 ? req.param('page') : 1) - 1;
  var perPage = 5;
  var options = {
    perPage: perPage,
    page: page
  };
  return User.list(options, (err, users) => {
    if (err) {
      return res.render('500');
    }
    User.count().exec((err, count) => {
      if (err) {
        return res.render('500');
      }
      res.render('users/list',
        {
          title: 'List of Users',
          users: users,
          page: page + 1,
          pages: Math.ceil(count / perPage)
        });
    });
  });
};

exports.show = (req, res) => {
  logAnalytics(req);
  var user = req.profile;
  var reqUserId = user._id;
  var userId = reqUserId.toString();

  Tweet.find({user: userId}, (err, tweets) => {
    if (err) {
      return res.render('500');
    }
    res.render('users/show', {
      title: 'Tweets from ' + user.name,
      user: user,
      tweets: tweets
    });
  });
};

exports.user = (req, res, next, id) => {
  logAnalytics(req);
  User
    .findOne({_id: id})
    .exec((err, user) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return next(new Error('failed to load user ' + id));
      }
      req.profile = user;
      next();
    });
};
