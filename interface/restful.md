# 如何设计一套安全的接口

### [Restful资料](https://github.com/aisuhua/restful-api-design-references)

### 客户端请求Header
1. token
2. 客户端自己对Body数据加密的 data hash
3. 请求的时间

### 服务端接受到请求以后:
1.通过请求时间判断请求是否过期
2.通过token验证是否过期
3.验证token是否合法
4.以和客户端加密的方式再加密一次body的数据，来验证data hash。 防止传输过程中有人更改数据

* Restful链接中的id(因为不在body中)， 应当全部使用加密ID 而并不是数据库的真实ID
