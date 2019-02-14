const mongoose = require("mongoose");
const User = mongoose.model("User");
const Activity = mongoose.model("Activity");
const logger = require("../middlewares/logger");

exports.follow = (req, res) => {
  const user = req.user;
  const id = req.url.split("/")[2];
  // push the current user in the follower list of the target user

  const currentId = user.id;

  User.findOne({ _id: id }, function(err, user) {
    if (user.followers.indexOf(currentId) === -1) {
      user.followers.push(currentId);
    }
    user.save(err => {
      if (err) {
        logger.error(err);
      }
    });
  });

  // Over here, we find the id of the user we want to follow
  // and add the user to the following list of the current
  // logged in user
  User.findOne({ _id: currentId }, function(err, user) {
    if (user.following.indexOf(id) === -1) {
      user.following.push(id);
    }
    user.save(err => {
      const activity = new Activity({
        activityStream: "followed by",
        activityKey: user,
        sender: currentId,
        receiver: user
      });

      activity.save(err => {
        if (err) {
          logger.error(err);
          res.render("pages/500");
        }
      });
      if (err) {
        res.status(400);
      }
      res.status(201).send({});
    });
  });
};
