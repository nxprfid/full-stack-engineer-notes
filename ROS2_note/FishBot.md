# ROS2
![alt text](image-9.png)
核心是通讯（稳定、安全、实时的通讯能力）
ROS2文档：
http://docs.ros.org/en/humble/Releases.html

![alt text](image-10.png)
## 右手法则
![alt text](image-11.png)
>我们开发板的Z轴朝上，X轴朝前，此时Y轴应该朝左。接着摊开右手手掌，用大拇指朝向轴的方向，比如朝向X轴，然后握起手掌，那么你握的方向就是正方向。
# ROS2-MicroROS
通讯协议依赖与Agent  

![alt text](image-12.png)
>所谓Agen其实就是一个代理，微控制器可以通过串口，蓝牙、以太网、Wifi等多种协议将数据传递给Agent，Agent再将其转换成ROS2的话题等数据，以此完成通信。
通过RCLC-API调用MicroROS

![alt text](image-13.png)  

串口运行Agent服务

    sudo docker run -it --rm -v /dev:/dev -v /dev/shm:/dev/shm --privileged --net=host microros/micro-ros-agent:$ROS_DISTRO serial --dev /dev/ttyUSB0 -v6
UDP启动Agent服务  

    sudo docker run -it --rm -v /dev:/dev -v /dev/shm:/dev/shm --privileged --net=host microros/micro-ros-agent:$ROS_DISTRO udp4 --port 8888 -v6
### 服务通讯
![alt text](image-17.png)  
![alt text](image-18.png)
## 使用FishBotROS2OS随身系统  
开机时按下F8键（F11）进入启动设备选择界面  
密码fish进入  
等待脚本完成输入fishinstall  
即可使用ros2命令  
## 使用虚拟机Ubuntu22.04
安装VsCode  
安装PIO（仅适用Ubuntu22.04系统，非该系统请直接跳过）  
安装Docker  

    wget http://fishros.com/install -O fishros && . fishros  
    或
    wget http://fishros.com/install -O fishros && bash fishros 

## 使用platformio
![alt text](image-3.png)

![alt text](image-2.png)
四步新建工程  
1. 输入工程名 example01_helloworld  
2. 选择开发板，这里选择Adafruit ESP32 Feather  
3. 选择开发框架，这里我们用Arduino，PIO还支持IDF（IoT Development FrameWork） 
4.  开发位置可以选择默认的位置，也可以自定义位置  
   
![alt text](image-4.png)

### platformio.ini文件设置
将单片机的主频提高到240MHZ的主频。  
    board_build.f_cpu = 240000000L  
通过修改配置文件，可以修改Serial Monitor的默认波特率。  
    monitor_speed = 115200
```
[env:featheresp32]
platform = espressif32
board = featheresp32
framework = arduino
board_microros_transport = wifi
board_build.f_cpu = 240000000L
monitor_speed = 115200
lib_deps = 
	adafruit/Adafruit SSD1306@^2.5.7
	adafruit/Adafruit GFX Library @ ^1.11.10
	https://github.com/rfetick/MPU6050_light.git
	adafruit/Adafruit BusIO@^1.16.1
    SPI
    Wire
	https://gitee.com/ohhuo/micro_ros_platformio.git
	paulstoffregen/Time@^1.6.1
```
## 加载库的三种方法：
1. 在PlatformIO左侧的项目管理器中点击Libraries，搜索你想要的库，点击Add to Project加入到你的工程中。
2. 通过GIT地址安装。直接在platformio.ini文件中添加lib_deps参数，指定库的GIT地址。
![alt text](image-7.png)  
3. 手动克隆到lib目录  
![alt text](image-8.png)  
## 运行第一个机器人
需要三个终端分别运行  

    ros2 run turtlesim turtlesim_node  
    ros2 run turtlesim turtle_teleop_key  
    rqt  
![alt text](image-14.png)  
节点关系：  
![alt text](image-15.png)






## 其他知识
![alt text](image-6.png)
```
lsusb //查看端口号
ls /dev/ttyUSB* //查看端口号
whoami //查看当前用户名
whereis ros2    //查找命令所在路径
history //查看历史命令
sudo dpkg -i ./你的软件名称.dab //从网上下载deb安装包后使用命令安装
```
### CMake知识
#### 创建CMakeLists.txt文件，在CMakeLists.txt文件中添加内容：
```
// 设置CMake的最低版本要求为3.8
cmake_minimum_required(VERSION 3.8)
// 定义项目名称为HelloWorld
project(HelloWorld)
// 添加可执行文件learn_cmake，源文件为hello_world.cpp
add_executable(learn_cmake hello_world.cpp)
```
#### 然后在终端输入命令：cmake生成Makefile文件。再使用make命令编译。
    cmake .
    make
    ./learn_cmake

列出所有环境变量的列表  

    printenv  

| grep对前面的进行过滤  

    printenv | grep 你要找的文字名称  

    echo $AMENT_PREFIX_PATH  //查看ROS2的路径  
    export PATH=/usr/local/bin//临时修改环境变量

## ROS2基础入门
### Python示例程序
ros2 node list //查看当前运行的节点  
修改调试信息
![alt text](image-16.png)

查看节点
ros2 node list  
查看节点信息  
ros2 node info /cpp_node
## 问题汇总
### 网络问题
虚拟机选桥接（直接连接到路由器）需要处于同一个子网

### 串口权限/占用问题
![alt text](image-1.png)
串口USB永久权限设置

    单次生效，立即生效
    sudo chmod 666 /dev/ttyUSB0
    给当前用户添加永久权限，重启生效
    sudo usermod -aG dialout `whoami`

![alt text](image-5.png)
![alt text](image.png)


