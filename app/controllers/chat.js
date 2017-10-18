const mongoose = require("mongoose");
const Analytics = mongoose.model("Analytics");
const Chat = mongoose.model("Chat");
const User = mongoose.model("User");
const qs = require('querystring');
const url = require('url')



exports.chat = (req, res, next, id) => {
  // logAnalytics(req);
  Chat.load(id, (err, chat) => {
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

exports.index = (req, res) => {
  // so basically this is going to be a list of all chats the user had till date.
  const page = (req.param("page") > 0 ? req.param("page") : 1) - 1;
  const perPage = 50;
  const options = {
    perPage: perPage,
    page: page,
    criteria: {github: { $exists: true}},
  };
  let users, count, chats;
  User.list(options)
    .then( result => {
      users = result;
      return User.count();
    })
    .then( result => {
      count = result;
      res.render("chat/index", {
        title: "Chat List",
        users: users,
        page: page + 1,
        pages: Math.ceil(count / perPage)
      });
    })
    .catch( error => {
      return res.render("pages/500");
    });
};


exports.show = (req, res) => {
  res.send(req.chat);
};

exports.getChat = (req, res) => {
  const options = {
    criteria: {'receiver': req.params.userid}
  };
  let chats;
  Chat.list(options)
    .then(result => {
      chats = result;
      res.render('chat/chat', {chats: chats});
    });
};

exports.create = (req, res) => {
  const chat = new Chat({
    message: req.body.body,
    receiver: req.body.receiver,
    sender: req.user.id,
  });
  console.log('chat instance', chat);
  chat.save( (err) => {
    console.log(err);
    if (!err) {
      res.redirect(req.header('Referrer'));
    }
  });
};