import mongoose from "mongoose";
const User = mongoose.model("User");
const Activity = mongoose.model("Activity");
const logger = require("../middlewares/logger");
import {Request, Response} from "express";
import {UserDocument} from "../models/user";

exports.follow = (req: Request, res: Response) => {
  const user = req.user as UserDocument;
  const id = req.url.split("/")[2];
  // push the current user in the follower list of the target user

  const currentId = user.id;

  User.findOne({ _id: id }, function(err: mongoose.Error, user: UserDocument) {
    if (user.followers.indexOf(currentId) === -1) {
      user.followers.push(currentId);
    }
    user.save(function (err: mongoose.Error) {
      if (err) {
        logger.error(err);
      }
    });
  });

  // Over here, we find the id of the user we want to follow
  // and add the user to the following list of the current
  // logged in user
  User.findOne({ _id: currentId }, function(err: mongoose.Error, user: UserDocument) {
    if (user.following.indexOf(id) === -1) {
      user.following.push(id);
    }
    user.save(function (err: mongoose.Error) {
      const activity = new Activity({
        activityStream: "followed by",
        activityKey: user,
        sender: currentId,
        receiver: user
      });

      activity.save(function (err: mongoose.Error) {
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
