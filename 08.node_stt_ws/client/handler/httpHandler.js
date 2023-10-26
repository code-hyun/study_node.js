const http = require('http');
const logger = require('../config/logger');

function httpHandler(options, callback) {
    const req = http.request("http://localhost:3000/check", options, (res) => {
        let responseData = '';
        res.on('data', (data) => {
            responseData += data;
        });

        res.on('end', () => {
            const data = JSON.parse(responseData);
            logger.info(data.tid);
            callback(null, data.tid); // Success case
        });
    });

    req.on('error', (error) => {
        logger.error(`Error with request: ${error.message}`);
        callback(error); // Error case
    });

    req.end();
}

module.exports = httpHandler;
