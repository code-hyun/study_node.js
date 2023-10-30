const express = require('express');
const {Client} = require('pg')
const app = express();
const port = 3000;

app.use(express.json());

app.post('/data', (req, res) => {
    console.log('서버에서 받은 데이터:', req.body);
    const data = req.body;

    // DB 서버 접속 정보
    const client = new Client({
        user: data.user,
        host: data.host,
        database: data.database,
        password: "test",
        port: 5432
    });

    client.connect((err) => {
        if (err) {
            res.status(500).send('Database connection error');
            return;
        }

        client.query(data.query, (err, result) => {
            if (err) {
                console.error('Query error:', err.stack);
                res.status(500).send('Query error');
                return;
            }
            
            console.log(result.rows);
            res.json(result.rows); // 쿼리 결과를 JSON 형식으로 응답

            client.end();
        });
    });
});

app.listen(port, () => {
    console.log(`서버가 ${port}번 포트에서 실행 중입니다.`);
});