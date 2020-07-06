# typescript 项目引入第三方包的 d.ts 声明文件

第一步： 安装 typings 工具查找包

```shell
	npm install typings -g
```

第二步：有时候不确定是否存在 可以通过库准确名称来查找。不过一般常见的包都有了

```shell
	typings search —name
```

第三步：以 lodash 为例

```shell
	npm install @types/lodash --save-dev
```

第四步：在 tsconfig.json 里

```typescript
	"types" : ["lodash"]
```

第五步，正常引入 lodash

```typescript
import * as _ from 'lodash';
```
