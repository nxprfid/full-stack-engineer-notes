---
title: 涂鸦智能模组 SDK 开发笔记
---

# 涂鸦智能模组 SDK 开发

## 开发流程概览

```mermaid
flowchart LR
    A[IoT 平台创建产品] --> B[定义功能点 DP]
    B --> C[选择模组与方案]
    C --> D[下载 SDK / Demo]
    D --> E[固件开发与调试]
    E --> F[授权激活 / 配网]
    F --> G[联调与 OTA 升级]
    G --> H[量产与订单]
```

## 官方资源速查

### 平台与文档

| 名称 | 地址 | 用途 |
| ---- | ---- | ---- |
| 涂鸦开发者官网 | <https://developer.tuya.com> | 开发文档、SDK 下载、方案资料入口 |
| 涂鸦 IoT 平台 | <https://iot.tuya.com> | 产品创建、PID/DP 定义、设备管理 |
| 涂鸦 PMS 系统 | <https://pms.tuya.com> | 项目管理与订单相关事务 |
| 文档中心 | <https://developer.tuya.com/cn/docs/iot> | IoT 开发文档主体，SDK/协议/接口说明 |
| Demo 中心 | <https://developer.tuya.com/cn/demo> | 官方示例工程与参考实现 |
| 帮助中心 | <https://support.tuya.com/zh/help> | 常见问题、工单与技术支持 |
| 方案中心 | <https://www.tuya.com/cn/developer-stories> | 行业方案与客户案例 |
| Wukong AI 文档 | <https://developer.tuya.com/cn/docs/developer> | Wukong AI SDK 系列开发文档 |

### 工具链与开源项目

| 名称 | 地址 | 用途 |
| ---- | ---- | ---- |
| TuyaOpen 官网 | <https://tuyaopen.ai/zh/> | TuyaOpen 文档与活动入口 |
| TuyaOpen 主仓库 | <https://github.com/tuya/TuyaOpen> | 跨芯片开源开发框架源码（点 Star 可用于领取活动授权码） |
| TuyaOpen IDE 下载 | <https://tuyaopen.ai/tuyaopen-ide> | IDE 安装包下载 |
| tuya-smart-control-cli | <https://github.com/tuya/tuya-smart-control-cli> | 让 AI Agent（如 OpenClaw「龙虾」）可以直接控制涂鸦生态设备 |
| TuyaOpen-dev-skills | <https://github.com/tuya/TuyaOpen-dev-skills> | TuyaOpen SDK 专家技能集 |
| Tuya AI Coding | <https://coding.tuya.ai/> | AI Native 无代码应用开发平台 |
| Tuya Cobuilder | <https://www.tuya.com/cobuilder> | AI 硬件零代码 Vibe Coding 平台 |
| DuckyClaw 官网 | <https://tuyaopen.ai/zh/duckyclaw> | DuckyClaw 产品与开发者活动 |
| TuyaClaw 官网 | <https://claw.tuyasmart.com> | TuyaClaw 产品与开发者活动 |

## AI Agent 接入：Tuya Smart Control CLI
涂鸦上线的 AI Agent 新技能，让 AI Agent（如 OpenClaw「龙虾」）可以直接控制涂鸦生态设备。

### 使用步骤（两步）

1. **获取 skill 的 key**
   - 访问：<https://tuyasmart.com/>
   - 用涂鸦 APP 扫码登录后创建 API key，一键复制配置信息
2. **安装技能并配置**
   - 通过 <https://clawhub.ai/gaosq856/tuya-smart-control> 安装技能
   - 将一键复制的配置信息粘贴到技能配置中即可

### Enduser API 与 CLI 的关系

- Tuya Enduser API 是涂鸦开放给开发者的官方接口（底层能力）
- tuya-smart-control-cli 是基于上述 Enduser API 封装的开箱即用命令行工具

### AI+IoT 开发者为什么需要 CLI

1. 设备调试效率大幅提升
2. 批量操作无需开发管理后台
3. 为 AI Agent 提供设备操作入口
4. 支持 JSON 输出，便于数据处理与集成

5 分钟即可完成配置，详见仓库文档。

## TuyaOpen 开发框架

TuyaOpen 是涂鸦的开源跨平台开发框架，支持多芯片/硬件快速构建联网 AI 设备。主仓库：<https://github.com/tuya/TuyaOpen>。

### TuyaOpen x ESP32

在 ESP32 开发板上构建、烧录并运行第一个 TuyaOpen 应用。  
详情：<https://tuyaopen.ai/zh/docs/hardware-specific/espressif/esp32-quick-start>

### TuyaOpen x T5AI

T5AI 板级资料：<https://tuyaopen.ai/zh/docs/hardware-specific/tuya-t5/t5-ai-board/overview-t5-ai-board>

### TuyaOpen x Raspberry Pi

在树莓派上搭建聊天机器人：<https://tuyaopen.ai/zh/docs/hardware-specific/Linux/raspberry-pi/Applications/your-chat-bot-on-raspberry-pi>

## TuyaOpen IDE

全新发布的 IDE，纯自然语言迅速落地硬件实体，大幅提升开发效率。  
下载：<https://tuyaopen.ai/tuyaopen-ide>

### 每月手搓活动

用 TuyaOpen IDE 手搓 Demo，每月前五名获得购物卡奖金 100 元；作品每获得 50 赞，奖金增加 10 元。  
报名链接：<https://jja0khqo.jsjform.com/f/AoucFM>

**提交格式**

1. Demo 视频/图片/文档
2. 上传 TuyaOpen GitHub 链接
3. 发布小红书/视频号

## TuyaOpen SDK 专家技能（VibeCoding）

涂鸦推出的 TuyaOpen SDK 专家技能，沉淀硬件开发最佳实践，面向 VibeCoding 优化：从新建工程、设备认证、编译烧录，到调试与事件注入测试，全程遵循硬件在环（HIL）思路。  
GitHub：<https://github.com/tuya/TuyaOpen-dev-skills>

## Tuya AI Coding

AI Native 无代码应用开发平台，只需自然语言即可用 AI 把想法变成应用。  
网址：<https://coding.tuya.ai/>（可申请免费积分内测）

**核心能力**

1. **对话式编程**：用自然语言描述需求，AI 负责读、写、运行和修复，每一步都可见
2. **云端沙箱**：每个应用在独立云端沙箱中运行，依赖、运行时、预览开箱即用，无需本地配置
3. **一键托管**：一键部署到生产环境，获得可分享的链接，平台托管

**适用场景**

- 设计师/自由职业者/创作者：制作作品集、交互原型、个人小程序
- 创业者：生成可测试原型、集成用户行为数据看板，实现 MVP 验证
- 教师/指导老师：制作互动课件、教学工具、学生项目开发平台

## Tuya Cobuilder

AI 硬件零代码 Vibe Coding 平台。  
网址：<https://www.tuya.com/cobuilder>

**覆盖流程**

1. 产品创建与功能点设计
2. 面板开发
3. 智能体构建
4. 固件开发与编译
5. 授权与烧录

## Wukong AI SDK

TuyaOS Wukong AI SDK 系列文档提供一站式教程，覆盖 SDK 开发、涂鸦开发者平台产品创建、智能体创建等场景。  
文档：<https://developer.tuya.com/cn/docs/developer>  
SDK 商务邮箱申请：zouxk@tuya.com

## 开发者活动与社区

  - **开发者优秀作品 List**：定期更新开发者作品（基于涂鸦 T5 的智能生肖墨水屏、基于涂鸦 T5AI-Board 的墨水屏阅读器、基于涂鸦 T5AI 的开发板移植游戏）
- 开发者贡献活动报名：<https://ourojj8n.jsjform.com/f/R2MC4J>
  - 活动内容：体验 tuya-smart-control skill → 发布到社交媒体并提交链接 → 数据优异者月末可获得现金购物卡奖励

---

## 环境搭建

在Linux Ubuntu 中下载编译依赖工具
```bash
sudo apt-get update -y
sudo apt-get upgrade -y
sudo apt-get install net-tools build-essential wget git python3 libc6-i386 -y
```

 GitHub上获取SDK进行验证
```bash
cd /home/share/samba/
git clone https://github.com/tuya/tuya-iotos-embeded-sdk-wifi-ble-bk7231n.git
```
输入下列命令，开始编译 tuya_demo_template：
```bash
cd tuya-iotos-embeded-sdk-wifi-ble-bk7231n/
sh build_app.sh apps/tuya_demo_template/ tuya_demo_template 1.0.0 
```
涂鸦IoT平台下载SDK进行验证
![alt text](image-3.png)

`sh build_app.sh apps/tuya_demo_template tuya_demo_template 1.0.0 #输入该命令将会在所需相关资源下载完成后开始编译`
## 固件编译

文件名	功能
- bk7231n_light1_io_xx_QIO_1.0.0.bin	生产区固件：boot+用户区固件+检测固件。
- bk7231n_light1_io_xx_UA_1.0.0.bin	用户区固件
- bk7231n_light1_io_xx_UG_1.0.0.bin	升级固件 

>自定义开发固件不上传到云平台，直接将UA文件烧录到已授权的模组中，会导致配网一直无法成功。

## 烧录授权

1. PMS账号
2. CBU Nano开发板或涂鸦WiFi模组+usb转UART串口工具
3. 云模组烧录授权工具
4. 原厂烧录工具

![alt text](image.png)

![alt text](image-1.png)

![alt text](image-2.png)

T1模组烧录工具是什么，如何接线？
https://support.tuya.com/zh/help/_detail/Kf8k1nr4ggro7

T1系列模块如何擦除授权区域
https://support.tuya.com/zh/help/_detail/Kfqkub3rayqf8

## 代码解析
![alt text](image-4.png)

## 灯控方面
![alt text](285d4924c960ff0f4d1349af2f19d875.jpg)
硬件1使用T1-U-HL模组，其驱动5路PWM灯带，GRBCW分别接在P8、P6、P26、P24、P9。重置配网按键连接在P14。实际我外部灯带连接顺序是R G B WW CW对应板载丝印G R B C W。
![alt text](f496ba5885c50c04501f5b8bd35056ac.jpg)
硬件2使用T1-U-HL模组，其驱动1路幻彩灯带2路PWM灯带，MOSI接在P16，C接在P6，W接在P8。重置配网按键连接在P22。IR连接在P28
![alt text](0f9b3c87dd523b28c122252bc465bcf9.jpg)
硬件3使用T1-U-HL模组，其驱动1路幻彩灯带2路PWM灯带，MOSI接在P16，C接在P8，W接在P6。重置配网按键连接在P22。IR连接在P28。MIC连接在ADC。
![alt text](f81b7767d1e7c22f116ce2a7a89817cb.jpg)
硬件4使用CBU模组，其驱动5路PWM灯带，GRBCW分别接在P7、P6、P8、P9、P26。（P9存疑，理论应该是P24，实测P9）重置配网按键连接在P14。实际我外部灯带连接顺序是R G B WW CW对应板载丝印G R B C W。