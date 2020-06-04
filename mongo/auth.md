### mongodb用户权限管理最全攻略

1、进入mongodb的shell:

```
mongo
```

2、切换数据库

```
use admin
```

3、创建admin超级管理员用户

>指定用户的角色和数据库：
>(注意此时添加的用户都只用于admin数据库，而非你存储业务数据的数据库)
>(在cmd中敲多行代码时，直接敲回车换行，最后以分号首尾)

```
db.createUser(
  { user: "admin",
    customData: {description:"superuser"},
    pwd: "admin",
    roles: [ { role: "userAdminAnyDatabase", db: "admin" } ]
  }
)
```

- `user` 字段，为新用户的名字；
- `pwd` 字段，用户的密码；
- `cusomData` 字段，为任意内容，例如可以为用户全名介绍；
- `roles` 字段，指定用户的角色，可以用一个空数组给新用户设定空角色。在roles字段,可以指定内置角色和用户定义的角色。
- 超级用户的role有两种，`userAdmin`或者`userAdminAnyDatabase`(比前一种多加了对所有数据库的访问,仅仅是访问而已)。
- db是指定数据库的名字，admin是管理数据库。
- 不能用admin数据库中的用户登录其他数据库。注：只能查看当前数据库中的用户，哪怕当前数据库admin数据库，也只能查看admin数据库中创建的用户。

4、创建一个不受访问限制的超级用户

```
db.createUser(
    {
        user:"root",
        pwd:"pwd",
        roles:["root"]
    }
)
```

5、创建一个业务数据库管理员用户

>(只负责某一个或几个数据库的増查改删)

```
> db.createUser({
    user:"user001",
    pwd:"123456",
    customData:{
        name:'jim',
        email:'jim@qq.com',
        age:18,
    },
    roles:[
        {role:"readWrite",db:"db001"},
        {role:"readWrite",db:"db002"},
        'read'// 对其他数据库有只读权限，对db001、db002是读写权限
    ]
})
```
1. 数据库用户角色：read、readWrite；
2. 数据库管理角色：dbAdmin、dbOwner、userAdmin;
3. 集群管理角色：clusterAdmin、clusterManager、4. clusterMonitor、hostManage；
4. 备份恢复角色：backup、restore；
5. 所有数据库角色：readAnyDatabase、readWriteAnyDatabase、userAdminAnyDatabase、dbAdminAnyDatabase
6. 超级用户角色：root
7. 内部角色：__system
8. Read：允许用户读取指定数据库
9. readWrite：允许用户读写指定数据库
10. dbAdmin：允许用户在指定数据库中执行管理函数，如索引创建、删除，查看统计或访问system.profile
11. userAdmin：允许用户向system.users集合写入，可以在指定数据库里创建、删除和管理用户
12. clusterAdmin：只在admin数据库中可用，赋予用户所有分片和复制集相关函数的管理权限。
13. readAnyDatabase：只在admin数据库中可用，赋予用户所有数据库的读权限
14. readWriteAnyDatabase：只在admin数据库中可用，赋予用户所有数据库的读写权限
15. userAdminAnyDatabase：只在admin数据库中可用，赋予用户所有数据库的userAdmin权限
16. dbAdminAnyDatabase：只在admin数据库中可用，赋予用户所有数据库的dbAdmin权限。
17. root：只在admin数据库中可用。超级账号，超级权限

6、查看创建的用户
```
show users
或
db.system.users.find()
或
db.runCommand({usersInfo:"userName"})
```

7、修改密码
```
use admin
db.changeUserPassword("username", "xxx")
```

8、修改密码和用户信息
db.runCommand(
    {
        updateUser:"username",
        pwd:"xxx",
        customData:{title:"xxx"}
    }
)

9、删除数据库用户

```
use admin
db.dropUser('user001')
```

10、创建其他数据管理员

```
// 登录管理员用户
use admin
db.auth('admin','admin')
// 切换至db001数据库
use db001
// ... 増查改删该数据库专有用户
```

#### !!!重要的一步, 启用权限验证

```
mongo --auth
```
或者修改mongo.conf，最后一行添加
```
#启用权限访问
auth=true
```

11、重新启动mongodb

```
net stop mongodb;
net start mongodb;
```


1. 和用户管理相关的操作基本都要在admin数据库下运行，要先use admin;
2. 如果在某个单一的数据库下，那只能对当前数据库的权限进行操作;
3. db.addUser是老版本的操作，现在版本也还能继续使用，创建出来的user是带有root role的超级管理员。