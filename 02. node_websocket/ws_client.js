const websocket = require('ws');
const fs = require('fs');

const sendText = fs.readFileSync('example.txt');
const ws = new websocket('ws://localhost:3001', {
    headers: {
        'data_type': 'text',
        id: 1,
        'key1': 'value1',
        'key2': 'value2',
        'key3': 'value3',
    }
});

ws.on('open', () => {
    console.log('Connected to the server');
    ws.send(sendText);
});

ws.on('message', (data) => { // 서버로부터 메시지를 수신할 때의 이벤트 핸들러
    console.log('서버로 부터 받음 :', data.toString('utf-8'));
});

ws.on('close', () => {
    console.log('연결 종료');
});
