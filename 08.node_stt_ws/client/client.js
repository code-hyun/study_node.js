const httpHandler = require('./handler/httpHandler');
const {wsHandler} = require('./handler/wsHandler');
const fileCheck = require('./service/service');
const logger = require('./config/logger');

const options = {
    method: 'GET',
    headers: {
        tid: 'B9pQElZfVSpEx',
        'Content-Type': 'application/json'
    }
};

let isFile = fileCheck(options.headers.tid);

if (!isFile) {
    httpHandler(options, (err, tid) => {
        if (err) {
            logger.error("HTTP Error:", err);
            return;
        }

        wsHandler(tid, (err) => {
            if (err) {
                logger.error("WebSocket Error:", err);
            } else {
                logger.info("WebSocket operation completed successfully.");
            }
        });
    });
} else {
    console.log('파일이 있다');
}
