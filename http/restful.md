# 如何设计一套安全的接口

### [Restful 资料](https://github.com/aisuhua/restful-api-design-references)

### 客户端请求 Header

1. token
2. 客户端自己对 Body 数据加密的 data hash
3. 请求的时间

### 服务端接受到请求以后:

1.通过请求时间判断请求是否过期 2.通过 token 验证是否过期 3.验证 token 是否合法 4.以和客户端加密的方式再加密一次 body 的数据，来验证 data hash。 防止传输过程中有人更改数据

- Restful 链接中的 id(因为不在 body 中)， 应当全部使用加密 ID 而并不是数据库的真实 ID

### 如何 Post 保证接口的幂等性

保证幂等性应该是进入页面即向后端获取一个唯一 token 令牌，点击按钮携带这个 token，不管网络环境提交多少次都是同一个 token，后端处理完一次(其他请求视为无效打回)再获取新的令牌。只靠后端实现幂等性是有缺陷的，因为测试环境下永远无法模拟用户的真实操作，可能面临的情况是无法预料的