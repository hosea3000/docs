## vscode 问题

### Debug: Cannot connect to runtime process, timeout after 10000 ms

#### 参考链接

> https://github.com/Microsoft/vscode/issues/72792

#### 问题描述

Vscode 在开启 debug 的时候报错如下

```log
Cannot connect to runtime process, timeout after 10000 ms - (reason: Cannot connect to the target: connect ECONNREFUSED 127.0.0.1:9229).
```

#### 问题总结

大概意思是说 设置的 端口号增加在了 npm 命令的后面 `/usr/local/bin/npm run-script debug --inspect-brk=9229`
其实需要的效果是增加在真正命令的后面 `node --nolazy --inspect-brk=9229 src/index.js`

#### 解决问题

launch.json

```js
{
    // Use IntelliSense to learn about possible attributes.
    // Hover to view descriptions of existing attributes.
    // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
    "version": "0.2.0",
    "configurations": [
        {
            "type": "node",
            "request": "launch",
            "name": "Launch Program",
            "runtimeExecutable": "npm", //  替换命令 node -> npm
            "runtimeArgs": [
                "run-script", "debug" // 命令的参数
            ],
            "cwd": "${workspaceFolder}/start/server", // 进入执行命令的目录
            "console": "integratedTerminal", // 控制台打印
            "internalConsoleOptions": "neverOpen", // 不打开新的控制台
            "port": 9229, // 设置debug端口号(要与package.json中的一致)
        }
    ]
}
```

package.json

```js
{
	"scripts": {
    "debug": "node --nolazy --inspect-brk=9229 src/index.js ", // 增加监听端口号
  },
}
```

### nest.js 的调试 launch.json

```js
{
  // 使用 IntelliSense 了解相关属性。
  // 悬停以查看现有属性的描述。
  // 欲了解更多信息，请访问: https://go.microsoft.com/fwlink/?linkid=830387
  "version": "0.2.0",
  "configurations": [{
    "type": "node",
    "request": "launch",
    "name": "Launch Program",
    "program": "${workspaceFolder}/src/main.ts",
    "preLaunchTask":{
      "type": "npm",
      "script": "build",
      "group": "build",
    },
    // "preLaunchTask": "tsc: watch - tsconfig.build.json",
    "outFiles": ["${workspaceFolder}/dist/**/*.js"],
    "console":"integratedTerminal",
    "skipFiles": [
      "${workspaceFolder}/node_modules/**/*.js",
      "<node_internals>/**/*.js"
    ]
  }]
}
```

### 非常简单的启动调试 launch 配置
```
{
  // 使用 IntelliSense 了解相关属性。
  // 悬停以查看现有属性的描述。
  // 欲了解更多信息，请访问: https://go.microsoft.com/fwlink/?linkid=830387
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node-terminal",
      "request": "launch",
      "name": "启动程序",
      "command": "yarn start:dev"
    }
  ]
}
```
