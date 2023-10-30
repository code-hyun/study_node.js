const http = require('http');

const server = http.createServer((req, res) => {
    if (req.url === '/test1') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end('<h1>Server 1 - Test 1</h1><a href="http://localhost:90/test2">Go to Test 2</a>');
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

server.listen(80, () => {
    console.log('Server 1 is running on port 80');
});
