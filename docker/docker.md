## Docker

### 参考整理:

- [关于 Docker 入门，这一篇就够了](https://mp.weixin.qq.com/s/yfxq9fvfmi1jFddYUQ3rMQ)
- [一文零基础教你学会 Docker 入门到实践](https://mp.weixin.qq.com/s/S7ksqF8z4SYJvcG1DOupNA)
- [Node.js 服务 Docker 容器化应用实践](https://mp.weixin.qq.com/s/vTD63u6F1hQYZcMkoSaj6g)

### Docker 基础

#### Dockerfile

```shell
# Node.js 的 Alpine 版本
FROM node:lts-alpine

# 配置时区
RUN apk --update add tzdata \
    && cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime \
    && echo "Asia/Shanghai" > /etc/timezone \
    && apk del tzdata

// 创建目录
RUN mkdir -p /app

// 设置工作目录
WORKDIR /app

// 先 COPY package.json 用于执行 npm i
COPY ./package.json /app

// 以生产环境的形式安装包
RUN npm i --production --registry=https://registry.npm.taobao.org

// COPY 代码
COPY . /app

// 暴露的端口
EXPOSE 7001

// 启动时执行的命令
CMD EGG_SERVER_ENV=dev npm run docker
```

#### 创建 image

```shell
$ docker image build -t doceker-compose-demo-api:dev ./
```

#### 运行 image

```shell
$ docker run -d -p 3000:3000 voting/dev     // 前面是本地端口号, 后面是images 暴露的端口号
```

### 进入容器

```shell
$ docker exec -it service_develop /bin/ash
```

### 删除所有 none 的 images

```shell
$ docker rmi $(docker images | awk '/^<none>/ { print $3 }')
```

### 查看未运行的容器

```shell
docker ps --filter "status=exited"

docker ps -f "status=exited"
```

### 删除所有未运行的容器

```shell
#显示所有的容器，过滤出Exited状态的容器，取出这些容器的ID，
sudo docker ps -a|grep Exited|awk '{print $1}'

#查询所有的容器，过滤出Exited状态的容器，列出容器ID，删除这些容器
sudo docker rm `docker ps -a|grep Exited|awk '{print $1}'`
```

### 常用程序的启动

```powershell
docker run -p 27017:27017 -v /home/<user>/data:/data/db
```
