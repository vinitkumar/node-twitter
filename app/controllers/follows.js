exports.follow = function(req, res) {
  var user = req.user;
  var id = req.url.split('/')[2];
  user.follow(id);
  user.save(function(err) {
    if (err) {
      res.send(400);
    }
    res.send(201, {});
  });
};
