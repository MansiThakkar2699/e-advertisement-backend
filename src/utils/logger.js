const winston = require('winston');
require('winston-daily-rotate-file');

// Define the format for your logs
const logFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf((info) => `${info.timestamp} [${info.level.toUpperCase()}]: ${info.message}`)
);

// Configure the daily rotation transport
const dailyRotateFileTransport = new winston.transports.DailyRotateFile({
    filename: 'logs/application-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true, // Compresses old logs to save space
    maxSize: '20m',      // Rotate if file exceeds 20MB
    maxFiles: '14d'      // Keep logs for 14 days
});

const logger = winston.createLogger({
    level: 'info', // Records 'info', 'warn', and 'error'
    format: logFormat,
    transports: [
        dailyRotateFileTransport,
        new winston.transports.Console() // Also see logs in your terminal
    ],
});

module.exports = logger;