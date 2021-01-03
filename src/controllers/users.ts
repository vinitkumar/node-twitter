import mongoose from "mongoose";
import {Request, Response, NextFunction} from "express";
const Tweet = mongoose.model("Tweet");
const User = mongoose.model("User");
const Analytics = mongoose.model("Analytics");
const logger = require("../middlewares/logger");

exports.signin = (req: Request, res: Response) => {};

exports.authCallback = (req: Request, res: Response) => {
  res.redirect("/");
};

exports.login = (req: Request, res: Response) => {
  let tweetCount: number, userCount: number, analyticsCount: number;
  let options = {};
  Analytics.list(options)
    .then(() => {
      return Analytics.countDocuments();
    })
    .then(function (result: any) {
      analyticsCount = result;
      return Tweet.countTweets();
    })
    .then(function (result: any) {
      tweetCount = result;
      return User.countTotalUsers();
    })
    .then(function (result: any) {
      userCount = result;
      logger.info(tweetCount);
      logger.info(userCount);
      logger.info(tweetCount);
      res.render("pages/login", {
        title: "Login",
        message: req.flash("error"),
        userCount: userCount,
        tweetCount: tweetCount,
        analyticsCount: analyticsCount
      });
    });
};

exports.signup = (req: Request, res: Response) => {
  res.render("pages/login", {
    title: "Sign up",
    user: new User()
  });
};

exports.logout = (req: Request, res: Response) => {
  req.logout();
  res.redirect("/login");
};

exports.session = (req: Request, res: Response) => {
  res.redirect("/");
};

exports.create = (req: Request, res: Response, next: NextFunction) => {
  const user = new User(req.body);
  user.provider = "local";
  user
    .save()
    .catch(function (error: any) {
      return res.render("pages/login", { errors: error.errors, user: user });
    })
    .then(() => {
      return req.login(user);
    })
    .then(() => {
      return res.redirect("/");
    })
    .catch(function (error: mongoose.Error) {
      return next(error);
    });
};

exports.list = (req: Request, res: Response) => {
  const page: number = (req.query.page > 0 ? req.query.page : 1) - 1;
  const perPage = 5;
  const options = {
    perPage: perPage,
    page: page,
    criteria: { github: { $exists: true } }
  };
  let users: Array<typeof User>, count;
  User.list(options)
    .then(function (result: any) {
      users = result;
      return User.countDocuments();
    })
    .then(function (result: any){
      count = result;
      res.render("pages/user-list", {
        title: "List of Users",
        users: users,
        page: page + 1,
        pages: Math.ceil(count / perPage)
      });
    })
    .catch(function (error: mongoose.Error)   {
      return res.render("pages/500", { errors: error.errors });
    });
};

exports.show = (req: Request, res: Response) => {
  const user = req.profile;
  const reqUserId = user._id;
  const userId = reqUserId.toString();
  const page: number = (req.query.page > 0 ? req.query.page : 1) - 1;
  const options = {
    perPage: 100,
    page: page,
    criteria: { user: userId }
  };
  let tweets: any, tweetCount;
  let followingCount = user.following.length;
  let followerCount = user.followers.length;

  Tweet.list(options)
    .then(function (result: any) {
      tweets = result;
      return Tweet.countUserTweets(reqUserId);
    })
    .then(function (result: any) {
      tweetCount = result;
      res.render("pages/profile", {
        title: "Tweets from " + user.name,
        user: user,
        tweets: tweets,
        tweetCount: tweetCount,
        followerCount: followerCount,
        followingCount: followingCount
      });
    })
    .catch(function (error: Error) {
      return res.render("pages/500", { errors: error.errors });
    });
};

exports.user = (req: Request, res: Response, next: NextFunction, id) => {
  User.findOne({ _id: id }).exec((err: mongoose.Error, user: typeof User) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return next(new Error("failed to load user " + id));
    }
    req.profile = user;
    next();
  });
};

exports.showFollowers = (req: Request, res: Response) => {
  showFollowers(req, res, "followers");
};

exports.showFollowing = (req: Request, res: Response) => {
  showFollowers(req, res, "following");
};

exports.delete = (req: Request, res: Response) => {
  Tweet.remove({ user: req.user._id })
    .then(() => {
      User.findByIdAndRemove(req.user._id)
        .then(() => {
          return res.redirect("/login");
        })
        .catch(() => {
          res.render("pages/500");
        });
    })
    .catch(() => {
      res.render("pages/500");
    });
};

function showFollowers(req: Request, res: Response, type: string) {
  let user = req.profile;
  let followers = user[type];
  let followingCount = user.following.length;
  let followerCount = user.followers.length;
  let userFollowers = User.find({ _id: { $in: followers } }).populate(
    "user",
    "_id name username github"
  );

  Tweet.countUserTweets(user._id).then(function (result: any) {
    let tweetCount: number = result;
    userFollowers.exec((err: mongoose.Error, users: Array<typeof User>) => {
      if (err) {
        return res.render("pages/500");
      }
      res.render("pages/followers", {
        user: user,
        followers: users,
        tweetCount: tweetCount,
        followerCount: followerCount,
        followingCount: followingCount
      });
    });
  });
}
