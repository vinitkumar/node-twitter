/**
 * Follows
 */


exports.follow = function (req, res) {
  var user = req.user
  user._follows = req.user
  user.save(function (err) {
    if (err) return res.send(400)
    res.send(201, {})
  })
}


/**
 * Unfollow a user
 */

exports.unfollow = function (req, res) {
  var user = req.user
  user._follows = req.user
  user.save(function (err) {
    if (err) return res.send(400)
    res.send(200)
  })
}
