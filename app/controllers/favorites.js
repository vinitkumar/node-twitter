/**
 * Favorites
 */

/**
 * Create a favorite
 */

exports.create = function (req, res) {
  var tweet = req.tweet
  console.log(req.user)
  tweet._favorites = req.user
  tweet.save(function (err) {
    if (err) return res.send(400)
    res.send(201, {})
  })
}


/**
 * Delete a like
 */

exports.destroy = function (req, res) {
  var tweet = req.tweet

  tweet._favorites = req.user
  tweet.save(function (err) {
    if (err) return res.send(400)
    res.send(200)
  })
}
