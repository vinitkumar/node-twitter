var mongoose = require('mongoose');

// ### Create Comment
exports.create = function (req, res) {
  var tweet = req.tweet;
  var user = req.user;

  if (!req.body.body) return res.redirect('/tweets/'+tweet.id);

  tweet.addComment(user, req.body, function (err) {
    if (err) return res.render('500');
    res.redirect('/');
  });
};

// ### Delete Comment
exports.destroy = function (req, res) {
	//delete a comment here.
  var comment = req.comment;
  comment.remove(function (err) {
    if (err) res.send(400);
    res.send(200);
  });
};
