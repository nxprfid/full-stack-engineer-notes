# 前言
简单来说HA，就是一个低功耗的电脑（路由器或者NAS或者Linux单板机）上面专门运行一个Python3的程序。开源自动化控制管理平台。用户可以绑定各个品牌的物联网设备。编写自动化规则和脚本。根据设备状态、时间、传感器数据等触发特定动作。这个程序通过网络连接各个设备云平台，时时刻刻接受云平台传来的数据并可以控制。直接支持小爱同学语音控制比如美的的空调。（小米云端-本地（HA）-美的云端）定制部分：可以创建一系列规则。达到“互联互通”。还可以将所有设备通过桥接连接到HomeKit（云端-本地（HA）-本地（苹果中枢）），使用Siri控制。
![alt text](image-3.png)
教程连接：https://www.bilibili.com/opus/440062456525682264  
# NAS
NAS（Network Attached Storage）网络附加存储，主要用于存储大量数据，如照片、视频、音乐、文档等。NAS通常安装在服务器上，通过网络访问，可以实现文件共享、远程备份、远程访问等功能。NAS的优点是安全、便捷、经济，缺点是成本高、可靠性差、易捷性差。

第一步，按照我说的光纤连入光猫，光猫连接路由器，路由器连接你的设备。

第二步，你要知道你光猫和自己路由器的后台地址，和用户名、密码。

第三步，先登录路由器的后台地址，输入用户名和密码

第四步，找到你路由器的端口转发（每个路由器都不一样），也有叫端口映射、虚拟服务器

第五步，找到你设备的服务端口，将其转出去。你设备服务端口就是内部端口，转出去的端口就是外部端口

第六步，登录你的光猫，找到端口转发

第七步，同样设置端口转发，之前的外部端口就是现在的内部端口，转出去，在外网访问的端口就是外部端口，建议设置5位。

所以我们需要智能家居，传感器，NAS等等都在这个二级网络当中，所有的交互都交给Home Assistant，我们只需要把Home assistant的端口转出去就行了（这块在Home Assistant安装教程中会讲）或者桥接模式。
# Home Assistant安装和基础设置 
## Windows 安装HA
![alt text](image-10.png)
![alt text](image-11.png)
1、其他NAS系统下使用docker container的官方详细文档：https://www.home-assistant.io/installation/alternative#install-home-assistant-container

2、Linux下使用docker container的官方详细文档：https://www.home-assistant.io/installation/linux#install-home-assistant-container  

拉取镜像命令：
docker pull homeassistant/home-assistant:stable

运行镜像命令：
docker run -d -p 8123:8123 homeassistant/home-assistant:stable

docker官网：
https://docs.docker.com/  

home assistant官网：
https://www.home-assistant.io/  



![alt text](image-4.png)  
HA版本
Supervised需要Debian12

## 拿到KEY、IP、Token

HACS（Home Assistant Community Store）这就是Home assistant 的应用插件商店，以后都需要用到这个。

以后安装第三方的内容只需要分清楚intergration集合还是frontend前端UI即可。 
基本上插件、主题都是frontend；设备、卡片、API基本上都是intergation。 

HomemeKit Bridge插件连接到苹果生态

# 安装 Docker
Docker 官方的提供的安装文档链接如下所示：  
Debian 系统: https://docs.docker.com/engine/install/debian/  
Ubuntu 系统: https://docs.docker.com/engine/install/ubuntu/  
1. 卸载老版本的 Docker 安装包叫做 docker、docker.io 或者 docker-engine：  
`sudo apt-get remove -y docker docker-engine docker.io containerd runc`

2. 添加 docker 官方的软件仓库
   
   Debian 系统使用的命令如下所示
   ```
   sudo apt update  
   sudo apt-get install -y ca-certificates curl gnupg lsb-release

   curl -fsSL https://download.docker.com/linux/debian/gpg | \
   sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

   echo "deb [arch=$(dpkg --print-architecture) \
   signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] \
   https://download.docker.com/linux/debian \
   $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

   ```
   Ubuntu 系统使用的命令如下所示
   ```
   sudo apt update
   sudo apt-get install -y ca-certificates curl gnupg lsb-release

   curl -fsSL https://download.docker.com/linux/ubuntu/gpg | \
   sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

   echo "deb [arch=$(dpkg --print-architecture) \
   signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] \
   https://download.docker.com/linux/ubuntu \
   $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
   ```
3. 安装 Docker Engine  
`sudo apt update`  
`sudo apt install -y docker-ce docker-ce-cli containerd.io`
   >Debian Buster 安装完后如果报错请输入下面的命令来解决：  
   echo 1 | update-alternatives --config iptables > /dev/null  
   sudo systemctl restart docker

4. 将当前用户加入到 docker 用户组，这样不需要 sudo 就能运行 docker 命
令  
`sudo usermod -aG docker $USER`  
重启系统  

5. 验证 docker 的状态  
`systemctl status docker`  
可以使用下面的命令测试下 docker，如果能运行 hello-world 说明 docker 能正常  
使用  `docker run hello-world`  

6. 设置 docker 仓库为国内源的方法  
创建 /etc/docker/daemon.json 文件，在其中加入下面的配置    
`sudo vim /etc/docker/daemon.json`  
```
{
"registry-mirrors": [ 
   "https://docker.mirrors.ustc.edu.cn"
]
}
```
7. 重启下 docker 服务
`sudo systemctl restart docker`
## Orange Pi SDK编译后镜像 安装 Docker
Orange Pi 提供的linux镜像已经预装了Docker，只是Docker服务默认没有打开。  
使用enable_docker.sh 脚本可以使能docker 服务，然后就可以开始使用docker命令了，并且在下次启动系统时也会自动启动docker服务。  
`enable_docker.sh`  
`docker run hello-world`  
使用docker命令时，如果提示permissiondenied，请将当前用户加入到docker用户组，这样不需要sudo就能运行docker命令了。  
orangepi@orangepi:~$ `sudo usermod-aG docker $USER`  

# Linux派安装HA
## 通过 docker 安装HA（Container）
Ubuntu 或者 Debian 系统中安装 Home Assistant 的方法:
1. 搜索下 Home Assistant 的 docker 镜像
`docker search homeassistant`
2. 然后使用下面的命令下载 Home Assistant 的 docker 镜像到本地，镜像大小大概有
1GB 多，下载时间会比较长，请耐心等待下载完成
`docker pull homeassistant/home-assistant`
3. 然后可以使用下面的命令查看下刚下载的 Home Assistant 的 docker 镜像
`docker images homeassistant/home-assistant`
4. 运行 Home Assistant 的 docker 容器了
   ```
   docker run -d \ 
   --name homeassistant \ 
   --privileged \ 
   --restart=unless-stopped \ 
   -e TZ=Asia/Shanghai \ 
   -v /home/orangepi/home-assistant:/config \
   --network=host \
   homeassistant/home-assistant:latest
   ```
5. 在浏览器中输入【开发板的 IP 地址:8123】就能看到 Home Assistant 的界面
6. 停止 Home Assistant 容器的方法
   
         docker ps -a
         停止
         docker stop homeassistant
         删除
         docker rm homeassistant

## 通过 Python 安装HA（Core）
1. 首先安装依赖包
   ```bash
   sudo apt-get update

   sudo apt-get install -y python3 python3-dev python3-venv \
   python3-pip libffi-dev libssl-dev libjpeg-dev zlib1g-dev autoconf build-essential \
   libopenjp2-7 libtiff5 libturbojpeg0-dev tzdata
   ```
   如果是debian12或Ubuntu24.04 请使用下面的命令：  
   ```bash
   sudo apt-get update

   sudo apt-get install -y python3 python3-dev python3-venv \
   python3-pip libffi-dev libssl-dev libjpeg-dev zlib1g-dev autoconf build-essential \
   libopenjp2-7 libturbojpeg0-dev tzdata
   ```
2. 编译安装 Python3.9  
Debian Bullseye 默认的 Python 版本就是 Python3.9，所以无需编译安装。
Ubuntu Jammy 默认的 Python 版本就是 Python3.10，所以也无需编译安装。

3. 创建 Python 虚拟环境  
UbuntuNoble中是python3.12，因此下面命令中的python版本号请修改
为“3.12”，其他的不同linux版本请根据实际情况更改对应的命令。
   ```
   sudo mkdir /srv/homeassistant
   sudo chown orangepi:orangepi /srv/homeassistant
   cd /srv/homeassistant
   python3.9 -m venv .
   source bin/activate
   ```
4. 安装需要的 Python 包  
`python3 -m pip install wheel`
5. 安装 Home Assistant Core  
`pip3 install homeassistant`
6. 运行 Home Assistant Core  
`hass`
1. 在浏览器中输入【开发板的 IP 地址:8123】就能看到 Home Assistant 的界面


## 安装HA （Supervised）

supervised-installer：https://github.com/home-assistant/supervised-installer  
教程：https://www.leetoutou.xyz/Orange-Pi-Zero3-Home-Assistant-Supervised-a4b404b8d17444f7b190e585b61299ed  
https://golden-objective-bb6.notion.site/OrangePi-Zero3-eb773d84888e4c85bc2a0d69300f5eb3?pvs=4
```bash
ssh root@192.168..
sudo apt-get update
```
1. 使用此命令安装以下依赖项：
```bash
sudo apt install \
apparmor \
bluez \
cifs-utils \
curl \
dbus \
jq \
libglib2.0-bin \
lsb-release \
network-manager \
nfs-common \
systemd-journal-remote \
systemd-resolved \
udisks2 \
wget -y
#然后重启
reboot
ssh root@192.168..
```
2. 使用以下命令安装 Docker-CE：
`curl -fsSL get.docker.com | sh`
3. 安装 OS-Agent：
https://github.com/home-assistant/os-agent/releases/latest
![alt text](image-55.png)
复制链接地址：https://github.com/home-assistant/os-agent/releases/download/1.6.0/os-agent_1.6.0_linux_aarch64.deb

使用`wget`+网址下载  
`wget https://github.com/home-assistant/os-agent/releases/download/1.6.0/os-agent_1.6.0_linux_aarch64.deb`  

`sudo dpkg -i os-agent_1.6.0_linux_aarch64.deb`
> 对AppArmor做一个设置（应用盔甲）
> 根据每一个应用做一些权限上的管理
> 将启动配置的参数加到我们香橙派的一个启动参数里面

`sudo vim /boot/cmdline.txt`
```
apparmor=1 security=apparmor
```
按键盘上的ESC键，输入英文的冒号，再输入wq后回车

编辑/etc/default/grub文件

对CGroup做一个设置
`sudo vim /etc/default/grub`
```
systemd.unified_cgroup_hierarchy=false
```
按键盘上的ESC键，输入英文的冒号”:“，再输入”wq”后回车

重启reboot

4. 安装 Home Assistant Supervised Debian 软件包：  
`wget -O homeassistant-supervised.deb https://github.com/home-assistant/supervised-installer/releases/latest/download/homeassistant-supervised.deb`

修改主机的一个名称，名称不对是无法安装的。
`sudo vim /etc/os-release`

PRETTY_NAME="Orange Pi 1.0.4 Bookworm"改为
`PRETTY_NAME="Debian GNU/Linux 12 (bookworm)"`
![alt text](image-56.png)


`apt install ./homeassistant-supervised.deb`
![alt text](image-57.png)
>如果最后没有弹出那个选择架构就会有问题，需要自己手动操作一下/etc/hassio.json 的 arm64 示例
```yaml
{
“supervisor”： “ghcr.io/home-assistant/aarch64-hassio-supervisor”，
“machine”： “qemuarm-64”，
“data”： “/usr/share/hassio”
}
```
Supervisor的版本如果加载项商店空白，多半是github拉取失败了，重新clone一份即可。
```bash
docker exec -it hassio_supervisor /bin/bash
cd ./data/addons/core
不行就是
cd ./data/addons
git clone https://github.com/home-assistant/addons
reboot重启
```
## 安装HACS
以下内容为Home Assistant加载项中Terminal&SSH输入

![alt text](image-58.png)
```bash
wget -q -O - https://install.hacs.xyz | bash -
#下载失败换HACS极速版
wget -O - https://hacs.vip/get | bash -
reboot
#安装Xiaomi_miot加载项
wget -O - https://get.hacs.vip | DOMAIN=xiaomi_miot bash -
#重启
reboot
```
以此左下角【配置】-【设备与服务】-【添加集成】，搜索HACS，选择安装
安装过程需要在github中进行设备激活，按照引导授权激活即可
安装完成后再Home Assistant侧边栏菜单看到HACS了

# Home Assistant使用
如果无法使用以太网线将树莓派与电脑连接到同一局域网下，可以在 Home Assistant 启动前配置 Wi-Fi（不推荐，建议使用以太网线）。在 SD 卡创建文件夹和文件： CONFG -> network -> my-network。在 my-network 中配置 SSID 和 密码：
```
[connection] 
id=my-network 
uuid=72111c67-4a5d-4d5c-925e-f8ee26efb3c3 
type=802-11-wireless 

[802-11-wireless] 
mode=infrastructure 
ssid="SSID" 
# Uncomment below if your SSID is not broadcasted 
#hidden=true 

[802-11-wireless-security] 
auth-alg=open 
key-mgmt=wpa-psk 
psk=密码

[ipv4] 
method=auto 

[ipv6] 
addr-gen-mode=stable-privacy 
method=auto 
```
注意：如果 Home Assistant 已经完成了初始化配置则以上⽅式⽆法⽣效，确保文件内容是 UNIX 格式  

http://homeassistant.local:8123/
或者 IP地址:8123  

登录命令端口 IP地址:7681  
## MQTT
![alt text](image-7.png)
![alt text](image-8.png)
![alt text](image-59.png)
![alt text](image-9.png)

```
xiaomi_lamp/control
{"input":"Turn On the Lemp","siteId":"esp32"}
```
# Home Assistant插件
![alt text](image-5.png)
![alt text](image-6.png)

![alt text](image-12.png)
基本上插件、主题都是frontend；设备、卡片、API基本上都是intergation  

intergation对应的目录是custom_components
frontend对应的目录是www里面的community
## 米家官方集成
https://pan.quark.cn/s/206adbaa7d2e  

github项目地址：https://github.com/XiaoMi/ha_xiaomi_home/blob/main/doc/README_zh.md  

补充：
1、其他NAS系统下使用docker container的官方详细文档：https://www.home-assistant.io/installation/alternative#install-home-assistant-container  
2、Linux下使用docker container的官方详细文档：https://www.home-assistant.io/installation/linux#install-home-assistant-container  
3、MacOS和Windows系统下目前没有关于docker container的官方详细文档。  
## ⽶家设备接⼊---Xiaomi Gateway3
1. 进⼊HA界⾯中，找到“配置 – 设备与服务”  
2. 点击“添加集成”在搜索栏中输⼊“xiaomi”并找到“Xiaomi Gateway 3”。  
3. 在新对话框中选择“Add Mi Cloud Account”并点击“提交”.  
4. 输⼊⼩⽶id或邮箱（不是⼿机号）及密码。  
5. 点击添加集成，选择接⼊的⽹关，我这⾥是⼩⽶多模⽹关2，然后提交。  
6. 提交后可⾃动获取token,直接点击提交就可以。  

## ⽶家设备接⼊---Xiaomi Miot Auto
1. 进⼊HA界⾯中，找到“配置 – 设备与服务”  
2. 点击“添加集成”在搜索栏中输⼊“xiaomi”并找到“Xiaomi Miot Auto”。  
3. 在新对话框中选择“Add devices using Mi Account”账号集成并点击“提交”。  
4. 依次输⼊⼩⽶的账户，密码。注意账户是⼩⽶的ID或者邮箱，不是⼿机号。设备连接模式默认⾃动模式就可以，填好后，点击提交。  
5. 默认直接提交就⾏。  
简单解释下：如果选择”Exclude(排除)”的话，下⾯的设备列表中，勾选的设备，
不会出现在homeassistant中。如果选择include(包含)，设备列表中选中的会加⼊
homeassistant。选择后，点提交。  
（不知道怎么选择的话，都⽤默认即可。因为默认的是最通⽤的⽅案）  
![alt text](image-17.png)  
6. 点提交后，等⼀会，⼩⽶的设备会陆陆续续的出现，点击完成后，⼩⽶的设备会出现左侧【概览】⾥⾯。⾄此⼩⽶的设备添加就完成了。  

## HA平台设备转接到homekit中
HA 平台的设备转接到homekit，需要按照实体来转接，并不是由⼀个设备来转接，这与我们平时的认知，可能有点差别，这个需要⼤家注意⼀下。  
⼀、与HomeKit配对  
1. 配置--设备与服务--右下⻆的添加集成--搜索apple  
2. 点击右下⻆添加集成----搜索apple--选择HomeKit Bridge  
3. 选择要包含的域  
4. 点击【提交】,完成  
5. 点击左侧【通知】，会有⼆维码，，然后打开苹果家庭，扫码添加。  
![alt text](image-18.png)  

### 添加实体时如何知道设备所属的域
配置---设备服务---实体---找到想要的实体  
单击--选择右上⻆的⻮轮--单击，即可看到所属的域  
![alt text](image-19.png)  
![alt text](image-20.png)  
### 如何排除Homekit ⾥⾯的homeassistant 设备
1. 依次点击配置--设备与服务  
2. 找到之前添加过的homekit 集成。点击选项。  
3. 点击提交  
![alt text](image-21.png)  
4. 下拉框，选择想要删除的设备  
⽐如选择删除灯带，选择提交  
![alt text](image-22.png)  
5. 提交，等⼀会，这个灯带在homekit便不显示了  

### 家居中枢

## 原生HomeKit设备接⼊HA
先加入Homekit，然后删除，就能发现添加了。


## 美的设备接⼊
HACS搜索 `midea_ac_lan`  
项目地址：https://github.com/georgezhao2010/midea_ac_lan   
需要⼿动安装可在浏览器输⼊：  

      https://my.home-assistant.io/redirect/hacs_repository/?owner=georgezhao2010&repository=midea_ac_lan&category=integration

重启后打开设置 - 设备与服务 - 添加集成   
输⼊ midea  
![alt text](image-13.png)   
点击 - 提交 - 提交（默认 auto 即可）  
正常情况下会发现新设备  
输⼊ 美的 账号密码，切换对应使⽤的 APP，这⾥是“美的美居”  
修改 设备名称一路提交即可  
# HomeAssistant对接蓝⽛⾳箱
将USB蓝⽛适配器接到HA盒⼦的usb⼝  
IP地址:7681  
```bash
login
bluetuith
```
⽅向键上下可以选择想要连接的蓝⽛  
t 信任设备
P 配对设备
c 连接设备
q 退出

重新加载家庭助理⾳频更新信息  
`ha audio reload`  
查看有关家庭助理⾳频设备的信息  
`ha audio info`    
![alt text](image-14.png)    
家庭助⼿⻚⾯安装VLC  
配置----加载项---加载项商店—VLC  
安装成功后配置  
![alt text](image-15.png)  
将VLC设置为某个区域的播放器   
配置—设备与集成---core-vlc—配置---如果全域⽆需选择区域完成即可  
媒体----右下⻆可以选择vlc播放了  
![alt text](image-16.png)  

# 需要使用小爱同学等其他音响
请看：https://github.com/larry-wong/bemfa  

# ZigBee设备接⼊
注意Zigbee Home Automation（简称ZHA）与Zibee2mqtt不能同时使⽤，只能开启⼀个！！！  
注意如果您只有⼀个协调器，Zigbee Home Automation（简称ZHA）与Zibee2mqtt不能同时使⽤⼀个设备，只能开启⼀个！！！  
## zigbee2mqtt配置
### 安装Zigbee2MQTT
仓库需要添加Zigbee2MQTT  
配置--加载项--加载项商店  
找到仓库  
![alt text](image-23.png)  
添加插件地址，将下⾯的地址复制即可(冬⽠仓库)  
https://gitcode.com/waxgourd/addons  
也可以使⽤官⽅仓库：  
https://github.com/zigbee2mqtt/hassio-zigbee2mqtt  
刷新⼀下浏览器，然后就可在加载商店搜索安装了（我这⾥使⽤的是冬⽠仓库）  
![alt text](image-24.png)  

### 配置Mosquitto broker
安装后，不要启动，先进⾏配置  
配置--加载项--Mosquitto broker  
```
username: user
password: passwd
```
复制上⾯语句，⽤户名和密码根据⾃⼰情况更改，粘贴后保存  
![alt text](image-25.png)  
配置Zigbee2MQTT  
![alt text](image-26.png)  
port: /dev/ttyUSB0  

### 启动Zigbee2MQTT
将协调器接⼊盒⼦，查看是否成功接⼊：配置--系统--硬件--全部硬件---搜索usb0  
![alt text](image-27.png)  
如果没有查到，说明设备没有接⼊，检查设备接情况，重新插⼊  
![alt text](image-28.png)  
打开webUI即可  
点击允许添加新设备（所有）  
此时可以将要添加的设备调到配对状态，然后就可以搜索到  
![alt text](image-29.png)  
## Zigbee Home Automation配置
1. 将协调器接⼊盒⼦，查看是否成功接⼊：配置--系统--硬件--全部硬件---搜索usb0  
![alt text](image-30.png)  
如果没有查到，说明设备没有接⼊，检查设备接情况，重新插⼊  
2. 集成安装  
配置--设备与服务--添加集成-输⼊zha进⾏搜索  
![alt text](image-31.png)  
 ⽹络构成，⼀般选择删除⽹络设置并创建新⽹络（根据⾃⼰实际情况选择）  
![alt text](image-32.png)  
3. 添加设备  
进⼊集成  
![alt text](image-33.png)  
![alt text](image-34.png)  
设置要添加的设备处于配对状态，即可被发现  
![alt text](image-35.png)  

# Home Assistant的UI设计
在HomeAssistant文件中新建themes文件夹，这是用来存放主题的。然后在www文件夹下新建images文件夹，用来存放图片资源。  

在根文件夹下有三个yaml，分别是：configuration.yaml、customize.yaml、ui-lovelace.yaml。  

编码修改为UTF-8  
需要加载customize就需要添加这两行代码，缩进是两个空格。  
![alt text](image-36.png)  
如果需要加载ui-lovelace，就需要添加这两行代码，使用主题要修改对应的mode    
![alt text](image-37.png)  

![alt text](image-38.png)  

输入/local/community/你新建文件夹的名字  

![alt text](image-39.png)  
![alt text](image-40.png)  
![alt text](image-41.png)  
![alt text](image-42.png)  
![alt text](image-43.png)  
![alt text](image-44.png)  
![alt text](image-45.png)  
![alt text](image-46.png)  
![alt text](image-47.png)  

frontpage这个文件夹内就是首页展示的内容  
![alt text](image-69.png)
# Home Assistant备份和升级&导入DIY主题
![备份](image-48.png)  
![alt text](image-49.png)  
![alt text](image-50.png)  
![alt text](image-51.png)  

www下不要全部复制  
![alt text](image-52.png)  
![alt text](image-53.png)  
![alt text](image-54.png)  

# DIY设备ESPHome接入HA  
ESPHome：
官方网址：https://esphome.io/

![alt text](image-60.png)  
确保选中“将Python添加到PATH”，然后一直通过 安装
安装后重新启动计算机
```python
pip3 install wheel
pip3 install esphome
```
安装都完成后，进入你要存放的路径创建esphome_config
```bash
启动：
cd C:\ESPHome\
执行esphome  dashboard esphome_config/
http://127.0.0.1:6052/

或者使用批处理脚本：

cd /d "C:\ESPHome"
esphome dashboard esphome_config/
pause

名称保存为start_esphome_dashboard.bat
```

打开网址：http://172.0.0.1:6052/
创建一个设备  
![alt text](image-61.png)  
![alt text](image-62.png)  
会编译一段默认初始代码  
![alt text](image-63.png)  
选择右下角的下载，选择蓝色字样的链接，可以弹出网页进行下载  
第一次是通过串口进行下载，后续就可以使用网络进行升级  
![alt text](image-64.png)  
修改源码   
ESPHome使用yaml语言来编码  
![alt text](image-65.png)  
![alt text](image-66.png)
![alt text](image-67.png)
![alt text](image-68.png)
选择设备所在区域就完成添加了  
访问ESPHome参考代码
```yaml
----------------------------------------------------------------------------------
共阳极RGB灯yaml程序：

light:
  - platform: rgb
    name: "RGB Light"
    red: output_red
    green: output_green
    blue: output_blue
    restore_mode: ALWAYS_ON  # 设备启动后恢复为上次状态

# Define light with inverted PWM output (for common anode RGB)
output:
  - platform: ledc
    pin: GPIO4           # 红灯的引脚
    id: output_red
    inverted: true        # 反转输出

  - platform: ledc
    pin: GPIO5          # 绿灯的引脚
    id: output_green
    inverted: true        # 反转输出

  - platform: ledc
    pin: GPIO6           # 蓝灯的引脚
    id: output_blue
    inverted: true        # 反转输出    

----------------------------------------------------------------------------------

摄像头程序yaml程序：

代码参考：https://esphome.io/components/esp32_camera.html
安装git：  https://git-scm.com/downloads/win
组件下载：https://github.com/MichaKersloot/esphome_custom_components

cd C:\ESPHome\esphome_config
git clone https://github.com/MichaKersloot/esphome_custom_components.git

external_components:
  - source:
      type: local
      path: esphome_custom_components\components
    components: [ esp32_camera ]

esp32_camera:
  external_clock:
    pin: GPIO15
    frequency: 20MHz
  i2c_pins:
    sda: GPIO4
    scl: GPIO5
  data_pins: [GPIO11, GPIO9, GPIO8, GPIO10, GPIO12, GPIO18, GPIO17, GPIO16]
  vsync_pin: GPIO6
  href_pin: GPIO7
  pixel_clock_pin: GPIO13

  # Image settings
  name: My Camera
  # ...

----------------------------------------------------------------------------------
DHT11温湿度传感器yaml程序：

sensor:
  - platform: dht
    pin: GPIO23
    temperature:
      name: "Living Room Temperature"
    humidity:
      name: "Living Room Humidity"
    update_interval: 60s

-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------

WS2812彩灯yaml程序：

代码参考：https://esphome.io/components/light/index.html


# 定义 FastLED WS2812 灯光组件
light:
  - platform: fastled_clockless
    chipset: WS2812
    pin: GPIO14  # 替换成你的LED数据线连接的GPIO口
    num_leds: 16
    rgb_order: GRB
    name: "WS2812 Ring"

    effects:
      #彩虹效果
      - addressable_rainbow:
          name: "Rainbow Effect"
          speed: 10
          width: 16

      #闪烁效果
      - flicker:
          name: Flicker Effect With Custom Values
          alpha: 95%
          intensity: 1.5%

      #灯光效果
      - random:
          name: "My Slow Random Effect"
          transition_length: 30s
          update_interval: 30s
      - random:
          name: "My Fast Random Effect"
          transition_length: 4s
          update_interval: 5s


```
# 文件管理目录结构
![alt text](image.png)  

1. 文件夹的管理和命名:日期和项目内容来命名，
例如：2024-06-20_五月天演唱会
![alt text](image-2.png)
1. 每个文件夹前加上数字，分类成9项，工程文件，原始素材，素材，特效，字幕，导出，通用素材，封面，归档）
2. 文件命名:交代素材信息，时间+机型+机位，  
   ![alt text](image-1.png)
3. 导出成片命名:时间_片名_分辨率_编码格式_导出人_备注_版本
数据备份：
三备、二介、异地
烤卡软件推荐
推荐软件:Gate或者Kocard（都是免费的）Silverstack（收费，专业）
1.Gate
https://www.ysjf.com/gate
2.Kocard
http://www.kocard.net/

