## HTTP 协议历史

### HTTP 大致可以分为 4 个版本

- HTTP/0.9
- HTTP/1.0
- HTTP/1.1
- HTTP/2

### HTTP/0.9

HTTP 的最初版本，只有 GET 方法， 没有请求头和请求体

### HTTP/1.0

这个版本已经是我们现用版本了，

- 增加了请求头和请求体，
- 定义了 GET，POST， PUT，DELETE 等请求方法，
- 定义了常见 HTTP 状态码

#### 这个版本的问题

1. 一次连接只能发送一次请求，HTTP 连接无法复用

### HTTP/1.1

1. 增加了长连接支持 `Connection： keep-alive` 但是一般会限制每个 host 的长连接数
