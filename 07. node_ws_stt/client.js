const Websocket = require('ws');
const fs = require('fs');
const soundFile = fs.readFileSync('./client_send_sound/virus.wav');
const textFilePath = './speak-to-text';
const logger = require('./logger/logger');
const chunkSize  = 1000;
const http = require('http');
const options = {
    method: 'GET',
    headers: {
        tid : 'yUlG6ZVStKOgk',
        'Content-Type' : 'application/json'

    }
}
let tid;
const req = http.request("http://localhost:3001/check_tid", options, (res)=>{
    let responseData = '';

    res.on('data', ((data) => {
        responseData += data;
   }))

   res.on('end', () => {
    tid = JSON.parse(responseData);
    logger.info(tid)
    connectWebSocket(tid);
   });
});

req.on('error', (error) => {
    console.error(`Error with request: ${error.message}`);
});
req.end();

function connectWebSocket(tid){
    const ws = new Websocket('ws://localhost:3001', {
        headers: {
            tid : tid
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
    
            }
            if(!data.fileSend){
                for(let i =0; i < soundFile.length; i += chunkSize){
                    let end = Math.min(i + chunkSize, soundFile.length);
                    let sendData = soundFile.slice(i, end);
                    let jsonObj = {sound : sendData, tid : data.tid, fileSend : true};
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
}