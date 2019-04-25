//@ts-check
import utils from "../../../lib/utils";
import  mongoose from "mongoose";
const Activity = mongoose.model("Activity");
import logger from "../middlewares/logger";
import { Response, Request, NextFunction } from "express";

exports.load = (req: Request, res: Response, next: NextFunction, id: BigInteger) => {
  const tweet = req.tweet;
  utils.findByParam(tweet.comments, { id: id }, (err, comment) => {
    if (err) {
      return next(err);
    }
    req.comment = comment;
    next();
  });
};

// ### Create Comment
exports.create = (req: Request, res: Response) => {
  const tweet = req.tweet;
  const user = req.user;

  if (!req.body.body) {
    return res.redirect("/");
  }
  tweet.addComment(user, req.body, err => {
    if (err) {
      logger.error(err);
      return res.render("pages/500");
    }
    const activity = new Activity({
      activityStream: "added a comment",
      activityKey: tweet.id,
      sender: user,
      receiver: req.tweet.user
    });
    logger.info(activity);
    activity.save(err => {
      if (err) {
        logger.error(err);
        return res.render("pages/500");
      }
    });
    res.redirect("/");
  });
};

// ### Delete Comment
exports.destroy = (req: Request, res: Response) => {
  // delete a comment here.
  const comment = req.comment;
  comment.remove(err => {
    if (err) {
      res.send(400);
    }
    res.send(200);
  });
};
