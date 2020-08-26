const Koa = require('koa');
const app = new Koa();
const static = require('koa-static');
const path = require('path');

// 静态资源目录对于相对入口文件index.js的路径
const staticPath = './';

app.use(static(path.join(__dirname, staticPath)));

app.listen(6002);
