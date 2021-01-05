const createPagination = require("./analytics").createPagination;
import mongoose from "mongoose";
const Activity = mongoose.model("Activity");
const Chat = mongoose.model("Chat");
const User = mongoose.model("User");
const logger = require("../middlewares/logger");
import {Request, Response, NextFunction} from "express";
import {UserDocument} from "../models/user";
import {CustomRequest} from "../middlewares/logger";

exports.chat = (req: CustomRequest, res: Response, next: NextFunction, id: string) => {
  Chat.load(id, (err: mongoose.Error, chat: typeof Chat) => {
    if (err) {
      return next(err);
    }
    if (!chat) {
      return next(new Error("Failed to load tweet" + id));
    }
    req.chat = chat;
    next();
  });
};

exports.index = (req: CustomRequest, res: Response) => {
  // so basically this is going to be a list of all chats the user had till date.
  const page: number = (req.query.page > 0 ? req.query.page : 1) - 1;
  const perPage: number = 10;
  const options = {
    perPage: perPage,
    page: page,
    criteria: { github: { $exists: true } }
  };
  let users: Array<typeof User>, count, pagination;
  User.list(options)
    .then(function (result: any){
      users = result;
      return User.countDocuments()
    })
    .then(function (result: any){
      count = result;
      pagination = createPagination(req, Math.ceil(result / perPage), page + 1);
      res.render("chat/index", {
        title: "Chat User List",
        users: users,
        page: page + 1,
        pagination: pagination,
        pages: Math.ceil(count / perPage)
      });
    })
    .catch(function (error: any){
      return res.render("pages/500", { errors: error.errors });
    });
};

exports.show = (req: CustomRequest, res: Response) => {
  res.send(req.chat);
};

exports.getChat = (req: CustomRequest, res: Response) => {
  const options = {
    criteria: { receiver: req.params.userid }
  };
  let chats;
  Chat.list(options).then(function (result: any){
    chats = result;
    res.render("chat/chat", { chats: chats });
  });
};

exports.create = (req: CustomRequest, res: Response) => {
  let user = req.user as UserDocument;
  const chat = new Chat({
    message: req.body.body,
    receiver: req.body.receiver,
    sender: user.id
  });
  logger.info("chat instance", chat);
  chat.save(function (err: mongoose.Error){
    const activity = new Activity({
      activityStream: "sent a message to",
      activityKey: chat.id,
      receiver: req.body.receiver,
      sender: user.id
    });
    activity.save(function (err: mongoose.Error){
      if (err) {
        logger.error(err);
        res.render("pages/500");
      }
    });
    logger.error(err);
    if (!err) {
      res.redirect(req.header("Referrer"));
    }
  });
};
