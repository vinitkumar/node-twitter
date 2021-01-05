// ## Tweet Controller
import {UserDocument} from "../models/user";

const createPagination = require("./analytics").createPagination;
import mongoose from "mongoose";
const Tweet = mongoose.model("Tweet");
const User = mongoose.model("User");
const Analytics = mongoose.model("Analytics");
const _ = require("underscore");
const logger = require("../middlewares/logger");

import { Request, Response, NextFunction } from "express";
import {TweetDocument} from "../models/tweets";
import {CustomRequest} from "../config/middlewares/logger";

exports.tweet = (req:Request, res:Response, next: NextFunction, id: string) => {
  Tweet.load(id, (err: mongoose.Error, tweet: typeof Tweet) => {
    if (err) {
      return next(err);
    }
    if (!tweet) {
      return next(new Error("Failed to load tweet" + id));
    }
    req.tweet = tweet;
    next();
  });
};

// ### Create a Tweet
exports.create = (req: CustomRequest, res:Response) => {
  const tweet = new Tweet(req.body) as TweetDocument;
  tweet.user = req.user as UserDocument;
  tweet.tags = parseHashtag(req.body.body);

  tweet.uploadAndSave({}, function (err: mongoose.Error) {
    if (err) {
      res.render("pages/500", {error: err});
    } else {
      res.redirect("/");
    }
  });
};

// ### Update a tweet
exports.update = (req: CustomRequest, res:Response) => {
  let tweet = req.tweet as TweetDocument;
  tweet = _.extend(tweet, { body: req.body.tweet });
  tweet.uploadAndSave({}, function (err: mongoose.Error) {
    if (err) {
      return res.render("pages/500", { error: err });
    }
    res.redirect("/");
  });
};

// ### Delete a tweet
exports.destroy = (req: CustomRequest, res:Response) => {
  const tweet = req.tweet as TweetDocument;
  tweet.remove(function (err: mongoose.Error) {
    if (err) {
      return res.render("pages/500");
    }
    res.redirect("/");
  });
};

// ### Parse a hashtag

function parseHashtag(inputText: string) {
  const regex = /(?:^|\s)(?:#)([a-zA-Z\d]+)/g;
  const matches = [];
  let match;
  while ((match = regex.exec(inputText)) !== null) {
    matches.push(match[1]);
  }
  return matches;
}

exports.parseHashtag = parseHashtag;

let showTweets = (req: CustomRequest, res:Response, criteria: any) => {
  const user = req.user as UserDocument;
  const findCriteria = criteria || {};
  const page: number = (req.query.page > 0 ? req.query.page : 1) - 1;
  const perPage = 10;
  const options = {
    perPage: perPage,
    page: page,
    criteria: findCriteria
  };
  let followingCount = user.following.length;
  let followerCount = user.followers.length;
  let tweets: Array<typeof Tweet>, tweetCount: number, pageViews: number, analytics: Array<typeof Analytics>, pagination: number;
  User.countUserTweets(user._id).then(function (result: any) {
    tweetCount = result;
  });
  Tweet.list(options)
    .then(function (result: any) {
      tweets = result;
      return Tweet.countTweets(findCriteria);
    })
    .then(function (result: any) {
      pageViews = result;
      pagination = createPagination(
        req,
        Math.ceil(pageViews / perPage),
        page + 1
      );
      return Analytics.list({ perPage: 15 });
    })
    .then(function (result: any) {
      analytics = result;
      res.render("pages/index", {
        title: "List of Tweets",
        tweets: tweets,
        analytics: analytics,
        page: page + 1,
        tweetCount: tweetCount,
        pagination: pagination,
        followerCount: followerCount,
        followingCount: followingCount,
        pages: Math.ceil(pageViews / perPage)
      });
    })
    .catch(function (error: any) {
      logger.error(error);
      res.render("pages/500");
    });
};

// ### Find a tag
exports.findTag = (req: CustomRequest, res:Response) => {
  let tag = req.params.tag;
  showTweets(req, res, { tags: tag.toLowerCase() });
};

exports.index = (req: CustomRequest, res:Response) => {
  showTweets(req, res, {});
};
