const { httpHandler } = require('./handler/httpHandler');
const { wsHandler } = require('./handler/wsHandler');
const { fileCheck } = require('./service/service');
const logger = require('./config/logger');

const options = {
    method: 'GET',
    headers: {
        tid: '9HbT8bEqr37ml',
        'Content-Type': 'application/json'
    }
};

async function main() {
    let isFile = fileCheck(options.headers.tid);
    logger.info(`파일 체크 : ${isFile}`)

    if (!isFile) {
        try {
            // http 연결
            const tid = await httpHandler(options);
            
            // 웹소켓 연결
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
