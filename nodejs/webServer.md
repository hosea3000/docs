### 创建webSever

Node.js创建Http服务器可以利用http包的createServer方法创建一个简单的web服务器

```js
const http = require('http');

const server = http.createServer((req, res) => {
  if (req.url === '/ping') {
    res.end('pong');
  }
  res.end('hello web service');
});

server.listen(3000, () => {
  console.log('http start, listen on port 3000');
});

```

