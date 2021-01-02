var winston = require('winston');
var level = process.env.LOG_LEVEL || 'debug';
var logger = new winston.createLogger({
    transports: [
        new winston.transports.Console({
            level: level,
            timestamp: function () {
                return (new Date()).toISOString();
            }
        })
    ]
});
module.exports = logger;
