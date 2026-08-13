---
title: Matter智能家居协议笔记
---
# Matter
Matter（原名 Project CHIP，Connected Home over IP）是由连接标准联盟（CSA，前身为 Zigbee 联盟）联合苹果、谷歌、亚马逊等公司推出的智能家居应用层统一标准。它的目标是解决智能家居生态碎片化的问题，让不同厂商的设备可以互联互通。  
Matter 本身不是一种无线通信技术，而是运行在 IP 之上的应用层协议，底层传输可以基于 Wi-Fi、以太网或 Thread，并使用 BLE 进行配网（Commissioning）。  
[Matter 官方网站（CSA 联盟）](https://csa-iot.org/all-solutions/matter/)  
[Matter SDK 开源仓库（connectedhomeip）](https://github.com/project-chip/connectedhomeip)  
[乐鑫 ESP-Matter 开发文档](https://docs.espressif.com/projects/esp-matter/zh_CN/latest/esp32/)  
[Matter 协议特性解读](https://www.espressif.com.cn/zh-hans/solutions/device-connectivity/esp-matter-solution)  

## 基本概念
### 协议架构
Matter 采用分层架构，自上而下为：
- 应用层：定义设备类型（Device Type）和功能，如灯、开关、门锁、温控器等
- 数据模型层：以节点（Node）- 端点（Endpoint）- 集群（Cluster）- 属性（Attribute）的层级组织数据
- 交互模型层：定义读（Read）、写（Write）、订阅（Subscribe）、命令（Invoke）等交互方式
- 安全层：基于 CASE/PASE 会话的加密通信
- 传输层：TCP/UDP over IP（Wi-Fi、以太网、Thread）

### 数据模型
- Node（节点）：一个 Matter 设备实体，拥有独立的网络地址
- Endpoint（端点）：节点内的功能单元，例如一个双路开关有两个端点
- Cluster（集群）：一组相关的属性和命令的集合，如 On/Off Cluster、Level Control Cluster
- Attribute（属性）：设备的状态数据，如开关状态、亮度值
- Command（命令）：可以对设备执行的操作，如 On、Off、Toggle

### 配网（Commissioning）
Matter 设备的入网过程称为 Commissioning，典型流程：
1. 设备上电后通过 BLE 广播自己（未配网状态）
2. 手机 App（Commissioner）扫描设备上的二维码或输入配对码（Setup Code）
3. 通过 PASE（Passcode-Authenticated Session Establishment）建立安全会话
4. Commissioner 向设备写入 Wi-Fi/Thread 凭证和操作证书（NOC）
5. 设备加入目标网络，之后通过 CASE（Certificate-Authenticated Session Establishment）通信

### Fabric（网络域）
Fabric 是一组共享同一信任根（Root CA）的节点集合。Matter 支持 Multi-Fabric，即一个设备可以同时加入多个生态（如同时被 Apple Home 和 Google Home 控制）。

### Thread 与边界路由器
- Thread 是基于 IEEE 802.15.4 的低功耗 mesh 网络协议，适合电池供电的传感器类设备
- Thread 设备需要通过边界路由器（Thread Border Router）接入 IP 网络，如 HomePod mini、Nest Hub 等

## 开发环境
### 常用开发平台
- ESP32-C3/C6/S3 + ESP-Matter SDK（乐鑫，基于 ESP-IDF）
- nRF52840/nRF5340 + nRF Connect SDK（Nordic，支持 Thread）
- EFR32 系列（Silicon Labs）
- 官方 connectedhomeip SDK（支持 Linux/macOS 模拟设备）

### 调试工具
- chip-tool：官方命令行调试工具，可作为 Commissioner 进行配网和控制
- ESP Matter 手机 App / Google Home / Apple Home：实际生态测试

### SDK


[](https://github.com/Senscomm/wise-sdk/tree/MP-WLT-TL)
- 准备

1. 确保目标机器上安装了WSL。你可以在PowerShell中运行以下命令来安装WSL（如果尚未安装）
wsl --install
wsl -v -l 查看版本信息情况


2.开始导入WSL发行版
使用wsl --import命令导入tar包到目标机器。确保你有正确的路径和文件名：

`wsl --import <DistributionName> <InstallLocation> <FileName>.tar`

例如：
wsl --import ubuntu_matter D:\wsl\ wsl_ubuntu_matter.tar

-----------
	<DistributionName> 是你想要导入的WSL发行版的名称。
	<InstallLocation> 是你想要安装这个发行版的位置，例如 C:\wsl\<DistributionName>。
	<FileName>.tar 是你的tar包的文件名和路径。
-----------
导入WSL版本后，查看当前版本
指令 wsl -l 

	适用于 Linux 的 Windows 子系统分发:
	ubuntu_matter (默认值)   //DistributionName

3.检查电脑.wslconfig配置,xxx为电脑名，可以参考提供的.wslconfig
路径通常在C:\Users\xxxx\.wslconfig



4.打开终端cmd， 输入wsl指令 
接下来就可以放入项目的matter SDK进行编译开发了
默认matter SDK 目录在 /opt/matter


4.1下载scm1612 wise sdk代码

cd /opt/matter/third_party/senscomm/scm1612s/

  在当前环境git clone下载wise-sdk 最新代码，指令如下
  git clone -b MP-WLT-TL https://github.com/Senscomm/wise-sdk.git
  
	下载完后，执行指令git branch 预期会显示
* MP-WLT-TL

---------------------------------------------------------------------
编译前  测试google访问情况：指令 curl -I https://www.google.com
看是否会提示
HTTP/1.1 200 Connection established
相关打印
---------------------------------------------------------------------


4.2 cd  /opt/matter/ 

执行 source scripts/activate.sh   ，预期是pass
--------------------------------------------------------------------------
  Setting up CIPD package manager...[|]fatal: not a git repository: /opt/connectedhomeip-MP-WLT/third_party/pigweed/repo/../../../.git/modules/pigweed
[/]
done (10m31.8s)
  Setting up Project actions........skipped (0.1s)
  Setting up Python environment.....done (1m29.9s)
  Setting up pw packages............skipped (0.1s)
  Setting up Host tools.............done (0.1s)

Activating environment (setting environment variables):

  Setting environment variables for CIPD package manager...done
  Setting environment variables for Project actions........skipped
  Setting environment variables for Python environment.....done
  Setting environment variables for pw packages............skipped
  Setting environment variables for Host tools.............done

Checking the environment:

20260408 16:09:19 INF Environment passes all checks!

Environment looks good, you are ready to go!
--------------------------------------------------------------------------------


备注
因当前/opt/matter已经激活配置好环境了
如果有需要合入 matter的部分代码， 可以手动比较合入改动的patch文件

4.3编译SDK， 在/opt/matter/out目录下可以找到对应的chip-scm1612s-ayla-app-example.mcuboot.bin


scripts/build/build_examples.py --target senscomm-scm1612s-ayla build
 

- 激活matter环境
```bash
source scripts/bootstrap.sh //一次性初始化脚本，只执行一次

source scripts/activate.sh //环境加载脚本，新开终端必执行
```

- 编译
```bash
./scripts/build/build_examples.py --target senscomm-scm1612s-ayla build

ninja -C out/senscomm-scm1612s-ayla/ -j1
ninja -C out/senscomm-scm1612s-ayla/ -j2
```
在/opt/matter/out目录下可以找到对应的chip-scm1612s-ayla-app-example.mcuboot.bin

- gcc 全局
```bash
export PATH="$PATH:/opt/nds32le-elf-mculib-v5/bin"
```

- 烧录
```bash
sctool_gui.exe
```

matter 路径:

~/zzp/connectedhomeip/ 

paral@paral-virtual-machine:
~/Documents/connectedhomeip$ 

编译规则部分

~/zzp/connectedhomeip/third_party/senscomm/scm1612s/scm1612s_sdk.gni


屏蔽这个 增量编译不会编译matter外壳

    # Build wise-sdk in-place with specified menuconfig.
    exec_script("${scm1612s_sdk_build_root}/build-wise-sdk.py",
            [ rebase_path("${scm1612s_sdk_build_root}", root_build_dir),
              "scm1612s_matter_defconfig",
            ])

scm1612s_ayla.gni 
增加.c..h

项目主路径
~/zzp/connectedhomeip/third_party/senscomm/scm1612s/wise-sdk/app/ayla/ayla_matter_demo$ 


## ninja编译
### 全速编译，使用CPU全部核心
`ninja -C out/senscomm-scm1612s-ayla/ -j$(nproc)`

### 清理编译产物
`ninja -C out/senscomm-scm1612s-ayla/ clean`

### 只编译单个目标（固件）
`ninja -C out/senscomm-scm1612s-ayla/ chip-firmware`

[WISE-SDK链接](https://github.com/Senscomm/wise-sdk)

[matter链接 MP-WLT 分支](https://github.com/Senscomm/connectedhomeip)   


