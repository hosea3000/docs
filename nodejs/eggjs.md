### Egg.js 使用 Sequelize 想再框架启动之前 sync 同步表结构

如果直接写在 app.js 中会有问题, 多 woker 启动都会去同步表结构. 直接写在 agent.js 里面也有点蠢，可以换成 agent 发送 SyncModel 事件给一个 worker，这样就没毛病了。

agent.js

```
module.exports = async agent => {
  agent.messenger.on('egg-ready', () => {
    agent.messenger.sendRandom('SyncModel');
  });
};
```

app.js

```
module.exports = app => {
  app.messenger.on('SyncModel', async () => {
    await app.model.sync({ force: true });
  });
};
```
