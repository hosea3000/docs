# 遇到的问题

#### 关于事务

> 事务一定要退出或者提交, 程序中途退出会造成数据被锁死(无法修改, 只能查询)

1. 使用事务外层一定要捕获异常, 然后在捕获异常处回滚 transaction
2. 避免在 transaction 中间使用 return, 会造成事务无法正常提交或回滚
3. 在使用 transaction 中间避免不实用 transaction 操作数据库, 因为这个时候数据被锁了, 无法操作

#### ORM 更新尽量避免使用 Save

Save 使用的是整行更新, 如果其他地方更新了某个字段会被覆盖, 建议使用 update

#### 捕获异常很重要

request 模块返回异常状态码 会抛出错误 需要捕获
require 引入文件如果没有也会抛出错误

#### 查询是否在有效期内时总是有时候对,有时候不对

原因是我在 sequelize model 的 scope 中设置的是对象, 然后在里面读取了当前时间, 因为对象是静态的, 所以时间固定在文件被加载的时间
解决方案, scope 使用方法的形式, 每次调用都会加载

#### include 如果是一对多不要 include 最好不要多个

比如: a include [b, c] 最后查出来的结果集是 b 的条数 \* c 的条数

#### postgreSQL 查询时不指定 order 字段会导致分页数据查询混乱

指定 pk 或者 unique 字段进行排序

#### http 接口短时间内连续调用, 导致数据验证通过, 但是插入数据时报重复的 key

因为后端做了唯一键的限制, 所以数据本身并没有问题
解决思路:

    - 前端按钮增加防连续点击的限制
    - 后端做缓存验证(配合redis md5)
    - ningx 代理也可以实现(待研究)
    - 数据库唯一键限制
    - POST 不具有幂等性, 可以先申请一个 ticket_id, 一个ticket_id只允许创建一次, 将POST改造成具有幂等性

#### 图片上传和资料提交接口未分开, 导致接口超时

#### parameter 包字段传 null 和不传 都会认为没有传

### 数据库连接数突然飚满

- 是不是有大流量请求
- 是不是有消息队列堆积
- 检查接口是否有高并发查询

### 充值接口并发回调计算电量错误的问题

- 增加分布式锁

#### 大表增加字段设置了默认值, 导致数据库卡死

- 需要作为查询条件的字段最好设置默认值, 这样更容易命中索引

### findOne 就尽量不要连表

### 数组的 unshift

### pg 数据库查询, 查询的结果集比较大, 分页量比较到, 当 offset 到数字比较大之后查询会很慢, 而且数据库的 IO 会跑满

- 增加查询条件, 缩小数据量
- 缩小单页的数据量

### 计算服务进程退出(连续计算)

> 原因: V8 内存没有及时释放, 多次计算内存累积, 内存被撑爆了

- 每次都新开一个进程去做
- 使用强制内存回收,

  ```js
  // 代码中加入
  global.gc();

  // 启动时加入参数
  node --expose-gc index.js
  ```

### mongoose 的 update 默认只会更新一条数据

最好使用 updateOne 和 updateMany

### Object.assign() 会改变原有数据

> Object.assign() 会改变第一个参数，即使是调用方法里面也会(引用传递)

- 改变了第一个参数

```js
const a = { a: 1, b: 2 };
Object.assign(a, { b: 3, c: 3 }); // { a: 1, b: 3, c: 3 }
```

- 引用传递也会改变

```js
const a = { a: 1, b: 2 };
function assign(obj) {
  return Object.assign(a, { b: 3, c: 3 });
}
assign(a);
console.log(a); // { a: 1, b: 3, c: 3 }
```

- !建议写法

```js
Object.assign({}, a, { b: 3, c: 3 });
console.log(a); // { a:1, b:2 }
```

### findOneAndUpdate 返回的是更新之前的数据

    如果需要更新之后的数据 option: `{ new: true }`

### 捕获错误

```js
// 错误写法
try {
  return promisefunction();
} catch (err) {
  console.log(err);
}

// 正确写法
try {
  return await promisefunction();
} catch (err) {
  console.log(err);
}
```

### TS 在不同文件中声明同名类会报错的问题

默认情况下，当你在一个新的 TypeScript 文件中写下代码时，它处于全局命名空间中。要解决这个问题你应该在 TypeScript 文件的根级别位置含有 import 或者 export，它会在这个文件中创建一个本地的作用域。

### Node.js Stream

1. 使用 pipe 的形式可以避免 ReadStream 读数据过快 WriteStream 写入速度不够导致数据积压在内存中
2. stream 多次 pipe 的问题

```js
// streamA pipe streamB 之后分别 pipe 到 streamC 和 streamD

// 这是错误写法, 会导致 streamD 的数据是两份重复的
streamA.pipe(streamB).pipe(streamC);
streamA.pipe(streamB).pipe(streamD);

// 正确写法
streamA.pipe(streamB).pipe(streamC);
streamB.pipe(streamD);
```

### stream 没有监听 `error` 事件导致进程退出

### error stack 丢失

这种写法丢失了原 error 的 stack， 不方便查找问题

```js
try {
} catch (err) {
  this.logger.log(
    { err, segmentId: segment.segmentId },
    'SegmentService:getAudienceIds:err'
  );
  throw new InternalServerErrorException(err.toString());
}
```

### `async-hooks` 可以很好解决 requestId 或者 trackId 的问题， 但是性能会有影响

### 分布式锁的运用
  1. 解决项目多进程部署时启动重复执行脚本的问题
  2. 解决rmq消费服务一条消息同时在被消费的问题

### rmq 消息一直报错无法被消费的问题
  1. redis 增加一个计数的key, 达到3次之后直接消费掉消息

### rmq 的消费执行脚本一定要设计成幂等的

### BloomFilter 解决大集合是否存在某个值的问题
### HyperMinHash 解决大集合之间相同个数的问题
### HyperLogLog 解决大集合的计数


### git submodule 解决服务在拆分的时候的公共代码问题


### V8内存设置的问题
V8的内存设置必须匹配, 比如 2G内存的机器  V8内存最好设置在1.5G

之前遇到过1G的机器， V8内存设置8个G， 然后由于V8内存的需要释放才释放的机制， 导致进程一直OOM