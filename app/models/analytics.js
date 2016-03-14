var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AnalyticsSchema = new Schema({
  ip: String,
  user: {type: Schema.ObjectId, ref: 'User'},
  url: String
});

mongoose.model('Analytics', AnalyticsSchema);
