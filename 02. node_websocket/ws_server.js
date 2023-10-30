const express = require('express');
const http = require('http');
const webSocket = require('ws');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const wss = new webSocket.Server({ server });

wss.on('connection', (ws, req) => {
    console.log('Client connected');
    const headers = req.headers;

    ws.on('message', (msg) => {
        console.log("header 값: ", headers); // headers 객체를 직접 출력
        if (headers['data_type'] === "text") {
            fs.writeFileSync('get_text.txt', msg);
            console.log("파일 생성 완료")
        }
        ws.send("file 성공적으로 받음");
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

server.listen(3001, () => {
    console.log("3000 포트 서버 작동");
});
