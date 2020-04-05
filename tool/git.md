### 一台电脑如何使用多个 github 帐号
1、`cd ～/.ssh` 在此目录下，执行`ssh-keygen -t rsa -C "luguicheng_private@163.com"` (注：第一个填写你要保存的路径，第二个填你的密码) 生成第一个 ssh key

2、执行`ssh-keygen -t rsa -C "luguicheng_work@163.com"` (注：第一个填写你要保存的路径，第二个填你的密码) 生成第二个 ssh key

3、执行这两个命令：`ssh-add ~/.ssh/id_rsa_lgc`，`ssh-add ~/.ssh/id_rsa_lgc` ,过程需要填写密码，填写刚刚步骤1的密码即可。

- 可以使用`ssh-add -l`查看添加成功与否
- `ssh-add -D`清除所有`ssh-add`添加的选项

4、在 `~/.ssh`路径下的config文件配置好 Host, 在`~/.ssh`路径下执行ls查询是否有config文件，没有则执行touch config 新建一个

```
Host luguicheng.github.com
     HostName github.com
     PreferredAuthentications publickey
     IdentityFile ~/.ssh/id_rsa_luguicheng

Host lgc.github.com
     HostName github.com
     PreferredAuthentications publickey
     IdentityFile ~/.ssh/id_rsa_lgc

```

5、把刚刚生成的两个ssh key 分别关联到两个github帐号中

6、`ssh -T git@lgc.github.com`，`ssh -T git@luguicheng.github.com` 查询是否关联成功