const express = require('express');
const app = express();
const port = 3000;

// Express에서 JSON 본문 파싱을 위한 미들웨어 추가
app.use(express.json());

app.get('/', (req, res) => {
    let headers = req.headers;
    console.log("id : " + headers.id);
    console.log('name : ' + headers.name);
    console.log('headers.header_test : ' + headers.test);
    console.log('Content-Type : ' + headers['content-type']);
    res.json({message : "헤더 받음"});
});

app.post('/', (req, res) => {
    console.log("Received data: ", req.body);
    res.json({ message: "Data received" });
});

app.listen(port, () => {
    console.log("서버 작동");
});
