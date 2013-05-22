var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    _ = require('underscore');


var MessageSchema  = new Schema({
  title: {type: String, default:'', trim: true},
  body:{type: String, default: '', trim: true},
  from:{type: Schema.ObjectId, ref: 'User'},
  to:{type: Schema.ObjectId, ref: 'User'},
  createdAt:{type: Date, default: Date.now}
});

MessageSchema.path('title').validate(function (title) {
  return title.length > 0;
}, 'Message title cannot be blank');

MessageSchema.path('body').validate(function (body) {
  return body.length > 0;
},'Message body cannot be blank');


MessageSchema.path('from').validate(function (from) {
  return from.length > 0;
},'Message from cannot be blank');

MessageSchema.path('to').validate(function (to) {
  return to.length > 0;
},'Message to cannot be blank');


mongoose.model('Message', MessageSchema);

