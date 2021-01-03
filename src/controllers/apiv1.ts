// ## Tweet Controller
import mongoose from "mongoose";
const Tweet = mongoose.model("Tweet");
const User = mongoose.model("User");

import {Request, Response} from "express";

exports.tweetList = (req: Request, res: Response) => {
  const page: number = (req.query.page > 0 ? req.query.page : 1) - 1;
  const perPage: number = 15;
  const options = {
    perPage: perPage,
    page: page
  };
  let tweets: Array<typeof Tweet>, count: number;
  Tweet.limitedList(options)
    .then(function (result: any) {
      tweets = result;
      return Tweet.countDocuments();
    })
    .then(function (result: any)  {
      count = result;
      return res.send(tweets);
    })
    .catch(function (error: any) {
      return res.render("pages/500", { errors: error.errors });
    });
};

exports.usersList = (req: Request, res: Response) => {
  const page = (req.query.page > 0 ? req.query.page : 1) - 1;
  const perPage: number = 15;
  const options = {
    perPage: perPage,
    page: page
  };
  let users: Array<typeof User>, count: any;
  User.list(options)
    .then(function (result: any) {
      users = result;
      return User.countDocuments();
    })
    .then(function (result: any) {
      count = result;
      return res.send(users);
    })
    .catch(function (error: any)  {
      return res.render("pages/500", { errors: error.errors });
    });
};
