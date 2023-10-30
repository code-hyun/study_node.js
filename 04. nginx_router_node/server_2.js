const express = require('express');
const app = express();

app.get('/test2', (req, res) => {
    res.send('<h1>Server 2 - Test 2</h1><a href="http://localhost:80/test1">Go to Test 1</a>');
});

app.listen(90, () => {
    console.log('Server 2 is running on port 90');
});
