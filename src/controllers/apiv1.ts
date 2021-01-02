// ## Tweet Controller
import mongoose from "mongoose";
const Tweet = mongoose.model("Tweet");
const User = mongoose.model("User");

import {Request, Response} from "express";

exports.tweetList = (req: Request, res: Response) => {
  const page = (req.query.page > 0 ? req.query.page : 1) - 1;
  const perPage = 15;
  const options = {
    perPage: perPage,
    page: page
  };
  let tweets, count;
  Tweet.limitedList(options)
    .then(result => {
      tweets = result;
      return Tweet.countDocuments();
    })
    .then(result => {
      count = result;
      return res.send(tweets);
    })
    .catch(error => {
      return res.render("pages/500", { errors: error.errors });
    });
};

exports.usersList = (req: Request, res: Response) => {
  const page = (req.query.page > 0 ? req.query.page : 1) - 1;
  const perPage = 15;
  const options = {
    perPage: perPage,
    page: page
  };
  let users, count;
  User.list(options)
    .then(result => {
      users = result;
      return User.countDocuments();
    })
    .then(result => {
      count = result;
      return res.send(users);
    })
    .catch(error => {
      return res.render("pages/500", { errors: error.errors });
    });
};
