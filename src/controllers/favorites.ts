import mongoose from "mongoose";
import {Request, Response} from "express";
import {CustomRequest} from "../config/middlewares/logger";
import {TweetDocument} from "../models/tweets";

// ### Create Favorite
exports.create = (req: CustomRequest, res: Response) => {
  const tweet = req.tweet;
  tweet._favorites = req.user;
  tweet.save(function (err: mongoose.Error) {
    if (err) {
      return res.send(400);
    }
    res.send(201, {});
  });
};

// ### Delete Favorite
exports.destroy = (req: CustomRequest, res: Response) => {
  const tweet = req.tweet as TweetDocument;

  tweet._favorites = req.user;
  tweet.save(function (err: mongoose.Error) {
    if (err) {
      return res.send(400);
    }
    res.send(200);
  });
};
