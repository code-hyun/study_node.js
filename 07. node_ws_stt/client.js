const Websocket = require('ws');
const fs = require('fs');
const soundFile = fs.readFileSync('./client_send_sound/virus.wav');
const textFilePath = './speak-to-text';
const logger = require('./logger/logger');

const chunkSize  = 1000;
const ws = new Websocket('ws://localhost:3001', {
    headers: {
        tid : 'hHNLIGMmaemx8'
        // tid : '1234567890123'
    }
});

ws.onopen = () => {
    logger.info('[WS][OPEN] websocket connect')
}
ws.onmessage = (event)  => {
    const data = JSON.parse(event.data);
    
    if(data.certified){
        logger.info(`[WS][Tid] ${data.tid} | 인증 완료`)
        
        if(data.stt){
            logger.info(`[WS][Tid] ${data.tid} | STT 전송 완료 | ${data.stt.text}`)
            try {
                fs.writeFileSync(`${textFilePath}/speack to text.txt`, data.stt.text);
                logger.info(`[WS][Tid] ${data.tid} | 경로 : ${textFilePath}/speack to text.txt | 저장 완료`)
            } catch (error) {
                logger.error("저장 실패",error.message);
            }
            ws.close();

        }else{
            for(let i =0; i < soundFile.length; i += chunkSize){
                let end = Math.min(i + chunkSize, soundFile.length);
                let sendData = soundFile.slice(i, end);
                let jsonObj = {sound : sendData, tid : data.tid /* , order : '1' */ };
                ws.send(JSON.stringify(jsonObj));
            }
            logger.info(`[WS][Tid] ${data.tid} | 음성파일 전송 완료`)
        }
    }
    else{
        logger.error(`[Tid] ${data.tid}| [Certified] ${data.certified} | 인증 실패`)
    }

    
}

ws.onclose = () => {
    logger.info('[WS] websocket disconnect')
}