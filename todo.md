# Freezing the development of Node Twitter for a Month. Version is pretty stable. Could be used as it is for now. Will resume the development in Next year.



## TODO List

- Write fat models having all the functions with the fuctionality.
- Write controllers to provide endpoints for routes.
- Don't worry about views as of now. Make the JSON output.
- Write tests.
- Then write views.


## Must do
https://github.com/LearnBoost/mongoose/wiki/3.6-Release-Notes
List of tweets 
- display user information of the user who tweeted
- Filtering options for the listing
  - filter by tags
  - filter by user
- Sort by date 
- Sort by title
- Role based access to the route
,
users: [{
  user: { type: Schema.ObjectId, ref: 'User' },
  roles: { type: Array, default: ['user'] }
}],
,
