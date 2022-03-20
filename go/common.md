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
2. 使用 NewService 函数初始化 Service 接口的实现并通过私有的结构体 service 持有
3. grpc 连接；
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



