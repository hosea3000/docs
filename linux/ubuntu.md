## 新装 Ubuntu 服务器

### 安装 oh-my-zsh
```

apt install zsh

sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"

// 如果速度慢可以使用 https://ghproxy.com/
```

### 安装 tmux
```
sudo apt install tmux
```

### 安装 node.js
```
1.替换源(16为node版本)
curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash -

2. 安装 node
sudo apt-get install -y nodejs

3. 安装 yarn
curl -sL https://dl.yarnpkg.com/debian/pubkey.gpg | gpg --dearmor | sudo tee /usr/share/keyrings/yarnkey.gpg >/dev/null

echo "deb [signed-by=/usr/share/keyrings/yarnkey.gpg] https://dl.yarnpkg.com/debian stable main" | sudo tee /etc/apt/sources.list.d/yarn.list

sudo apt-get update && sudo apt-get install yarn
```


### 安装 docker
```
1. docker 

curl -fsSL https://get.docker.com | bash -s docker --mirror Aliyun

2. 安装 docker-compose

sudo curl -L "https://ghproxy.com/https://github.com/docker/compose/releases/download/1.25.5/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

sudo chmod +x /usr/local/bin/docker-compose

docker-compose --version

```

#### 怎么解决docker需要sudo才能运行的问题？
```
Create the docker group if it does not exist
$ sudo groupadd docker

Add your user to the docker group.
$ sudo usermod -aG docker $USER

Run the following command or Logout and login again and run (that doesn't work you may need to reboot your machine first)
$ newgrp docker

Check if docker can be run without root
$ docker run hello-world

Reboot if still got error
$ reboot

```