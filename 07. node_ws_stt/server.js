const Websocket = require('ws');
const fs = require('fs');
const http = require('http');
const express = require('express');
const { tid_check } = require('./module/tid_check');
const { create_tid } = require('./module/create_tid')
const { stt } = require('./module/clova');
const logger = require('./logger/logger');

const app = express();
const server = http.createServer(app);

const wss = new Websocket.Server({server});
const savePath = './server_getSound';
let tid;
app.get('/check_tid', (req, res) => {
    let header = req.headers;
    let clientTid = header.tid;
    logger.info(tid_check(clientTid));
    if(tid_check(clientTid)){
        tid = clientTid
    }else{
        tid = create_tid();
    }

    // tid =  tid_check(clientTid) ? clientTid : create_tid();
    logger.info(tid)
    res.send(JSON.stringify(tid));

})


wss.on('connection', async (ws, req) => {
    logger.info('[WS] Client connect');
    // client의 tid 값 받음
    const headers = req.headers;
    const client_tid = headers.tid 
    logger.info(client_tid);

    //유효 tid 체크
    let check;
    await tid_check(client_tid).then((data) => {
    logger.info(`[WS][Tid] ${client_tid} | 유효 Tid check : `  + data);
    check = data; // true or false
  })

    // 인증 확인 및 실패 시 재발급
    let msg // 클라이언트에게 인증 tid 재송신 메세지
    if(check){
        logger.info(`[WS][Tid] client_tid : ${client_tid} - OK`);
        msg = {tid : client_tid, certified : 1, message : "인증 완료"}
        ws.send(JSON.stringify(msg))
    }else {
        logger.error(`[WS]client_tid : ${client_tid} - 인증 실패`);
        // 인증 실패 시, 재발급
        let new_tid;
        await create_tid().then((data) => {
            logger.info(`[Tid] 새로운 Tid 재발급 : ${data}`)
            new_tid = data;
        })

        msg = {tid : new_tid, certified : 1, message : "인증 실패 후 tid 재발급 완료"};
        logger.info(`[WS][Tid] ${msg.tid} | [Certified] ${msg.certified} | ${msg.message}`)

        ws.send(JSON.stringify(msg))
    }

    // Client에서 받은 값
    let sound_buffer = new Array();
    ws.on('message', (msg) => {
        let data = JSON.parse(msg);
        let sound_data = Buffer.from(data.sound);
        
        // console.log(`client tid : ${data.tid}`)
        tid_check(data.tid).then( async (check) => {
            // logger.info(`[WS][Tid] ${data.tid} | [인증] ${check}`)
            if (check) {
                sound_buffer.push(sound_data);
                if(sound_data.length < 1000){
                    try {
                        logger.info(`[WS][Tid] ${data.tid} | 파일 전송 완료`)
                        
                        await fs.writeFileSync(`${savePath}/get_sound_from_Client.wav`,Buffer.concat(sound_buffer));
                        
                        if(fs.existsSync(`${savePath}/get_sound_from_Client.wav`)){
                            logger.info(`[WS][Tid] ${data.tid} | 음원 파일 생성 완료`)
                            let stt_text = await stt('Kor',`${savePath}/get_sound_from_Client.wav`);
                            if(stt_text){
                                logger.info(`[HTTP][STT] 변환 완료 | ${stt_text}`)
                                const stt_data = {stt : JSON.parse(stt_text), certified : 1, tid : data.tid};
                                logger.info(`[WS][STT] Send STT Data | [Tid] ${stt_data.tid} | [Certified] ${stt_data.certified} | [STT] ${stt_data.stt.text} `)
                                ws.send(JSON.stringify(stt_data));
                            }
                        }
                    } catch (error) {
                        logger.error("파일 생성 에러 발생",error.message);
                        fs.writeFileSync(`${savePath}/error.txt`, error.message);
                    }
                }
            }
            
        });
        
    })

    ws.on('close', () => {
        logger.info('[WS][CLOSE] websocket close');
    });
});

server.listen(3001, () => {
    logger.info('3001 포트 서버 작동')
}).on('error', (err) => {
    logger.error('서버 시작 중 에러 발생:', err);
})