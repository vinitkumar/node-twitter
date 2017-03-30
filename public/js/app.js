$(document).ready(function() {
  $('.favorite').on('click', function(e) {
    const tweet = $(e.currentTarget).data('tweetid');
    const tweetID = tweet.split('"')[1];
    console.log(tweet);
    const url = "tweets/" + tweetID + "/favorites";
    console.log(url);
    $.ajax({
      type: 'POST',
      url: url,
      success: function(data) {
        console.log('send a favorite');
      },
      error: function(data) {
        console.log('not sent');
      }
    });
  });

  $('.follow').on('click', function(e) {
    const user = $(e.currentTarget).data('userid');
    const userID = user.split('"')[1];
    const url = "/users/" + userID + "/follow";
    console.log(url);
    $(this).text(function(i, text) {
      return text === "follow" ? "unfollow" : "follow";
    });
    $.ajax({
      type: 'POST',
      url: url,
      success: function(data) {
        console.log('Followed the user');
      },
      error: function(data) {
        console.log('not sent');
      }
    });
  });
});

