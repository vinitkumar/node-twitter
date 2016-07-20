var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AnalyticsSchema = new Schema({
  ip: String,
  user: {type: Schema.ObjectId, ref: 'User'},
  url: String,
  createdAt: {type: Date, default: Date.now}
});

AnalyticsSchema.statics = {
  list: function(options, cb) {
    var criteria = options.criteria || {};
    this.find(criteria)
      .populate('user', 'name provider')
      .sort({'createdAt': -1})
      .limit(options.perPage)
      .skip(options.perPage * options.page)
      .exec(cb);
    }
}

mongoose.model('Analytics', AnalyticsSchema);
