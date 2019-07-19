## 利用 scp 上传和下载服务器文件

1. 从服务器上下载文件
```shell
    scp username@servername:/path/filename
```
例如: `scp root@192.168.0.101:/root/shadowsocks_r_qr.png ~/Downloads`
把: `192.168.0.101上的/root/shadowsocks_r_qr.png`
下载到本地: `~/Downloads目录`

2. 上传本地文件到服务器
```shell
    scp /path/filename username@servername:/path
```
例如: `scp ~/Downloads/text.txt root@108.61.86.206:~/`
把本机: `~/Downloads/目录下的text.txt文件`
上传到: `108.61.86.206这台服务器上的~/目录中`

3. 从服务器下载整个目录
```shell
    scp -r username@servername:remote_dir/ local_dir/
```
例如: `scp -r codinglog@192.168.0.101 /home/kimi/test  /home/kimi/`

4. 上传目录到服务器
```shell
    scp  -r local_dir username@servername:remote_dir
```
例如：`scp -r test  codinglog@192.168.0.101:/var/www/`
把当前目录下的test目录上传到服务器的/var/www/ 目录