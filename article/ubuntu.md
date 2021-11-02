## 新装 Ubuntu 服务器

### 安装 oh-my-zsh


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