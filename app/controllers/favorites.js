// ### Create Favorite
exports.create = function (req, res) {
  var tweet = req.tweet;
  tweet._favorites = req.user;
  tweet.save(function (err) {
    if (err) return res.send(400);
    res.send(201, {});
  });
};


// ### Delete Favorite
exports.destroy = function (req, res) {
  var tweet = req.tweet;

  tweet._favorites = req.user;
  tweet.save(function (err) {
    if (err) return res.send(400);
    res.send(200);
  });
};
