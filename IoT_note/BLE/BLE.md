# BLE
蓝牙低功耗（简称 BLE）是蓝牙的一种节能变体。BLE 的主要应用是短距离传输少量数据（低带宽）。与始终开启的传统蓝牙不同，BLE 除非建立连接，否则始终处于休眠模式。  
由于其特性，BLE 非常适合需要定期交换少量数据并运行在纽扣电池上的应用。这使得它的功耗非常低。根据使用场景，BLE 的功耗约为传统蓝牙的 1/100。    
[nRF Connect for Desktop下载地址](https://www.nordicsemi.com/Products/Development-tools/nrf-connect-for-desktop)  
[nRF Connect for Desktop详细教程请看](https://wiki.seeedstudio.com/cn/xiao-ble-sidewalk/#%E5%BF%85%E9%9C%80%E8%AE%BE%E5%A4%87)
## 基本概念
### 服务端和客户端
在蓝牙低功耗中，有两种类型的设备：服务端和客户端。  
服务端广播其存在，以便其他设备可以找到它，并包含客户端可以读取的数据。客户端扫描附近的设备，当找到目标服务端时，它会建立连接并监听传入数据。这被称为点对点通信。  

### 属性
属性实际上是一段数据。每个蓝牙设备都用于提供服务，而服务是数据的集合，这个集合可以称为数据库，数据库中的每一条记录就是一个属性（Attribute）。因此，这里可以将属性理解为数据条目。您可以将蓝牙设备想象成一张表格，表格中的每一行就是一个属性。  
![alt text](image.png)  
- Attribute Handle：属性句柄  2 octets：2 个八位组（即 2 字节 ，1 octet = 1 字节 ）    
- Attribute Type：属性类型  2 or 16 octets：2 或 16 个八位组（2 或 16 字节 ）  
- Attribute Value：属性值  variable length (0 to 512 octets)：可变长度（0 到 512 个八位组 ，即 0 到 512 字节 ）  
- Attribute Permissions：属性权限  implementation specific：特定于实现（由具体实现定义 ，不同蓝牙设备或协议栈实现可能有差异 ）  


### 
http://www.cnblogs.com/iini/p/8972635.html  
GAP层（通用访问配置文件层）定义设备如何被发现和链接，主要用来广播扫描和发起连接等  
数据传输部分都是由GATT这个配置文件规定的  
GAP 负责 "能不能连接"，GATT 负责 "连接后怎么传数据"，两者共同构成了 BLE 设备通信的基础规范。  
### GAP 层（通用访问配置文件，Generic Access Profile）  
主要负责设备的发现、连接管理和安全认证，具体包括：  
设备广播（如广播设备名称、服务 UUID 等）和扫描（发现周围设备）  
建立和断开连接、角色切换（主从设备切换）  
设备命名、外观设置等基础信息配置  
简单说，GAP 是蓝牙设备 "见面打招呼" 和 "建立联系" 的规则。  
### GATT 层（通用属性配置文件，Generic Attribute Profile）  
是数据传输的核心框架，规定了蓝牙低功耗（BLE）设备间数据交互的格式和规则：  
通过 "服务（Service）- 特征（Characteristic）" 的层级结构组织数据  
定义了数据读写、通知（Notification）、指示（Indication）等交互方式  
几乎所有实际业务数据（如传感器数据、控制指令）都通过 GATT 结构传输。     

在 GATT 协议中，设备的功能和属性被组织成称为服务（services）、特性（characteristics）和描述符（descriptors）的结构。
- 服务表示设备提供的一组相关功能和特性。每个服务可以包含多个特性，
- 这些特性定义了服务的某些属性或行为，例如传感器数据或控制命令。每个特性都有一个唯一标识符和一个值，可以通过读取或写入该值进行通信。
- 描述符用于描述特性的元数据，例如特性值的格式和访问权限。

通过使用 GATT 协议，蓝牙设备可以在不同的应用场景中进行通信，例如传输传感器数据或控制远程设备。  

### ATT 层（属性协议层）
ATT，全称属性协议（Attribute Protocol）。最终，ATT 是由一组 ATT 命令组成的，即请求和响应命令。ATT 也是蓝牙空包的最上层，即 ATT 是我们分析蓝牙数据包时最常接触的部分。是GAP和GATT的底层。    
ATT 命令正式名称为 ATT PDU（协议数据单元，Protocol Data Unit）。它包括四种类别：读取（read）、写入（write）、通知（notify）和指示（indicate）。这些命令可以分为两种类型：如果需要响应，则会跟随一个请求；相反，如果只需要一个 ACK 而不需要响应，则不会跟随请求。

服务（Service）和特性（Characteristic）是在 GATT 层中定义的。服务端提供服务，服务是数据，而数据是属性。服务和特性是数据的逻辑表示，或者说用户可以看到的数据最终会转化为服务和特性。

让我们从移动端的角度看看服务和特性是什么样子。nRF Connect 是一个应用程序，它可以非常直观地展示每个数据包的样子。
![alt text](image-2.png)  
如您所见，在蓝牙规范中，每个特定的蓝牙应用程序由多个服务组成，每个服务由多个特性组成。一个特性由 UUID、属性（Properties）和值（Value）组成。  
![alt text](image-34.png)  
属性用于描述对特性进行操作的类型和权限，例如是否支持读取、写入、通知等。这类似于 ATT PDU 中包含的四种类别。
![alt text](image-1.png)
### UUID
每个服务、特性和描述符都有一个 UUID（通用唯一标识符，Universally Unique Identifier）。UUID 是一个唯一的 128 位（16 字节）数字。例如：

    ea094cbd-3695-4205-b32d-70c1dea93c35

对于所有类型、服务和由 [SIG（蓝牙特别兴趣小组）](https://www.bluetooth.com/specifications/assigned-numbers/) 指定的配置文件，都有缩短的 UUID。但如果您的应用程序需要自己的 UUID，可以使用此 [UUID 生成器网站](https://www.uuidgenerator.net/) 来生成。

![alt text](image-3.png)
![alt text](image-4.png)
![alt text](image-5.png)
![alt text](image-6.png)
![alt text](image-7.png)
![alt text](image-8.png)
![alt text](image-9.png)
![alt text](image-10.png)
![alt text](image-11.png)
![alt text](image-12.png)
![alt text](image-13.png)
![alt text](image-14.png)
![alt text](image-15.png)
![alt text](image-16.png)
![alt text](image-17.png)
![alt text](image-18.png)
![alt text](image-19.png)
![alt text](image-20.png)
![alt text](image-21.png)
![alt text](image-22.png)
![alt text](image-23.png)
![alt text](image-24.png)
![alt text](image-25.png)
![alt text](image-26.png)
![alt text](image-27.png)
![alt text](image-28.png)
![alt text](image-29.png)
![alt text](image-30.png)
![alt text](image-31.png)
![alt text](image-32.png)
![alt text](image-33.png)


# BTHome
![alt text](image-35.png)
BTHome 是一个开放标准，用于通过蓝牙低功耗（BLE）广播传感器数据和按钮按压信息。它设计为节能、高效、灵活且安全。BTHome 被流行的家庭自动化平台（如 Home Assistant）原生支持。  
[官网](https://bthome.io/)  

BTHome 的一些优势：  
是开放标准，因此来自不同制造商的设备可以协同工作。  
设备设计为节能，因此可以在单个电池上运行很长时间。  
数据是加密的，因此可以防止未经授权的访问。  
是一种灵活的格式，可以用于传输各种传感器数据和按钮按压信息。  

BTHome 是一种功能强大的标准，用于通过 BLE 广播传感器数据和按钮按压信息。对于希望将传感器数据和按钮按压集成到智能家居中的用户来说，这是一个不错的选择。  

[详细教程请看](https://wiki.seeedstudio.com/cn/XIAO_BLE_HA/#bthome)