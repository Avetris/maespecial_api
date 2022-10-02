const winston = require('winston')

const options = {
  info: {
    level: 'info',
    filename: './logs/info.log',
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: false,
  },
  debug: {
    level: 'debug',
    filename: './logs/debug.log',
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: false,
  },
  error: {
    level: 'error',
    filename: './logs/error.log',
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: false,
  },
  console: {
    level: 'error',
    handleExceptions: true,
    json: false,
    colorize: true,
  },
};

const logger = winston.createLogger({
  levels: winston.config.npm.levels,
  transports: [
    new winston.transports.File(options.info),
    new winston.transports.File(options.debug),
    new winston.transports.File(options.error),
    new winston.transports.Console(options.console)
  ],
  exitOnError: false
})

module.exports = logger