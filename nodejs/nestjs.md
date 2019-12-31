## 前言

分层是解决软件复杂度很好的方法，它能够降低耦合、增加复用。典型的java后端开发大多分为三层，几乎成了标准模式，但是node社区对于分层的讨论却很少。node后端是否需要分层？如何分层？本文将从个人的角度提供一些思路。

## 是否必要分层？如何分层？

个人的结论是：如果想做一个正儿八经的node后台应用，一定需要分层，java的三层架构，同样适用于node。结构如下：
![clipboard.png](https://segmentfault.com/img/bVbjr45?w=1170&h=430)

### dao层

dao(data access object)，数据访问对象，位于最下层，和数据库打交道。它的基本职责是封装数据的访问细节，为上层提供友好的数据存取接口。一般是各种数据库查询语句，缓存也可以在这层做。

无论是nest还是egg，官方demo里都没有明确提到dao层，直接在service层操作数据库了。这对于简单的业务逻辑没问题，如果业务逻辑变得复杂，service层的维护将会变得非常困难。业务一开始一般都很简单，它一定会向着复杂的方向演化，如果从长远考虑，一开始就应该保留dao层。

分享两点dao层的建议：

**1、以实体为中心定义类型描述。**
后端建模的一大产出是领域实体模型，后续的业务逻辑其实就是对实体模型的增删改查。利用ts对类型的丰富支持，可以先将实体模型的类型描述定义出来，这将极大的方便上层业务逻辑的实现。我一般会将实体相关的类型、常量等都定义到一个文件，命名为xxx.types.ts。定义到一个文件的好处是，编码规范好落实，书写和引用也非常方便，由于没有太多逻辑，即使文件稍微大一点，可读性也不会降低太多。

用po和dto来描述实体及其周边。po是持久化对象和数据库的表结构一一对应；dto数据传输对象则很灵活，可以在丰富的场景描述入参或返回值。下面是个user实体的例子：

```
// user.types.ts

/**
 * 用户持久化对象
 */
export interface UserPo {
    id: number;
    name: string; // 姓名
    gender: Gender; // 性别
    desc: string; // 介绍

}
/**
 * 新建用户传输对象
 */
export interface UserAddDto {
    name: string;
    gender?: Gender;
    desc?: string;
}
/**
 * 性别
 */
export enum Gender {
    Unknown,
    Male,
    Female,
}
```

虽然ts提供了强大的类型系统，如果不能总结出一套最佳实践出来，同样会越写越乱。全盘使用不是一个好的选择，因为这样会失去很多的灵活性。我们需要的是在某些必须的场景，坚持使用。

**2、不推荐orm框架**
orm的初心很好，它试图完全将对象和数据库映射自动化，让使用者不再关心数据库。过度的封装一定会带来另外一个问题——隐藏复杂度的上升。个人觉得，比起查询语句，隐藏复杂度更可怕。有很多漂亮的orm框架，比如java界曾经非常流行的hibernate，功能非常强大，社区也很火，但实际在生产中使用的人却很少，反倒是一些简单、轻量的被大规模应用了。而且互联网应用，对性能的要求较高，因此对sql的控制也需要更直接和精细。很多互联网公司也不推荐使用外键，因为db往往是瓶颈，关系的维护可以在应用服务器做，所以orm框架对应关系的定义不一定能用得上。

node社区有typeorm，sequelizejs等优秀的orm框架，个人其实并不喜欢用。我觉得比较好的是egg mysql插件所使用的[ali-rds](https://github.com/ali-sdk/ali-rds)。它虽然简单，却能满足我大部分的需求。所以我们需要的是一个好用的mysql client，而不是orm。我也造了一个类似的轮子[bsql](https://github.com/vinnyguitar/bsql)，我希望api的设计更加接近sql的语意。目前第一个版本还比较简单，核心接口已经实现，还在迭代，欢迎关注。下面是user.dao的示例。

```
import { Injectable } from '@nestjs/common';
import { BsqlClient } from 'bsql';
import { UserPo, UserAddDto } from './user.types';
@Injectable()
export class UserDao {
    constructor(
        private readonly db: BsqlClient,
    ) { }
    /**
     * 添加用户
     * @param userAddDto
     */
    async addUser(userAddDto: UserAddDto): Promise<number> {
        const result = await this.db.insertInto('user').values([userAddDto]);
        return result.insertId;
    }
    /**
     * 查询用户列表
     * @param limit
     * @param offset
     */
    async listUsers(limit: number, offset: number): Promise<UserPo[]> {
        return this.db.select<UserPo>('*').from('user').limit(limit).offset(offset);
    }
    /**
     * 查询单个用户
     * @param id
     */
    async getUserById(id: number): Promise<UserPo> {
        const [user] = await this.db.select<UserPo>('*').from('user').where({ id }).limit(1);
        return user;
    }
}
```

从广义的角度看，dao层很像公式“程序=数据结构+算法”中的数据结构。“数据结构”的实现直接关系到上层的“算法”（业务逻辑）。

### service层

service位于dao之上，使用dao提供的接口，也可以调用其它service。service层也比较简单，主要是弄清其职责和边界。

**1、实现业务逻辑。**
service负责业务逻辑这点毋庸置疑，核心是如何将业务逻辑抽象成接口及其粒度。service层应该尽量提供功能相对单一的基础方法，更多的场景和变化可以在controller层实现。这样设计有利于service层的复用和稳定。

**2、处理异常。**
service应该合理的捕获异常并将其转化成业务异常，因为service层是业务逻辑层，他的调用方更关心业务逻辑进行到哪一步了，而不是一些系统异常。

在实现上，可以定义一个business.exception.ts，里面包含常见的业务异常。当遇到业务逻辑执行不下去的问题时，抛出即可，调用方既能根据异常的类型采取行动。

```
// common/business.exception.ts
/**
 * 业务异常
 */
export class BusinessException {
    constructor(
        private readonly code: number,
        private readonly message: string,
        private readonly detail?: string,
    ) { }
}
/**
 * 参数异常
 */
export class ParamException extends BusinessException {
    constructor(message: string = '参数错误', detail?: string) {
        super(400, message, detail);
    }
}
/**
 * 权限异常
 */
export class AuthException extends BusinessException {
    constructor(message: string = '无权访问', detail?: string) {
        super(403, message, detail);
    }
}
```

对于业务异常，还需要一个兜底的地方全局捕获，因为不是每个调用方都会捕获并处理异常，兜底之后就可以记录日志（方便排查问题）同时给与一些友好的返回。在nest中统一捕获异常是定义一个全局filter，代码如下：

```
// common/business-exception.filter.ts
import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { BusinessException } from './business.exception';

/**
 * 业务异常统一处理
 */
@Catch(BusinessException)
export class BusinessExceptionFilter implements ExceptionFilter {
    catch(exception: BusinessException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        response.json({ code: exception.code, message: exception.message });
        console.error(// tslint:disable-line
            'BusinessException code:%s message:%s \n%s',
            exception.code,
            exception.message,
            exception.detail);
    }
}
// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BusinessExceptionFilter } from './common/business-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 注册为全局filter
  app.useGlobalFilters(new BusinessExceptionFilter());
  await app.listen(3000);
}
bootstrap();
```

**3、参数校验。**
dao层设计很简单，几乎不做参数校验，同时dao也一般不会开放给外部直接调用，而是开放service。所以service层应该做好参数校验，起到保护的作用。

**4、事务控制。**
dao层可以针对单个的持久化做事物控制，粒度比较小，而基于业务原则的事物处理就应该在service层。nest目前貌似没有在service层提供事务的支持。接下来我准备做个装饰器，在service层提供数据库本地事物的支持。分布式事务比较复杂，有专门的方法，后面有机会再介绍。

### controller层

controller位于最上层，和外部系统打交道。把这层叫做“业务场景层”可能更贴切一点，它的职责是通过service提供的服务，实现某个特定的业务场景，并以http、rpc等方式暴露给外部调用。

**1、聚合参数**
前端传参方式有多种：query、body、param。有时搞不清楚到底应该从哪区，很不方便。我一般是自定义一个@Param()装饰器，把这几种参数对象聚合到一个。实现和使用方式如下：

```
// common/param.ts
import { createParamDecorator } from '@nestjs/common';

export const Param = createParamDecorator((data, req) => {
    const param = { ...req.query, ...req.body, ...req.param };
    return data ? param[data] : param;
});

// user/user.controller.ts
import { All, Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { UserAddDto } from './user.types';
import { Param } from '../common/param';

@Controller('api/user')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @All('add')
    async addUser(@Param() user: UserAddDto) {
        return this.userService.addUser(user);
    }

    @All('list')
    async listUsers(
        @Param('pageNo') pageNo: number = 1,
        @Param('pageSize') pageSize: number = 20) {
        return this.userService.listUsers(pageNo, pageSize);
    }
}
```

**2、统一返回结构**
一个api调用，往往都有个固定的结构，比如有状态码和数据。可以将controller的返回包装一层，省去一部分样板代码。下面是用Interceptor的一种实现：

```
// common/result.ts
import { Injectable, NestInterceptor, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
    data: T;
    code: number;
    message: string;
}

@Injectable()
export class ResultInterceptor<T>
    implements NestInterceptor<T, Response<T>> {
    intercept(
        context: ExecutionContext,
        call$: Observable<T>,
    ): Observable<Response<T>> {
        return call$.pipe(map(data => ({ code: 200, data, message: 'success' })));
    }
}
```

所有的返回将会包裹在如下的结构中：
![clipboard.png](https://segmentfault.com/img/bVbjr5a?w=560&h=384)

**3、参数校验还是留给service层吧**
nest提供了一套针对请求参数的校验机制，功能很强大。但使用起来会稍微繁琐一点，实际上也不会有太多复杂的参数校验。个人觉得参数校验可以统一留给service，assert库可能就把这个事情搞定了。

## 小结

本文讲的都是一些很小的点，大多是既有的理论。这些东西不想清楚，写代码时就会非常难受。大家可以把这里当做一个规范建议，希望能提供一些参考价值。

## Nest.js 的执行顺序

```
客户端请求 ---> 中间件 ---> 守卫 ---> 拦截器之前 ---> 管道 ---> 控制器处理并响应 ---> 拦截器之后 ---> 过滤器
```
