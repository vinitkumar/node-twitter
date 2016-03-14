var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * Analytics Schema to be used to store analytics data
 * about which views are used most. 
 * @param {} mongoose
 */
var AnalyticsSchema = new Schema({
  ip: String,
  user: {type: Schema.ObjectId, ref: 'User'},
  url: String,
});

mongoose.model('Analytics', AnalyticsSchema);
