exports.follow = (req, res) => {
  const user = req.user;
  const id = req.url.split('/')[2];
  user.follow(id);
  user.save(err => {
    if (err) {
      res.send(400);
    }
    res.send(201, {});
  });
};
