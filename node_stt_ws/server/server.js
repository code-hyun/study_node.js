const express = require('express');
const http = require('http');

const router = require('./handler/httpHandler');
const { wsServer } = require('./handler/wsHandler')

const webApp = express();
const port = 3000;

webApp.use(express.json());
webApp.use('/', router);

const server = http.createServer(webApp)
wsServer(server);

server.listen(port, () => {
    console.log('서버 작동')
}).on('error', (err) => {
    console.error(err);
})