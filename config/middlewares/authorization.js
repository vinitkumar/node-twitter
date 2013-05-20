/**
 * Generic require login routing middlewares
 */

exports.requireLogin = function (req, res, next) {
  if (!req.isAuthenticated()) {
    return res.redirect('/login');
  }
  next();
};


/**
 * User authorization routing middleware
 */

exports.user = {
  hasAuthorization: function (req, res, next) {
    if (req.profile.id != req.user.id) {
      return res.redirect('/users'+req.profile.id);
    }
    next();
  }
};


exports.article = {
  hasAuthorization: function (req, res, next) {
    if (req.article.user.id != req.user.id) {
      return res.redirect('/articles'+req.article.id);
    }
    next();
  }
};



