const winston = require('winston');
const fs = require('fs');
const path = require('path');
const moment = require('moment-timezone'); 

const logDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}

const logger = winston.createLogger({
    level: 'debug',
    format: winston.format.combine(
        winston.format.timestamp({
            format: () => moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss') 
        }),
        winston.format.printf(({ timestamp, level, message, ...metadata }) => {
            const meta = Object.keys(metadata).length ? JSON.stringify(metadata) : '';
            return `${timestamp} [${level.toUpperCase()}]: ${message} ${meta}`;
        })
    ),
    transports: [
        new winston.transports.Console(), 
        new winston.transports.File({
            filename: path.join(logDir, 'application.log'), 
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.printf(({ timestamp, level, message, ...metadata }) => {
                    const meta = Object.keys(metadata).length ? JSON.stringify(metadata) : '';
                    return `${timestamp} [${level.toUpperCase()}]: ${message} ${meta}`;
                })
            )
        })
    ]
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple()
    }));
}

module.exports = logger;
