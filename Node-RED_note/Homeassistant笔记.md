NAS（Network Attached Storage）网络附加存储，主要用于存储大量数据，如照片、视频、音乐、文档等。NAS通常安装在服务器上，通过网络访问，可以实现文件共享、远程备份、远程访问等功能。NAS的优点是安全、便捷、经济，缺点是成本高、可靠性差、易捷性差。

第一步，按照我说的光纤连入光猫，光猫连接路由器，路由器连接你的设备。

第二步，你要知道你光猫和自己路由器的后台地址，和用户名、密码。

第三步，先登录路由器的后台地址，输入用户名和密码

第四步，找到你路由器的端口转发（每个路由器都不一样），也有叫端口映射、虚拟服务器

第五步，找到你设备的服务端口，将其转出去。你设备服务端口就是内部端口，转出去的端口就是外部端口

第六步，登录你的光猫，找到端口转发

第七步，同样设置端口转发，之前的外部端口就是现在的内部端口，转出去，在外网访问的端口就是外部端口，建议设置5位。

所以我们需要智能家居，传感器，NAS等等都在这个二级网络当中，所有的交互都交给Home Assistant，我们只需要把Home assistant的端口转出去就行了（这块在Home Assistant安装教程中会讲）
或者桥接模式
Docker安装和基础设置 

## 拿到KEY、IP、Token

HACS（Home Assistant Community Store）这就是Home assistant 的应用插件商店，以后都需要用到这个。

以后安装第三方的内容只需要分清楚intergration集合还是frontend前端UI即可。 
基本上插件、主题都是frontend；设备、卡片、API基本上都是intergation。 

HomemeKit Bridge插件连接到苹果生态
## 安装
![alt text](image-3.png)
 1、其他NAS系统下使用docker container的官方详细文档：https://www.home-assistant.io/installation/alternative#install-home-assistant-container

2、Linux下使用docker container的官方详细文档：https://www.home-assistant.io/installation/linux#install-home-assistant-container

「苹果控制米家设备-home assistant」
链接：https://pan.quark.cn/s/0c3046ddb3e6Home assistant 稳定版

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
## 目录结构

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