## volume

### 在容器中挂载一个image里面系统的目录
```shell
docker run -d --name nginx-volume -v /usr/share/nginx/html nginx
docker inspect nginx-volume
```

### 在容器中挂载本地目录
```shell
docker run -p 80:80 -d -v $PWD/html:/usr/share/nginx/html nginx
```

### 创建一个只有数据的容器, 把这个容器当成volume挂载到其他容器

```shell
// 创建一个空的容器挂载本地目录
docker create -v $PWD/data:/var/mydata --name data-container   ubuntu

// 运行一个容器挂载之前的容器
docker run -it  --volumes-from data-container ubuntu /bin/bash
    cd /var/mydata // 在容器里面可以找到之前挂载的目录
    touch whatever.txt // 在里面创建一个问题

// 在本地目录也能看到这样一个文件
cd data & ls // whatever.txt

```

### 进入容器
```shell
docker exec -it service_develop /bin/ash
```

### docker-compose 多容器


### 删除所有 none 的 images
```shell
docker rmi $(docker images | awk '/^<none>/ { print $3 }')
```

```
docker run -d --name=$CONTAINER_NAME --rm -p $RUN_PORT:$EXPOSE_PORT $IMAGE_NAME:$BRANCH_NAME
```

```
docker run -d --name=saas-saas-api-logtest --rm -p 7111:7002 -v /home/gitlab-runner/logs/feature_v3_4_2:saas-api:/root/logs  saas/saas-api:feature_v3_4_2
```