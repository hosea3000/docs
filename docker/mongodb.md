### docker 安装 mongodb

#### 基本思路

我们将使用官方的 mongo:3.4 镜像（image），并将 27017 端口映射到主机端口，同时利用 Docker Volume 将数据库文件保存在主机上而非容器（container）中。

通过端口映射，可以直接连接主机的 27017 端口。比如如果你在使用一些 GUI 管理工具，不会有任何影响。

通过 Volume 将文件保存在主机，与容器分离，数据的使用与容器无关，所有针对数据的操作（比如备份、恢复）都不受影响。

#### 运行 mongo

```
$ docker run --name <YOUR-NAME> -p 27017:27017 -v /data/db:/data/db -d mongo:3.4 --auth
```

`—name` 指定库的名字，如果不指定会使用一串随机字符串。

`-p 27017:27017` 官方的镜像已经暴露了 27017 端口，我们将它映射到主机的端口上。如果你不使用默认端口，将 : 前面的数字改成自定义端口。

`-v /data/db:/data/db` 冒号前面的是主机上的文件路径，将它挂载到库中的文件夹下，实际对文件的读写就会在主机文件上操作。

`-d` 在后台运行。

`mongo:3.4` 指定镜像版本，默认是 latest 。建议总是自己指定版本。

`—auth` 以 auth 模式运行 mongo。

然后执行一下 `docker ps` 确认一下库已经正常运行起来。

```
$ docker exec -it <YOUR-NAME> mongo admin

> db.createUser({ user: '<USER>', pwd: '<PASSWORD>', roles: [ { role: 'userAdminAnyDatabase', db: 'admin' } ]});
Successfully added user: {
    "user" : "<USER>",
    "roles" : [
        {
            "role" : "userAdminAnyDatabase",
            "db" : "admin"
        }
    ]
}
```

以后想以管理员身份登入 mongo shell 就可以运行：

```
$ docker exec -it <YOUR-NAME> mongo -u <USER> -p <PASSWORD> --authenticationDatabase admin
```

现在我们就可以像本地安装的 mong 一样操作了。如果误删了数据库管理员，可以停掉正在运行的库，然后去掉 —auth 重新运行一个新库，登录进去新建用户即可。
