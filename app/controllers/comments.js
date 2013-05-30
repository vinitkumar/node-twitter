/**
 * Module dependencies
 */

var mongoose = require('mongoose')

/**
 * Create comment
 */

exports.create = function (req, res) {
  var tweet = req.tweet
  var user = req.user

  if (!req.body.body) return res.redirect('/tweets/'+tweet.id)

  tweet.addComment(user, req.body, function (err) {
    if (err) return res.render('500')
    res.redirect('/')
  })
}
