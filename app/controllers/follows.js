// ## Follow 
var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    async = require('async');

exports.follow = function (req, res, next) {
  var user = req.user,
      id = req.url.split('/')[2];
  user.follow(id);
  user.save(function (err) {
  if (err) res.send(400);
    res.send(201, {});
  });
};

exports.unfollow = function(req, res, next) {
	//unfollow a user here.
};

