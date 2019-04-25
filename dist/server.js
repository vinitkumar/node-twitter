"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fs_1 = __importDefault(require("fs"));
const passport_1 = __importDefault(require("passport"));
const config_1 = __importDefault(require("./config/config"));
const authorization_1 = __importDefault(require("./config/middlewares/authorization"));
const mongoose_1 = __importDefault(require("mongoose"));
const env = process.env.NODE_ENV || 'development';
const app = express_1.default();
const port = process.env.PORT || 3000;
mongoose_1.default.Promise = global.Promise;
mongoose_1.default.connect(config_1.default.db, {
    keepAlive: true,
    reconnectTries: Number.MAX_VALUE,
    useMongoClient: true
});
const models_path = __dirname + '/models';
fs_1.default.readdirSync(models_path).forEach(file => {
    require(models_path + '/' + file);
});
require('./config/passport')(passport_1.default, config_1.default);
require('./config/express')(app, config_1.default, passport_1.default);
require('./config/routes')(app, passport_1.default, authorization_1.default);
app.listen(port);
console.log('Express app started on port ' + port);
module.exports = app;
//# sourceMappingURL=server.js.map