$(document).ready(function () {
  $('.favorite').on('click', function(e) {
    var tweet = $(e.currentTarget).data('tweetid');
    var tweetID = tweet.split('"')[1];
    console.log(tweet);
    var url = "tweets/"+tweetID+"/favorites";
    console.log(url);
    $.ajax({
      type: 'POST',
      url: url,
      success: function (data) {
        console.log('send a favorite');
      },
      error: function (data) {
        console.log('not sent');
      }
    });
  });
});

