/**
 * follow
 */

exports.follow = function (req, res) {
  console.log(req.user)
  console.log(req.url)
  var user = req.user
  user.follow(req.url.split('/')[2])
  user.save(function (err) {
    if (err) res.send(400)
    res.send(201, {})
  })
}
