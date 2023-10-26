const Websocket = require('ws');
const fs = require('fs');
const logger = require('../config/logger');
const soundFile = fs.readFileSync('./sound/virus.wav');
const textFilePath = './get_stt';
const chunkSize = 1000;

async function wsHandler(tid) {
    return new Promise((resolve, reject) => {
        const ws = new Websocket('ws://localhost:3000/stt', {
            headers: {
                tid: tid
            }
        });

        ws.onopen = () => {
            logger.info('[WS][OPEN] websocket connect')
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);

            if (data.certified) {
                logger.info(`[WS][Tid] ${data.tid} | 인증 완료`);

                if (data.stt) {
                    logger.info(`[WS][Tid] ${data.tid} | STT 전송 완료 | ${data.stt.text}`);
                    let saveTxt = { stt: data.stt.text, tid: data.tid, create_tid_time: data.create_time };
                    try {
                        fs.writeFileSync(`${textFilePath}/[${tid}] | ${data.stt.text}.txt`, JSON.stringify(saveTxt));
                        logger.info(`[WS][Tid] ${data.tid} | 경로 : ${textFilePath}/[${tid}|${data.stt.text}.txt | 저장 완료`);
                    } catch (error) {
                        reject(error);
                        return;
                    }
                    ws.close();
                }

                if (!data.fileSend) {
                    for (let i = 0; i < soundFile.length; i += chunkSize) {
                        let end = Math.min(i + chunkSize, soundFile.length);
                        let sendData = soundFile.slice(i, end);
                        let jsonObj = { sound: sendData, tid: data.tid, create_time: data.create_time, fileSend: true };
                        ws.send(JSON.stringify(jsonObj));
                    }
                    logger.info(`[WS][Tid] ${data.tid} | 음성파일 전송 완료`);
                }
            } else {
                logger.error(`[Tid] ${data.tid}| [Certified] ${data.certified} | 인증 실패`);
                reject(new Error("Authentication failed"));
            }
        };

        ws.onclose = () => {
            logger.info('[WS] websocket disconnect');
            resolve();
        };
    });
}

module.exports = {
    wsHandler: wsHandler
};
