const http = require('http');
const req = http.request(
  { hostname: '127.0.0.1', port: 3000, path: '/vi', method: 'GET' },
  res => {
    console.log('STATUS', res.statusCode);
    console.log('HEADERS', JSON.stringify(res.headers));
    res.resume();
  }
);
req.on('error', err => {
  console.error('ERROR', err.message);
});
req.end();
