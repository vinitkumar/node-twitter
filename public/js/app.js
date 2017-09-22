$(document).ready(function() {
  $('.favorite').on('click', function(e) {
    const tweetID = $(e.currentTarget).data('tweetid');
    const url = 'tweets/' + tweetID + '/favorites';
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
    const userID = $(e.currentTarget).data('userid');
    const url = '/users/' + userID + '/follow';
    $(this).text(function(i, text) {
      return text === 'follow' ? 'unfollow' : 'follow';
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
