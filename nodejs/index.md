# Node.js 资料收集区

[五月君的面试题](https://interview.nodejs.red/)



[如何分析 Node.js 中的内存泄漏](https://zhuanlan.zhihu.com/p/25736931)



## Node.js的特点


- 基于V8的 Javascript 服务端 Runtime

- 事件驱动 (event loop)

- 异步非阻塞I/O (通过线程池来实现)


I/O和CPU完全分离, 实现非阻塞I/O, 保证 Event loop 高效

