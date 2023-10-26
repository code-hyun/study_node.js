const { httpHandler } = require('./handler/httpHandler');
const { wsHandler } = require('./handler/wsHandler');
const fileCheck = require('./service/service');
const logger = require('./config/logger');

const options = {
    method: 'GET',
    headers: {
        tid: 'B9pQElZfVSpEx',
        'Content-Type': 'application/json'
    }
};

async function main() {
    let isFile = fileCheck(options.headers.tid);

    if (!isFile) {
        try {
            const tid = await httpHandler(options);
            await wsHandler(tid);
            logger.info("웹소켓 정상 작업완료");
        } catch (err) {
            logger.error(err.message);
        }
    } else {
        console.log('파일이 있다');
    }
}

main();
