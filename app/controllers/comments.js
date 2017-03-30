const utils = require('../../lib/utils');

exports.load = (req, res, next, id) => {
  const tweet = req.tweet;
  utils.findByParam(tweet.comments, {id: id}, (err, comment) => {
    if (err) {
      return next(err);
    }
    req.comment = comment;
    next();
  });
};

// ### Create Comment
exports.create = (req, res) => {
  const tweet = req.tweet;
  const user = req.user;

  if (!req.body.body) {
    return res.redirect('/tweets/' + tweet.id);
  }
  tweet.addComment(user, req.body, err => {
    if (err) {
      return res.render('500');
    }
    res.redirect('/');
  });
};

// ### Delete Comment
exports.destroy = (req, res) => {
	// delete a comment here.
  const comment = req.comment;
  comment.remove(err => {
    if (err) {
      res.send(400);
    }
    res.send(200);
  });
};
