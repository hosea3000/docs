# 跨域解决方案

> http://www.ruanyifeng.com/blog/2016/04/cors.html

## 跨域资源共享 CORS

CORS 是一个 W2C 标准, 全称是"跨域资源共享"(Cross-origin resource sharing)
他允许浏览器向跨源服务器, 发出 XMLHttpRequest 请求, 从而克服了 AJAX 只能同源使用的限制

### 两种请求

浏览器将 CORS 请求分成两类: 简单请求(simple request)和 非简单请求

```txt
(1) 请求方法是以下三种方法之一：
HEAD
GET
POST

（2）人为添加的HTTP的头信息不超出以下几种字段：
Accept
Accept-Language
Content-Language
Last-Event-ID
Content-Type：只限于三个值application/x-www-form-urlencoded、multipart/form-data、text/plain
```

凡是不同时满足上面两个条件，就属于非简单请求。

#### 简单请求

对于简单请求，浏览器直接发出 CORS 请求。具体来说，就是在头信息之中，增加一个 Origin 字段。 这是浏览器自动增加的
Origin 字段用来说明，本次请求来自哪个源（协议 + 域名 + 端口）。服务器根据这个值，决定是否同意这次请求。

请求头示例

```txt
GET /cors HTTP/1.1
Origin: http://api.bob.com
Host: api.alice.com
Accept-Language: en-US
Connection: keep-alive
User-Agent: Mozilla/5.0...
```

如果服务器允许改域名的跨域访问, 服务器就会响应, 会多出几个头信息字段

返回头示例

```txt
Access-Control-Allow-Origin: http://api.bob.com
Access-Control-Allow-Credentials: true
Access-Control-Expose-Headers: FooBar
Content-Type: text/html; charset=utf-8
```

- Access-Control-Allow-Origin
  该字段是必须的。它的值要么是请求时 Origin 字段的值，要么是一个\*，表示接受任意域名的请求。
- Access-Control-Allow-Credentials
  服务器是否允许发送 Cookie。
  默认情况下，Cookie 不包括在 CORS 请求之中。设为 true，即表示服务器明确许可，Cookie 可以包含在请求中，一起发给服务器。这个值也只能设为 true，如果服务器不要浏览器发送 Cookie，删除该字段即可。
- Access-Control-Expose-Headers
  XMLHttpRequest 对象的 getResponseHeader()方法只能拿到 6 个基本字段：Cache-Control、Content-Language、Content-Type、Expires、Last-Modified、Pragma。如果想拿到其他字段，就必须在 Access-Control-Expose-Headers 里面指定。上面的例子指定，getResponseHeader('FooBar')可以返回 FooBar 字段的值。

* withCredentials 属性
  客户端是否允许发送 Cookie

  ```js
      // 客户端打开
      var xhr = new XMLHttpRequest();
      xhr.withCredentials = true;
      // 服务器打开
      Access-Control-Allow-Credentials: true
  ```

  如果要发送 Cookie，Access-Control-Allow-Origin 就不能设为星号，必须指定明确的、与请求网页一致的域名

#### 非简单请求

##### 预检请求

非简单请求的 CORS 请求，会在正式通信之前，增加一次 HTTP 查询请求，称为"预检"请求（preflight）。
浏览器先询问服务器，当前网页所在的域名是否在服务器的许可名单之中，以及可以使用哪些 HTTP 动词和头信息字段。只有得到肯定答复，浏览器才会发出正式的 XMLHttpRequest 请求，否则就报错。

预检请求示例

```txt
OPTIONS /cors HTTP/1.1
Origin: http://api.bob.com
Access-Control-Request-Method: PUT
Access-Control-Request-Headers: X-Custom-Header
Host: api.alice.com
Accept-Language: en-US
Connection: keep-alive
User-Agent: Mozilla/5.0...
```

"预检"请求用的请求方法是 OPTIONS，表示这个请求是用来询问的。头信息里面，关键字段是 Origin，表示请求来自哪个源。

- Access-Control-Request-Method
  访问服务器是否支持的请求方法
- Access-Control-Request-Headers
  浏览器 CORS 请求会额外发送的头信息字段

预检请求的回应
服务器收到"预检"请求以后，检查了 Origin、Access-Control-Request-Method 和 Access-Control-Request-Headers 字段以后，确认允许跨源请求，就可以做出回应。

```txt
HTTP/1.1 200 OK
Date: Mon, 01 Dec 2008 01:15:39 GMT
Server: Apache/2.0.61 (Unix)
Access-Control-Allow-Origin: http://api.bob.com
Access-Control-Allow-Methods: GET, POST, PUT
Access-Control-Allow-Headers: X-Custom-Header
Content-Type: text/html; charset=utf-8
Content-Encoding: gzip
Content-Length: 0
Keep-Alive: timeout=2, max=100
Connection: Keep-Alive
Content-Type: text/plain
```

- Access-Control-Allow-Origin
  上面的 HTTP 回应中，关键的是 Access-Control-Allow-Origin 字段，表示http://api.bob.com可以请求数据。该字段也可以设为星号，表示同意任意跨源请求。
- Access-Control-Allow-Methods
  返回的是所有支持的方法，而不单是浏览器请求的那个方法。这是为了避免多次"预检"请求。
- Access-Control-Allow-Headers
  如果浏览器请求包括 Access-Control-Request-Headers 字段，则 Access-Control-Allow-Headers 字段是必需的。
  它也是一个逗号分隔的字符串，表明服务器支持的所有头信息字段，不限于浏览器在"预检"中请求的字段。
- Access-Control-Allow-Credentials
  是否允许携带 cookie
- Access-Control-Max-Age
  本次预检请求的有效期，单位为秒, 表示多久之内不用重新请求

浏览器的正常请求和回应
一旦服务器通过了"预检"请求，以后每次浏览器正常的 CORS 请求，就都跟简单请求一样，会有一个 Origin 头信息字段。服务器的回应，也都会有一个 Access-Control-Allow-Origin 头信息字段。

```txt
PUT /cors HTTP/1.1
Origin: http://api.bob.com
Host: api.alice.com
X-Custom-Header: value
Accept-Language: en-US
Connection: keep-alive
User-Agent: Mozilla/5.0...
```

服务器正常的回应。

```txt
Access-Control-Allow-Origin: http://api.bob.com
Content-Type: text/html; charset=utf-8
```

### JSONP

服务器: 接口返回一段 JS 的字符串, 包含 CallBack 方法, 并把数据当成参数传进去
客户端: 利用 script 标签调用接口, 拿到返回值

JSONP 跨域输出的数据是可执行的 JavaScript 代码
ctx 输出的类型应该是'text/javascript'
ctx 输出的内容为可执行的返回数据 JavaScript 代码字符串
需要有回调函数名 callbackName，前端获取后会通过动态执行 JavaScript 代码字符，获取里面的数据

实现方式

```js
// jsonp 的script字符串
let jsonpStr = `;${callbackName}(${JSON.stringify(returnData)})`;

// 用text/javascript，让请求支持跨域获取
ctx.type = 'text/javascript';
```

#### 两种方式比较

CORS 与 JSONP 的使用目的相同，但是比 JSONP 更强大。

JSONP 只支持 GET 请求，CORS 支持所有类型的 HTTP 请求。JSONP 的优势在于支持老式浏览器，以及可以向不支持 CORS 的网站请求数据。

CORS 则必须要配置白名单
