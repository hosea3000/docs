### Golang-执行go get私有库提示“410 Gone” 解决办法

```bash
$ export GO111MODULE=on
$ export GOPROXY=direct
$ export GOSUMDB=off
```
提示的是找不到私有仓库，但是问题不是出现在连接上

关于GO111MODULE 和GOPROXY，都比较熟悉，而GOSUMDB 的说明如下：

我们知道go会在go module启用时在本地建立一个go.sum文件，用来存储依赖包特定版本的加密校验和。同时，Go维护下载的软件包的缓存，并在下载时计算并记录每个软件包的加密校验和。在正常操作中，go命令对照这些预先计算的校验和去检查某repo下的go.sum文件，而不是在每次命令调用时都重新计算它们。

在日常开发中，特定module版本的校验和永远不会改变。每次运行或构建时，go命令都会通过本地的go.sum去检查其本地缓存副本的校验和是否一致。如果校验和不匹配，则go命令将报告安全错误，并拒绝运行构建或运行。在这种情况下，重要的是找出正确的校验和，确定是go.sum错误还是下载的代码是错误的。如果go.sum中尚未包含已下载的module，并且该模块是公共module，则go命令将查询Go校验和数据库以获取正确的校验和数据存入go.sum。如果下载的代码与校验和不匹配，则go命令将报告不匹配并退出。

Go 1.13提供了GOSUMDB环境变量用于配置Go校验和数据库的服务地址（和公钥），其默认值为”sum.golang.org”，这也是Go官方提供的校验和数据库服务(大陆gopher可以使用sum.golang.google.cn)。

出于安全考虑，建议保持GOSUMDB开启。但如果因为某些因素，无法访问GOSUMDB（甚至是sum.golang.google.cn），可以通过下面命令将其关闭：


```
go env -w GOSUMDB=off
```

GOSUMDB关闭后，仅能使用本地的go.sum进行包的校验和校验了。



## 占位符

```
普通占位符
占位符     说明                           举例                   输出
%v      相应值的默认格式。            Printf("%v", people)   {zhangsan}，
%+v     打印结构体时，会添加字段名     Printf("%+v", people)  {Name:zhangsan}
%#v     相应值的Go语法表示            Printf("#v", people)   main.Human{Name:"zhangsan"}
%T      相应值的类型的Go语法表示       Printf("%T", people)   main.Human
%%      字面上的百分号，并非值的占位符  Printf("%%")            %

布尔占位符
占位符       说明                举例                     输出
%t          true 或 false。     Printf("%t", true)       true

整数占位符
占位符     说明                                  举例                       输出
%b      二进制表示                             Printf("%b", 5)             101
%c      相应Unicode码点所表示的字符              Printf("%c", 0x4E2D)        中
%d      十进制表示                             Printf("%d", 0x12)          18
%o      八进制表示                             Printf("%d", 10)            12

指针
占位符         说明                      举例                             输出
%p      十六进制表示，前缀 0x          Printf("%p", &people)             0x4f57f0
```

## 一个标准的go代码结构

```go
package post

type Service interface {
    ListPosts() ([]*Post, error)
}

type service struct {
    conn *grpc.ClientConn
}

func NewService(conn *grpc.ClientConn) Service {
    return &service{
        conn: conn,
    }
}

func (s *service) ListPosts() ([]*Post, error) {
    posts, err := s.conn.ListPosts(...)
    if err != nil {
        return []*Post{}, err
    }
    
    return posts, nil
}


1. 通过接口 Service 暴露对外的 ListPosts 方法；
2. 使用 NewService 函数初始化 Service 接口的实现并通过私有的结构体 service 持有 3. grpc 连接；
4. ListPosts 不再依赖全局变量，而是依赖接口体 service 持有的连接；

package main

import ...

func main() {
    conn, err = grpc.Dial(...）
    if err != nil {
        panic(err)
    }
    
    svc := post.NewService(conn)
    posts, err := svc.ListPosts()
    if err != nil {
        panic(err)
    }
    
    fmt.Println(posts)
}

1. 使用大写的 Service 对外暴露方法；
2. 使用小写的 service 实现接口中定义的方法；
3. 通过 NewService 函数初始化 Service 接口

```



