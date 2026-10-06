## 用户指南

[docs.espressif.com/projects/esp-dev-kits/zh_CN/latest/esp32s31/esp-mosaico/index.html](https://docs.espressif.com/projects/esp-dev-kits/zh_CN/latest/esp32s31/esp-mosaico/index.html)

## 产品官网

[mosaico.espressif.com](https://mosaico.espressif.com/)

## 软件资源

[github.com/esp-mosaico](https://github.com/esp-mosaico)

[MCP](ts-mcp.espressif.com)
## 硬件资源

![硬件资源](2026-09-02-08-50-14.png)

### MCU 与管脚分配

下表按功能分组列出 ESP-Mosaico BSP 中的主要管脚分配。

| 分类 | 信号 | GPIO | 说明 |
| --- | --- | --- | --- |
| I2C / 传感器 | I2C0_SDA | GPIO0 | 共享 I2C：触摸、ES8311、BMI270、BMM150、BQ27220、模块 EEPROM |
| I2C / 传感器 | I2C0_SCL | GPIO1 | 共享 I2C 时钟 |
| I2C / 传感器 | SENSOR_INT | GPIO2 | IMU / 磁力计中断或信号 |
| I2C / 传感器 | TOUCH_INT | GPIO6 | 触摸中断 |
| 人机交互 | STATUS_LED | GPIO3 | 橙色状态灯，程序可控，低电平点亮 |
| 人机交互 | AI_BUTTON | GPIO7 | 应用按键，低电平有效 |
| 人机交互 | MOTOR | GPIO8 | 振动马达，高电平开启 |
| LCD | LCD_DATA3 | GPIO9 | CO5300 QSPI DATA3 |
| LCD | LCD_DATA2 | GPIO35 | CO5300 QSPI DATA2 |
| LCD | LCD_DATA0 | GPIO36 | CO5300 QSPI DATA0 |
| LCD | LCD_RST | GPIO42 | LCD 复位 |
| LCD | LCD_TE | GPIO43 | LCD_TE 防撕裂同步 |
| LCD | LCD_SCL | GPIO44 | QSPI 时钟 |
| LCD | LCD_CS | GPIO50 | LCD 片选 |
| LCD | LCD_DATA1 | GPIO51 | CO5300 QSPI DATA1 |
| 音频 | I2S_BCK | GPIO37 | 音频位时钟 |
| 音频 | I2S_DOUT | GPIO40 | 音频数据输出（DAC） |
| 音频 | PA_CTRL | GPIO45 | 功放使能 |
| 音频 | I2S_WS | GPIO49 | 音频帧时钟（字选择） |
| 音频 | I2S_DIN | GPIO52 | 音频数据输入（ADC） |
| 音频 | I2S_MCLK | GPIO54 | 音频主时钟 |
| 音频 | CODEC_PW | GPIO56 | Codec 3.3 V 电源控制 |
| 电源 | POWER_SWITCH | GPIO57 | 开关机请求 |
| 电源 | VCC_3V3_CTRL | GPIO60 | 系统 3.3 V 电源控制 |
| NAND Flash | NAND_CLK | GPIO20 | SPI NAND（SD_D0） |
| NAND Flash | NAND_D | GPIO21 | SPI NAND（SD_D1 / SIO0） |
| NAND Flash | NAND_Q | GPIO22 | SPI NAND（SD_D2 / SIO1） |
| NAND Flash | NAND_CS | GPIO23 | SPI NAND（SD_D3） |
| NAND Flash | NAND_HOLD | GPIO24 | SPI NAND（SD_CLK / SIO3） |
| NAND Flash | NAND_WP | GPIO25 | SPI NAND（SD_CMD / SIO2） |

### I2C 设备地址

共享 I2C 总线（I2C0_SDA / I2C0_SCL）上的 7-bit 地址如下。其中板载器件位于 CoreBoard / BaseBoard；模块 EEPROM 位于外接模块上，不在主板上，仅在对应模块插槽接入带 EEPROM 的模块时出现。

| I2C 地址 | 器件 | 说明 |
| --- | --- | --- |
| 0x11 | BMM150 #2 | 板载三轴地磁传感器 |
| 0x12 | BMM150 #3 | 板载三轴地磁传感器 |
| 0x19 | ES8311 | 板载音频编解码芯片 |
| 0x50 | 模块 EEPROM（Left） | 位于左侧模块上，不在主板；由 GPIO14 低电平选通 |
| 0x51 | 模块 EEPROM（Right） | 位于右侧模块上，不在主板；由 GPIO39 高电平选通 |
| 0x55 | BQ27220 | 板载电池电量计 |
| 0x5A | CST9220 | 板载触摸控制器 |
| 0x69 | BMI270 | 板载六轴 IMU |


## 入门

![alt text](image-176.png)

![框架](image-177.png)

### 命令行烧录
第一次点击`install.bat`
后续新开窗口点击 `export.bat`

![alt text](image-178.png)

将出厂默认不同的项给提取出来，写入到`sdkconfig.defaults`中，没有改动的不会写进去。
项目要支持多种芯片的时候，还可以再放一份带有芯片名的文件`sdkconfig.defaults.esp32c61`.
构建时读取顺序是先读通用的`sdkconfig.defaults`再读当前芯片的这一份。同一项会以后面的为准，通用的这一份必须存在，哪怕是空文件，否则带后缀的这一份不会加载。进行git一个项目协作提交的话通常只提交`sdkconfig.defaults`和带有芯片后缀的文件，不会把整个`sdkconfig`文件提交上去。

idf.py erase-flash
当遇到设备行为异常，怀疑是残留数据造成的话。可以先进行一次`idf.py erase-flash`擦除完整的flash再进行烧录。

编译会生成build 文件和一个managed_components文件（组件管理器下载的第三方的组件），执行`fullclean`会删除掉这两个文件夹。

![alt text](image-179.png)
这个指令在加了新的组件之后可以去使用，会重新生成compile_commands.json（记录每一个源文件使用什么参数编译，代码跳转，函数补全和头文件识别）如果遇到函数无法跳转，头文件被标红。多数情况下不是代码有问题，而是这个文件过期了。

如果`idf.py fullclean`之后依然报奇怪的CMake或者组件错误的时候，可以直接在项目根目录去执行。
`Remove-Item -Recurse -Force .\build\, .\managed_components\, .\dependencies.lock`
把这三个文件给同时删除后。是最彻底把我们的项目恢复到初始状态的一条指令。


### AI Agent 实战
1. 分解具体需求
2. 分别实现功能模块
3. 看懂构建和配置
4. 完善最终工程



![alt text](image-180.png)

![alt text](image-181.png)

![alt text](image-182.png)

![alt text](image-183.png)

![alt text](image-184.png)
记录实际解析到的组件依赖版本，包括间接的一些依赖。