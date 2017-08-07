const mongoose = require('mongoose');
const User = mongoose.model('User');

exports.follow = (req, res) => {
  const user = req.user;
  const id = req.url.split('/')[2];
  // push the current user in the follower list of the target user
  User.findOne({_id: id}, function (err, target) {
    if (target.followers.indexOf(target.id) === -1) {
      target.followers.push(target.id);
    }
    target.save(err => {
      if(err) {
        res.send(400);
      }
    });
  });

  const currentId = user.id;
  User.findOne({_id: currentId}, function (err, user) {
    if (user.following.indexOf(id) === -1) {
      user.following.push(id);
    }
    user.save(err => {
      if (err) {
        res.send(400);
      }
      res.send(201, {});
    });
  });
};
