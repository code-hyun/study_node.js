const http = require('http');
const logger = require('../config/logger');

function httpHandler(options) {
    return new Promise((resolve, reject) => {
        const req = http.request("http://localhost:3000/check", options, (res) => {
            let responseData = '';
            res.on('data', (data) => {
                responseData += data;
            });

            res.on('end', () => {
                const data = JSON.parse(responseData);
                logger.info(`[HTTP][Tid] ${data.tid} `);
                resolve(data.tid);
            });
        });

        req.on('error', (error) => {
            logger.error(`에러 메시지 : ${error.message}`);
            reject(error);
        });

        req.end();
    });
}

module.exports = {
    httpHandler: httpHandler
};
