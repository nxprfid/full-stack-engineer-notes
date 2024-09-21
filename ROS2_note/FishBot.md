虚拟机选桥接（直接连接到路由器）
需要处于同一个子网

串口权限/占用问题
![alt text](image-1.png)
![alt text](image-5.png)
![alt text](image.png)
FishBotROS2OS随身系统  
开机时按下F8键（F11）进入启动设备选择界面  
密码fish进入  
等待脚本完成输入fishinstall  

即可使用ros2命令  


安装VsCode  
安装PIO（仅适用Ubuntu22.04系统，非该系统请直接跳过）
安装Docker
    wget http://fishros.com/install -O fishros && . fishros  





![alt text](image-3.png)
四步新建工程
输入工程名 example01_helloworld
选择开发板，这里选择Adafruit ESP32 Feather
选择开发框架，这里我们用Arduino，PIO还支持IDF（IoT Development FrameWork）
开发位置可以选择默认的位置，也可以自定义位置
![alt text](image-2.png)

![alt text](image-4.png)

platformio.ini文件将单片机的主频提高到240MHZ的主频。
    board_build.f_cpu = 240000000L
通过修改配置文件，可以修改Serial Monitor的默认波特率。
在platformio.ini中添加一行代码
    monitor_speed = 115200
![alt text](image-7.png)
通过GIT地址安装
![alt text](image-8.png)
```
[env:featheresp32]
platform = espressif32
board = featheresp32
framework = arduino
lib_deps = 
    https://ghproxy.com/https://github.com/rfetick/MPU6050_light.git
```

lsusb
ls /dev/ttyUSB*
whoami查看当前用户名

![alt text](image-6.png)


# ROS2
![alt text](image-9.png)
核心是通讯（稳定、安全、实时的通讯能力）
ROS2版本
http://docs.ros.org/en/humble/Releases.html

![alt text](image-10.png)
![alt text](image-11.png)
>我们开发板的Z轴朝上，X轴朝前，此时Y轴应该朝左。接着摊开右手手掌，用大拇指朝向轴的方向，比如朝向X轴，然后握起手掌，那么你握的方向就是正方向。
# ROS2-MicroROS
通讯协议依赖与Agent
![alt text](image-12.png)
>所谓Agen其实就是一个代理，微控制器可以通过串口，蓝牙、以太网、Wifi等多种协议将数据传递给Agent，Agent再将其转换成ROS2的话题等数据，以此完成通信。
通过RCLC-API调用MicroROS
![alt text](image-13.png)  

运行Agent

    sudo docker run -it --rm -v /dev:/dev -v /dev/shm:/dev/shm --privileged --net=host microros/micro-ros-agent:$ROS_DISTRO serial --dev /dev/ttyUSB0 -v6
