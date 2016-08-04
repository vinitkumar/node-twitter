const express = require('express');
const fs = require('fs');
const passport = require('passport');

const env = process.env.NODE_ENV || 'development';
const config = require('./config/config')[env];
const auth = require('./config/middlewares/authorization');
const mongoose = require('mongoose');

mongoose.connect(config.db);

const models_path = __dirname+'/app/models';
fs.readdirSync(models_path).forEach(file => {
  require(models_path+'/'+file);
});

require('./config/passport')(passport, config);

const app = express();
require('./config/express')(app, config, passport);
require('./config/routes')(app, passport, auth);
const port = process.env.PORT || 3000;
app.listen(port);
console.log('Express app started on port '+port);
exports = module.exports = app;
