const http = require('http');

// GET 요청
const getOptions = {
    hostname: 'localhost',
    port: 3000,
    path: '/',
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        id: 1,
        "name": "hwang",
        "test": "header_test"
    }
};
const getRequest = http.get(getOptions, (res) => {
    res.on('data', (data) => {
        const json = JSON.parse(data);
        console.log(json.message);
    });
});
getRequest.end();

// POST 요청
const postData = JSON.stringify({
    key: "value"
});
const postOptions = {
    hostname: 'localhost',
    port: 3000,
    path: '/',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': postData.length
    }
};
const postRequest = http.request(postOptions, (res) => {
    res.on('data', (data) => {
        const json = JSON.parse(data);
        console.log(json.message);
    });
});
postRequest.write(postData);
postRequest.end();
