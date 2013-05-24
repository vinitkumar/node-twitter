## TODO List

- Write fat models having all the functions with the fuctionality.
- Write controllers to provide endpoints for routes.
- Don't worry about views as of now. Make the JSON output.
- Write tests.
- Then write views.



https://github.com/LearnBoost/mongoose/wiki/3.6-Release-Notes
[23/05/2013 19:10:48] madhu: * List of tweets 
* display user information of the user who tweeted
* Filtering options for the listing
  * filter by tags
  * filter by user
* Sort by date 
* Sort by title
[23/05/2013 19:12:12] madhu: * role based access to the route

users: [{
  user: { type: Schema.ObjectId, ref: 'User' },
  roles: { type: Array, default: ['user'] }
}],
