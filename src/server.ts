import express from 'express';
import  fs from 'fs';
import passport from 'passport';
import config from './config/config';
import auth from './config/middlewares/authorization';
import mongoose from "mongoose";

const env = process.env.NODE_ENV || 'development';
const app = express();
const port = process.env.PORT || 3000;

mongoose.Promise = global.Promise;
mongoose.connect(config.db, {
  keepAlive: true,
  reconnectTries: Number.MAX_VALUE,
  useMongoClient: true
});

const models_path = __dirname+'/models';
fs.readdirSync(models_path).forEach(file => {
  require(models_path+'/'+file);
});

require('./config/passport')(passport, config);
require('./config/express')(app, config, passport);
require('./config/routes')(app, passport, auth);

app.listen(port);
console.log('Express app started on port ' + port);
module.exports = app;
