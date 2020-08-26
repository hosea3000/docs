## 基于 ssh key 的多账户切换

#### 生成 ssh key

```
ssh-keygen -t rsa -C "841611653@qq.com"
```

#### 添加 ssh key

为 GitHub 添加 ssh key
登录 GitHub 在账户 Settings > SSH and GPG keys > New SSH key > Add key 将之前生成的 ssh key 的 pub 文件中的内容粘贴进去，另一个账户也如法炮制。

#### 为本机添加 ssh key

```
ssh-add ~/.ssh/id_rsa
ssh-add ~/.ssh/id_rsa_work
```

#### 生成配置文件

```
touch ~/.ssh/config
```

写入内容

```
#Default GitHub
Host github.com
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_rsa

#Work GitHub
Host github.com-work
   HostName github.com
   User git
   IdentityFile ~/.ssh/id_rsa_work
```

#### 配置本地仓库

对于本地已存在的仓库，查看远端

```
git remote -v
```

添加/更改远端

```
# 添加
git remote add origin git@github.com-work:username/reponame.git

# 修改
git remote set-url origin git@github.com-work:username/reponame.git
```

或者直接修改 `.git/config` 文件中的 url

### 最后刷新或者新开 iterm 页面就可以使用了
