### Golang-执行go get私有库提示”410 Gone“ 解决办法

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
