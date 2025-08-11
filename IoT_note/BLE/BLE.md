# BLE
蓝牙低功耗（简称 BLE）是蓝牙的一种节能变体。BLE 的主要应用是短距离传输少量数据（低带宽）。与始终开启的传统蓝牙不同，BLE 除非建立连接，否则始终处于休眠模式。  
由于其特性，BLE 非常适合需要定期交换少量数据并运行在纽扣电池上的应用。这使得它的功耗非常低。根据使用场景，BLE 的功耗约为传统蓝牙的 1/100。    
[nRF Connect for Desktop下载地址](https://www.nordicsemi.com/Products/Development-tools/nrf-connect-for-desktop)  
[nRF Connect for Desktop详细教程请看](https://wiki.seeedstudio.com/cn/xiao-ble-sidewalk/#%E5%BF%85%E9%9C%80%E8%AE%BE%E5%A4%87)  
[nrf connect_4.10.0 软件使用指南](https://blog.51cto.com/u_16213575/11321104)  
[深入分析蓝牙BLE协议【附代码实例】](https://www.eet-china.com/mp/a285112.html)  
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


# BLE MESH
[tuya mesh](https://www.tuyaos.com/viewtopic.php?t=523)  
[ESP-BLE-MESH](https://docs.espressif.com/projects/esp-idf/zh_CN/latest/esp32/api-guides/esp-ble-mesh/ble-mesh-index.html)  
[安信可](https://bbs.ai-thinker.com/forum.php?mod=viewthread&tid=46050&_dsign=81e07e29)  
[蓝牙 Mesh 概述](https://github.com/MarkDing/IoT-Developer-Boot-Camp/wiki/Bluetooth-Mesh-Overview)  
[微信BLE MESH文档](https://developers.weixin.qq.com/miniprogram/dev/framework/device/ble-mesh.html)  
## BLE Mesh 的核心概念
BLE Mesh（Bluetooth Low Energy Mesh）是一种基于低功耗蓝牙（Bluetooth Low Energy, BLE）的网状网络通信协议。它允许多个支持 BLE 的设备组成一个分布式网络，通过设备之间的相互中继，实现大范围的、可靠的设备间通信。是一种多对多的网络拓扑结构，网络中的设备节点通过「发布 / 订阅机制」收发消息。  
![alt text](image-36.png)
蓝牙Mesh可以和BLE 4.0及以上版本的蓝牙设备通信. 注意这并不意味着它支持所有BLE最新的特性, 譬如低功耗蓝牙的LE Coded PHY及2M PHY, 在现有的Bluetooth Mesh规范中并不支持。  
### BLE 物理层
蓝牙Mesh在网络内部节点间的通信只采用了Advertising的方式。（即广播）  
### BLE 链路层
Advertising是指蓝牙广播设备在3个广播信道里以特定的时间间隔发送消息, 同时蓝牙扫描设备以特定时间长度的的扫描窗口和间隔, 依次扫描3个广播信道来接收广播设备发送过来的信息. 图中三个不同颜色的柱状图表示37,38,39三个广播信道. 广播设备连续在三个信道里发送消息, 间隔为20ms. 而扫描设备的扫描窗口时间为30ms, 扫描间隔为40ms, 一次扫描一个信道. 蓝牙Mesh设备在网络内部通信时, 以尽可能接近100%的占空比来扫描广播信道. 也就是说扫描窗口时间等于扫描间隔, 以确保信息不会丢失. 蓝牙Mesh设备在发送特定信息的时候并不会像普通BLE广播要等一个广播间隔, 而是延迟一小段随机时间就立即发送出去。  
![alt text](image-43.png)  
### 蓝牙Mesh发布/订阅系统
引入组(Group)的概念来实现松耦合(independent). 我们把有关联的开关和灯放在同一个组, 并取个易懂的名称, 如厨房和花园. 开关发布消息到组地址, 而灯则订阅来自组地址的消息. 组成发布/订阅系统。  
![alt text](image-44.png)  
开关记录它要发布组地址列表, 灯则记录它的订阅组地址列表. 如果要更换灯泡, 只需要重新设置新灯泡里的订阅列表即可, 不用修改开关那边发布列表的设置. 开关只需要发布消息到厨房或花园的组播地址, 无需关心订阅者的情况。  
### 管理型网络泛洪
蓝牙Mesh网络使得设备可以在广阔的区域中安装, 同时每个设备之间保持通信. 消息可以在在无线覆盖范围之内的设备之间直接通信, 也可以通过中继设备和无线覆盖范围之外的设备通信. 消息可以被多次中继, 从而实现非常广阔的消息传输. 蓝牙Mesh采用的是管理型网络泛洪方式来进行网络信息的传输, 即网络中所有具备中继功能的设备都会转发收到的消息. 优点是无需特定的路由设备, 确保消息多路径传输无障碍的到达目的设备 缺点是可能会对网络消息泛滥造成通信延迟. 所以蓝牙Mesh采用以下措施来优化泛洪通信来减少不必要的冗余信息传输  
- Message cache: 设备都会缓存收到消息的关键信息, 以确定是否已经转发过此消息, 如果是就忽略此消息. Message cache需要至少能缓存两条消息。
- Time to Live(TTL): TTL 指的是一条广播包可被转发次数，在每条的 mesh 广播包中都会存在，占用 7bit。对于 TTL 的值有以下解释：每个消息都会包含一个TTL的值, 来限制中继的次数, 最大可以中继126次. 消息每转发一次TTL的值就减1, TTL值为1就不再转发。  
• 0 = has not been relayed and will not be relayed  
• 1 = may have been relayed, but will not be relayed  
• 2 to 126 = may have been relayed and can be relayed  
• 127 = has not been relayed and can be relayed  
节点间通信为广播通信没有特定的路径，relay 节点收到的广播包只要 TTL 值不为 0 这条广播包就可以被继续转发，同时将广播包中的 TTL 减一。  
### Mesh数据包
我们目前常用的 mesh 控制数据包类型为 Access message。  
Access message 分为 unseq acc / seq acc；  
unseq acc 即 不分包 access 数据，最大长度为15，减去 MIC(4) 最大可以 11Byte。11Byte 里包括 opcode，即在用 vendor model 发送数据时，opcode 长度为3，即 data 最大为 8.  

seq acc 即分包 access 数据，单包最大长度为12，即总长度为 12\*n，n为分包数。12\*n 中包括 MIC 4Byte)，即用户数据为 12\*n-4，再减掉 opcode 长度才为实际的用户数据长度 即： 12\*n - 4 - opcode_len。如果对于使用 vendor model 则分包数为 n = (data_len + 7)/12，对 n 取整。  

在使用数据包很短的控制命令时，命令的成功率与到达的一致性都很优秀，例如：开关命令、照明的调光命名、传感器的数据上报等。所以建议数据命令长度较长的控制方式时建议不要选择 Mesh 方案，否则不仅无法发挥其优势而且有可能会出现数据延迟与丢包等问题。  
- SEQ  
SEQ 全称 sequence num，每包的序列号。mesh 的每一包里都有一个长度为 3 个字节的序列号。对于同一个设备在发送 mesh 数据时，这个序列号必须是累加的。

同时每个 mesh 设备内部都有一张 SEQ 缓存表，用来缓存接收到的mesh数据包的源地址（src_addr）和其最新的 SEQ，这张表只存放在 RAM（掉电丢失）中。在每收到一个 mesh 数据包时都要去表里去查询，收到的SEQ是否大于缓存表同一个源地址的 SEQ，如果小于等于则认为次数据包为重传包或者不合法数据包，同时丢弃此数据包。  
#### Sig mesh网络防重放安全机制
seq：  
sequence num，每包的序列号。Mesh 的每一包里都有一个长度为3个字节的序列号。对于同一个设备在发送mesh 数据是，这个序列号是累加的。  
每个mesh设备内部都有一张 seq cache 表，用来缓存接收到的 mesh 数据包的原地址 src_addr 和最新的 seq。这张表只存放在 ram（掉电丢失） 中。在每收到一个 mesh 数据包时都要去表里去查询，对于同一个 src_addr，收到的 seq 是否大于缓存的 seq，如果小于等于则不做任何处理。  

iv index：  
iv index 是一个网络内的属性，针对于同一个网络所有设备的 iv index 保持一致。Iv index 的意义在于，seq 只有三个字节，对于 mesh 网络通信，早晚有用完的那一天，如果 seq 用完了没有其他机制的话这个设备就无法与其他设备通信了。所以，iv index 的更新就是来解决 seq 的问题。
当网络内任意一个设备的 seq 用完了之后，就可以发起 iv index 的更新，在 iv index 更新之后，设备的 seq 重置从 0 开始重新累加。  
iv index 更新过程分为 normal 状态和 active 状态。因为一个网络内有大量的设备，更新是需要一定时间的。因为技术性很强，此处不多过多解释，感兴趣的可以参考 mesh spec。  
### 节点特性
- 网关（Gateway）：连接 BLE Mesh 网络与其他网络（如 Wi-Fi、以太网）设备。  
- 节点（Node）：参与 BLE Mesh 网络通信的设备，每个节点就是一个控制器。  
- 代理节点（Proxy Node）：允许传统 BLE 设备（不支持 Mesh 的设备）与 Mesh 网络通信。为了能够兼容市场上数十亿台不支持蓝牙Mesh的BLE设备如手机, 平板电脑等, 使能这个特性的节点能够采用BLE GATT Bearer的方式在数据信道和BLE设备通信, 并且代理节点会把来自手机和平板电脑的消息通过Advertising的方式转发给mesh网络其他设备.  
- 中继节点（Relay Node）：用于转发消息的节点，扩展网络范围。那些使能了此特性的节点可以通过Advertising Bearer接收并转发消息给mesh网络其他设备. 它只转发不在消息缓存和TTL的值大于1的消息, 转发前会把TTL的值减1. 这里的Bearer是指蓝牙Mesh协议中的承载层, 它主要是把BLE数据抽象并供上层使用. 目前定义了两种承载: 广播承载和GATT承载, 分别对应BLE的Advertising和Connection方式。    
- 友谊特性: 它包含两个子特性, 好友和低功耗特性. 对于功耗敏感比如纽扣电池供电设备使能低功耗特性, 在大部分时间处于休眠状态, 在较长的时间间隔醒来一次. 但是在睡眠期间的传递给它的消息就有很大可能错失掉, 于是使能好友特性的设备可以帮助与之组合的低功耗设备缓存消息, 低功耗设备从休眠中醒来后向它的好友设备查询消息并作出相应的处理。

### 网络拓扑
图中所示的蓝牙Mesh网络拓扑. 针对使能了不同特性的节点, 分别称呼为低功耗节点, 好友节点, 中继节点。  
![alt text](image-45.png)  
节点之间的连线表示无线信号覆盖范围内的直接连接, 对无线信号覆盖范围外的节点之间的通信需要经过中继节点. 如图中的Q,R,S进行消息转发到达目的节点. 图中有3个好友节点, 其中节点P和O分别有3个和2个低功耗节点组合, 好友节点N没有低功耗节点组合. 节点T是BLE设备, 通过GATT Bearer方式和代理中继节点S进行通信, 节点S必须转发所有和节点T的消息传输. 比如BLE节点T要发送消息给低功耗节点L. 首先节点T通过GATT Bearer在数据信道发消息给节点S, 然后节点S通过Advertising Bearer方式在广播信道转发消息. 节点H,R,O,N都在其无线信号覆盖范围并接收到消息, 节点O作为低功耗节点L的好友会储存收到的消息, 在节点L从睡眠中醒来后会查询好友节点O来取得这个发送给它的消息并做相应的处理。  
## 基础概念和术语
### 设备和节点
一个蓝牙设备(如插座)在没有加网前被称为Unprovisioned Device。帮助 BLE Mesh 设备完成配网操作的设备叫做「启动配置设备」(Provisioner)通过Provisioning蓝牙设备 完成认证, 创建网络密钥, 蓝牙设备成为未配置的蓝牙节点(Node)。  
![alt text](image-46.png)  
未配置好的节点是不能做任何事情的, Provisioner再进行节点配置 绑定应用层和网络层密钥, 设置模型的发布/订阅等. 完成上述动作后蓝牙设备(Device)成为蓝牙Mesh网络里的功能节点(Node)。  
![alt text](image-47.png)  

### Mesh密钥
Mesh Profile 规范定义了两种类型的密钥：应用程序密钥（AppKey）和网络密钥（NetKey）。
NetKeys 用于网络层的通信加密，只有 NetKey 保持一致设备所发出的数据才可以被同一个Mesh网络内的节点进行传输。
AppKeys 用于上层传输层的通信加密，只有AppKey保持一致，节点间通信发送的数据才可以被解密成应用数据。这两种类型的密钥在 mesh 节点之间是统一的，只有两个密钥保持一致才能进行通信。一个网络中，则可以有多个Appkey。

除了上述两种密钥外还有一种设备密钥（DevKey），它是每个节点唯一的特殊应用程序密钥，即一机一密，只有节点和配网者知道，用于配网者来配置节点通信加密。

在蓝牙Mesh网络中，**AppKey（应用密钥）** 和**NetKey（网络密钥）** 是两类核心安全密钥，用于保障不同层级的通信安全，二者作用范围和用途不同：


### 1. NetKey（网络密钥，Network Key）
- **作用范围**：整个Mesh网络（或子网），是网络级别的密钥。
- **核心功能**：
  - 用于加密和验证设备之间的**网络层通信**（如数据帧的传输、路由等底层操作）。
  - 关联设备的**地址分配**（如 unicast address、group address），确保设备属于同一网络。
  - 是设备加入网络（配网过程）的基础，配网器（Provisioner）会将NetKey分发给新设备，使其成为网络成员。
- **特点**：
  - 一个Mesh网络可以有多个NetKey（对应不同子网），设备可同时属于多个子网（持有多个NetKey）。
  - 所有在同一子网内的设备必须共享相同的NetKey，否则无法直接通信。


### 2. AppKey（应用密钥，Application Key）
![alt text](image-56.png)
给应用层其他各种“功能模型”用的，相当于给模型添加"登录密码"，客户端模型和服务端模型的"登录密码"相同了，才能进行连接操作，模型可以有多个密钥，用来区分一些特定的需求。  
- **作用范围**：应用层，用于特定功能模型（Model）之间的通信。
- **核心功能**：
  - 用于加密和验证**应用层数据**（如控制指令：开关灯、调节亮度等）。
  - 关联具体的模型（Model），只有绑定了相同AppKey的模型才能相互通信（实现权限控制）。
- **特点**：
  - 一个NetKey下可以有多个AppKey，用于隔离不同的应用场景（如将灯光控制和传感器数据用不同AppKey加密）。
  - AppKey需要与NetKey关联使用，设备必须先加入网络（持有NetKey），才能接收和使用AppKey。


### 总结：二者关系与通信流程
1. 设备通过配网获取**NetKey**，成为网络成员，具备基础通信能力；
2. 配网器或控制器向设备分发**AppKey**，并将AppKey与设备上的模型（Model）绑定；
3. 通信时，数据先通过**NetKey**进行网络层加密（确保在网络中安全传输），再通过**AppKey**进行应用层加密（确保功能指令的安全）。

简单说：**NetKey管“能否进网通信”，AppKey管“能通信哪些功能”**。
### 节点特性 元素和地址
未配网 BLE Mesh 设备经过配网操作后，就成为了 BLE Mesh 网络中的设备节点。设备节点有一个或多个特性：代理节点、低功耗节点、中继节点、朋友节点、普通节点。  
一个节点可以包含1个或多个元素(Elements), 比如一个双孔插座板, 每个插孔就是一个元素。  
![alt text](image-48.png)  
- 每个元素在加网的过程会被分配唯一的单播地址(Unicast Address), 地址范围是0x0001-0x7FFF。  
- 还有一个组播地址(Group Address)就是前面讲到的发布/订阅机制里的厨房, 花园等。元素订阅特定的组播地址, 就会收到发布者发送到此地址的消息。分为动态和固定地址，动态的用来做一般的“组播”，固定地址用来做一些协议规定的功能。  
● 动态组播地址范围0xC000-0xFEFF。  
● 固定地址  
![alt text](image-57.png)
  ○ 保留：0xFF00-0xFFFB  
  ○ 发送到启用代理（proxy）功能的所有节点： 0xFFFC  
  ○ 发送到启用friend功能的所有节点：0xFFFD  
  ○ 发送到启用中继（relay）功能的所有节点：0xFFFE  
  ○ 发送到所有节点：0xFFFF  
- 还有虚拟地址(Virtual Address), 每一个虚拟地址逻辑上对应一个128-bit的Label UUID. 通过对该Label UUID作哈希运算得出虚拟地址的低14位数值. 虚拟地址的范围为0x8000-0xBFFF。  

总结：蓝牙 Mesh 用 16 位二进制 区分地址类型，前 2 位是 “类型标识”：  
![alt text](image-58.png)  
00 → 未分配  
01 → 单播（后 14 位自定义）  
10 → 虚拟（后 14 位由算法生成）  
11 → 组播（后 14 位区分不同组）  
### 模型
![alt text](image-51.png)
设备节点由多个元素构成，每个元素包含了多个模型，而每个模型定义了节点的基本功能，比如节点所需要的状态、控制状态的消息以及处理消息所产生的动作等。节点功能的实现是基于模型的，模型可分为 SIG 模型和自定义模型，前者由 SIG 定义，而后者由开发者定义。模型也可基于消息的发送 / 接收方分为客户端模型与服务端模型。  
模型(Models)顾名思义就是定义了基本功能的最小单位模型, 比如设备的开关 灯光亮度调节等 模型包含了三个部分:  
![alt text](image-49.png)  
- 状态(State)表明一个元素的当前状态. 比如灯泡中包含开关和亮度的状态值. 不同状态可以设置为绑定关系(Bound State). 比如灯泡亮度为非零值时, 开关状态应该是开. 而灯泡亮度调整到0的时候, 其开关状态也应该被设置为关闭.  
- 消息(Message)有SET/GET/STATUS三种类型, 分别用来设置/请求/发送状态值。  
- 行为(Behavior)定义了模型在接收到消息后所作的动作行为. 比如开关模型定义的行为就是在收到了SET的消息后, On/Off的状态就要变为SET消息里给定的值. 如果收到了GET消息那么就把On/Off的状态通过STATUS消息传给询问方.  

蓝牙Mesh的消息通信是基于服务器/客户端的架构, 对外提供状态访问接口的叫做服务器(server), 而来访问服务器端状态的叫做客户端(client). 模型分为三种:
![alt text](image-52.png)
- 服务器模型(Server model): 定义了一个包括状态,绑定状态和消息的集合. 比如灯包含有通用开关服务器模型(Generic OnOff Server) 和灯亮度服务器模型(Light Lightness Server).
- 客户端模型(Client model): 定义了一群消息用来请求改变服务器端的状态. 客户端模型不含有状态(State)。比如开关中含有通用开关客户端模型(Generic OnOff Client)以及灯亮度客户端模型(Light Lightness Client).
- 控制模型(Control model): 可以包含上述两种模型的功能
目前SIG定义好的模型包括Generic, Sensors, Time and Scenes, Lighting. 客户产品如果不在列表的话可以定义Vendor Model来实现相应的功能.

为了方便理解, 图中是灯和开关的模型简化示意图  
![alt text](image-50.png)  
左边灯的元素中含有通用开关(Generic OnOff)和灯的亮度(Light Lightness)服务器模型, 分别包含通用开关(Generic OnOff)和灯亮度(Light Lightness Actual)状态. 两个状态是绑定状态关系.  

右边开关设备元素中包含了通用开关(Generic OnOff)和灯亮度(Light Lightness)客户端模型. 通过消息来获知设置服务器端元素的状态. 客户端模型不含有状态.
#### 3种模型类型
模型除了模式之外，还有类型！即下面3种类型！
配置模型config_model
配置模型是一个强制应用的模型，是节点首元素里面的一个模型，专门用来配置节点的各种初始化，绑定等功能！
 通用模型generic_model
例如onoff这种，sig mesh协议里规定了的通用型模型，各个厂家设备之间可以互相通用！
厂家模型vendor_model
就是自定义模型，用来补充通用模型的功能的，厂家可以通过这个模型，来建立属于自己的通信方式！例如，透传！  
![alt text](image-53.png)  

### Mesh 地址
BLE Mesh 网络中的设备节点之间想要进行消息通信，就需要为每个节点分配地址用于消息的收发。Mesh 地址主要分为单播地址、组播地址、虚拟地址三种。

单播地址是在设备配网成功后由「启动配置设备」分配的。单播地址可能会出现在消息的来源 / 目标地址字段中。发送到单播地址的消息只能由拥有该单播地址的元素进行处理。

组播地址是 BLE Mesh 网络中的一种多播地址，通常用于将设备节点进行分组。如果发送带有组播地址的消息，所有订阅过该组播地址的设备节点都会收到该消息。

虚拟地址与特定的 UUID 标签相关联，可以用作模型的发布地址或订阅地址。  

### Mesh 消息
Mesh 消息分为控制消息与接入消息。控制消息是与 BLE Mesh 网络操作有关的消息，例如心跳和好友的请求消息。接入消息允许客户端模型检索或设置服务端模型中的状态值，或被服务端用于报告状态值。

Mesh 消息是 BLE Mesh 网络中数据传输的基本单位，由操作码（opcode）和携带参数（parameters）组成，前者用于标识消息的用途唯一性，后者可以存储有效数据，例如目标地址、设备状态等。

### 代理设备
如果想要不是 BLE Mesh 设备的其他设备（例如手机）也能成为 BLE Mesh 网络中的一员，可以通过与代理设备节点进行 GATT 连接，借助代理设备实现在 BLE Mesh 网络中收发各种消息。
### 单播功能
单播(unicast)——端对端的发送信息给节点（元素）
![alt text](image-54.png)
上图，节点A直接通过指定发送地址0x0001，发送开关命令到0x0001的开关模型
#### 发布，订阅功能（Publish , Subscribe）
发布(Publish)——往元素"主动"发送信息！发布信息前，需要调用API配置"目标地址"。
订阅(Subscribe)——"被动"的处理元素接收到的信息！订阅信息前，需要调用API去指定接收"目标地址"。
![alt text](image-55.png)  
上图，节点B的开关模型“订阅”了地址“0xCFFF”的信息响应，当节点A“发布”开关命令到地址“0XCFFF”，节点B即可收到相应的命令，并进行处理。 
## 配网
Mesh Spec 规定的标准配网为 mesh 的 Provision 过程，实际设备从未配网到可以正常通信分为两个步骤：  
1. Mesh Provision阶段  
配网节点通过扫描到未配网的 mesh 节点设备，然后通过连接（PB-GATT）或者广播（PB-ADV）与设备通信并发起配网，配网过程会先通过 ECDH 协商生成 Public key，然后基于 Public key 将Mesh网络的密钥 Network key 下发给设备，同时协商生成设备密钥 Device key，到此设备 Provision 阶段完成。

2. Config Model阶段   
接下来还需要通过 Network key 与 Device key 的加密将应用密钥 App key 下发给设备，同时对设备的 Model 绑定对应的应用密钥以及更新 Mesh 设备的 Network transmit 参数，到此设备的完成配网完成。后续所有的业务都可以通过这三个密钥加密完成。  

配网者中有两种承载方式（详细可参考 Mesh Profile 1.0.1 中 5.2 章节）：

1. PB-ADV
配网者通过广播直接与未配网的 mesh 节点通信进行配网过程。此种方式一般适用于网关类配网者，此类配网者可以保持一致或者周期性 scan 空中的广播数据以及发送广播数据来做到与网络内节点通信。

2. PB-GATT
配网者通过 GATT 连接的方式与未配网的 mesh 节点进行连接后通过连接通道进行配网。一般应用于手机 App 此类的配网者。手机 App 一般无法保持长时间的 scan 能力，所以无法直接接收Mesh网络的消息，所以需要通过 GATT 连接未配网的设备进行通信。


这是蓝牙Mesh网络中**配网（Provisioning）流程**的示意图，描述一个新设备（Un-provisioned Device）如何加入Mesh网络，核心步骤如下：  
![alt text](image-59.png)  
 配网流程步骤分5个阶段，按顺序执行：  

| 步骤（右侧蓝色框）          | 作用与细节                                                                 |  
|-----------------------------|--------------------------------------------------------------------------|  
| **Beaconing（广播信标）**   | 未配网设备持续发蓝牙广播（含设备信息、UUID），配网者扫描周围“待配网设备”。       |  
| **Invitation（邀请）**      | 配网者选中标设备，发`Provisioning Invite`，协商安全等级（如是否需要密码/按键确认）。 |  
| **Exchanging Public Keys（交换公钥）** | 双方生成并交换公钥，基于椭圆曲线加密（ECC）生成共享密钥，为后续加密做准备。        |  
| **Authentication（认证）**  | 验证设备合法性，可选方式：<br> - 无认证（简单场景）<br> - 按键（设备按提示按物理键）<br> - 输入OOB码（如二维码、数字）。 |  
| **Distribution of Provisioning data（分发配网数据）** | 配网者加密发送：<br> - **NetKey**（网络密钥，Mesh网络的“通行证”）<br> - **单播地址**（设备在Mesh里的唯一ID）<br> - 其他参数（如TTL、安全配置）。设备存好数据，正式成为Mesh节点！ |  
#### nRF Mesh操作步骤
![扫描](image-60.png)  
![识别](image-61.png)  
这是蓝牙Mesh配网流程中，**配网者（Provisioner，如手机APP）获取到的待配网设备（ESP32）的关键信息**，用于完成设备入网，逐字段解析：  

| 字段                  | 含义 & 作用                                                                 |  
|-----------------------|----------------------------------------------------------------------------|  
| **Name**              | 设备名称（`ESP32`），配网者识别设备的标识                                   |  
| **Unicast Address**   | 预分配的单播地址（`0x0001`），设备入网后在Mesh网络中的“唯一ID”               |  
| **App Keys**          | 应用密钥（`AA7EF8628B445E6547343768B551896`），用于加密应用层消息（如控制指令） |  

配网者需要知道设备的“能力”，确保配网流程兼容，关键字段：  

| 字段                  | 含义 & 作用                                                                 |  
|-----------------------|----------------------------------------------------------------------------|  
| **Element Count**     | 元素数量（`3`），设备支持的Mesh元素个数（每个元素可对应不同功能，如开关、亮度调节） |  
| **Supported Algorithms** | 支持的加密算法（`FIPS P-256 Elliptic Curve`），即ECC椭圆曲线加密，用于配网时的密钥交换 |  
| **Public Key Type**   | 公钥类型（`Public key information unavailable`），可能设备未广播公钥，配网时动态交换 |  
| **Static OOB Type**   | 静态OOB（带外）类型（截图未完整显示），用于设备认证（如按键、二维码，此处可能无） |  

1. **左图（IDENTIFY）**：  
   配网者已发现设备，显示基础信息，点击 `IDENTIFY` 可触发设备“标识动作”（如LED闪烁、蜂鸣），确认要配网的设备。  

2. **右图（PROVISION）**：  
   点击 `IDENTIFY` 后，配网者获取设备详细能力（Capabilities），此时可点击 `PROVISION` 发起正式配网：  
   - 交换公钥 → 认证 → 分发NetKey、单播地址 → 设备入网。  

这是ESP32设备在蓝牙Mesh配网时，向配网者（手机APP）公开的“入网简历”：  
- 告诉配网者“我叫ESP32，想加入Mesh网络当`0x0001`号节点，支持ECC加密，有3个功能元素”；  
- 配网者看完简历，确认没问题就点`PROVISION`，把设备正式拉进Mesh网络！  

核心作用：让配网者掌握设备的“身份、网络ID、加密能力”，为安全入网做准备~

![配网](image-62.png)  


#### 一、配网核心流程（Provision阶段） 
蓝牙Mesh配网分多个子步骤，需双向交互完成，日志里的关键动作：  

| 日志条目                          | 含义 & 作用                                                                 |  
|-----------------------------------|----------------------------------------------------------------------------|  
| `Sending provisioning invite...`  | 配网者（手机APP）向设备发“配网邀请”，协商安全等级                           |  
| `Provisioning capabilities received...` | 设备回复“自身能力”（如元素数量、加密算法），配网者确认兼容性               |  
| `Sending provisioning start...`   | 配网者发“配网开始”指令，正式启动流程                                       |  
| `Sending provisioning public key...` | 交换公钥（ECC加密），生成共享密钥，为后续数据加密做准备                     |  
| `Provisioning public key received...` | 设备收到配网者公钥，完成密钥交换                                           |  
| `Sending provisioning confirmation...` | 配网者发“确认”消息，验证密钥交换结果                                       |  
| `Provisioning confirmation received...` | 设备回复“确认”，双方同步配网状态                                           |  
| `Sending provisioning data...`    | 配网者发“核心配网数据”：<br> - NetKey（网络密钥）<br> - 单播地址（`0x0001`）<br> - 其他配置（如TTL） |  
| `Provisioning complete received...` | 设备回复“配网完成”，基础入网流程结束                                       |  


#### 二、配置流程（Config Model阶段）  
配网成功后，还需配置设备的Mesh“组合数据”（Composition Data）和网络参数，确保功能可用：  

| 日志条目                          | 含义 & 作用                                                                 |  
|-----------------------------------|----------------------------------------------------------------------------|  
| `Sending composition data get...` | 配网者（如手机APP）主动向设备发送请求，索要**组合数据（Composition Data）**，包含设备支持的Mesh元素、模型（如开关模型、亮度调节模型）等功能描述信息，用于识别设备能提供哪些Mesh服务 | 配置阶段 - 功能发现 |
| `Sending block acknowledgements`  | 配网者发送**块确认消息**，因组合数据可能较长，采用分段传输，此消息用于确认已收到设备发来的部分组合数据，保证数据传输完整性 | 配置阶段 - 数据同步 |
| `Composition data status received...` | 设备回复**组合数据状态**，将自身支持的Mesh元素、模型等详细功能信息反馈给配网者，配网者据此知晓设备能力，比如设备有几个元素、每个元素关联哪些Mesh模型 | 配置阶段 - 功能反馈 |
| `Sending block acknowledgements`  | 再次发送块确认消息，确认收到设备完整的组合数据，确保配网者与设备的功能信息同步无误 | 配置阶段 - 数据同步 |
| `Sending default TTL get...`      | 配网者发送请求，获取设备**默认TTL（Time To Live，生存时间/跳数限制）**值，TTL决定Mesh消息在网络中最多能转发的次数，影响消息传播范围 | 配置阶段 - 网络参数获取 |
| `Default TTL status received...`  | 设备回复默认TTL状态，把自身默认的TTL数值告知配网者，配网者可基于此判断消息转发规则是否合理 | 配置阶段 - 网络参数反馈 |
| `Sending network transmit set...` | 配网者发送指令，设置设备的**网络传输参数**，比如调整Mesh消息的重传次数、间隔等，优化网络通信稳定性 | 配置阶段 - 网络参数配置 |
| `Network transmit status received...` | 设备回复网络传输状态，告知配网者网络传输参数设置是否成功、当前生效的传输参数情况，确认网络通信配置完成 | 配置阶段 - 网络参数确认 | 


#### 三、最终结果（`Configuration Complete`）  
- **日志关键**：`Configuration Complete` + `Mesh node has been successfully configured.`  
- **含义**：设备已完成**全部配网+配置流程**，正式成为Mesh网络中的节点，可收发Mesh消息（如控制指令、状态上报）。  

这是**PHY-MSHLIGHT设备成功加入蓝牙Mesh网络的完整流程**，从“陌生人”（未配网）到“正式成员”（可通信），经历了：  
1. 配网邀请→能力交换→密钥协商→数据分发→配网完成；  
2. 再补充配置组合数据、网络参数；  
3. 最终“配置完成”，设备可正常在Mesh网络中工作！  

简单说：设备入网成功，现在能听话干活啦（比如接收开关、调光指令）~
### 配网成功
当设备配网成功后，开发板上的 RGB 灯会熄灭，此时 App 会执行以下几个步骤：

和该节点（设备配网后成为节点）断开连接

尝试和该节点重新建立连接

连接成功并且发现了相应的 ESP-BLE-MESH GATT 服务

获取节点的 Composition Data (获取设备支持的 Mesh 模型 / 元素)并且给该节点添加 AppKey
![alt text](image-63.png)

### 配置
当成功配网和初始配置完成后，用户可以配置节点的其余信息，例如将 AppKey 绑定至每个元素 (element) 的每个模型 (model) 中、设置模型的发布信息等。

下图展示了如何将 AppKey 绑定至 Primary Element 中的 Generic OnOff Server Model 上。
![alt text](image-64.png)  
> 用户不需要将 AppKey 绑定至 Configuration Server Model（配置模型），因为该模型使用 DevKey 在 Upper Transport Layer 中对消息进行加密。

## 快速配网
### 演示功能

本演示展示了 ESP BLE Mesh 网络的快速配网功能，以及如何使用 EspBleMesh 应用程序控制单个已配网节点或所有已配网节点。
此示例的视频可从[这里](https://dl.espressif.com/BLE/public/ESP32_BLE_Mesh_Fast_Provision.mp4)观看。

### 所需物品

* [安卓版 EspBleMesh 应用](https://github.com/EspressifApp/EspBLEMeshForAndroid/releases/tag/v1.1.0)
* [esp-idf](https://github.com/espressif/esp-idf)
* ESP32 开发板

> 注意：
>
> 1. 请先将 [`fast_prov_server`](../../) 固件烧录到开发板；
> 2. 为了更好地了解 BLE Mesh 网络的性能，建议网络中至少添加 3 台设备。
> 3. 如果您的开发板没有自带指示灯，建议焊接 LED 指示灯。
> 4. 请通过运行 `idf.py menuconfig` 检查 `Example BLE Mesh Config` 中启用的板型和 LED 引脚定义  

![开发板](image-65.png)  

### 烧录和监控

1. 进入目录：
examples/bluetooth/esp_ble_mesh/fast_provisioning/fast_prov_server
2. 确保 `IDF_PATH` 环境变量已根据您当前的 IDF 路径进行设置
3. 检查工具链版本。应使用 4.1 或更新版本。  
![检查环境](image-66.png)  

4. 运行 `idf.py -p PORT flash` 编译代码并将代码烧录到设备。  
![编译代码](image-67.png)  

> 注意：
>
> 如果您看到以下窗口，请点击退出按钮。


5. 如果您想在电脑上监控该设备的运行情况，请使用正确的序列号建立设备与电脑之间的连接。

### 如何使用应用程序

请启动 `EspBleMesh` 应用程序，并按照以下步骤建立 BLE Mesh 网络并控制任何单个节点或所有节点。  

![应用步骤](image-68.png)  
1. 点击左上角查看更多选项；
2. 点击**配网**扫描附近未配网的设备；
3. 从扫描列表中选择任何未配网的设备；
4. 输入您想要添加到网格网络中的设备数量；
> 注意：
>
> 如果您只想使用普通配网功能，请勿勾选快速配网选项。
5. 等待所有设备配网完成；
6. 点击左上角查看更多选项；
7. 点击**快速配网**查看所有已配网的设备；
8. 控制您的设备。

> 注意：
>
> 如果遇到任何连接问题，请关闭手机的蓝牙功能，再重新开启并尝试。


### 流程

#### 角色

* 手机 - 顶级配网者
* 已由手机配网的设备 - 主配网者
* 已配网并转换为配网者角色的设备 - 临时配网者
* 已配网但未转换为配网者角色的设备 - 节点

#### 交互
![交互](image-69.png)
1. 顶级配网者通过 GATT 载体配置第一个设备接入网络。
2. 顶级配网者发送 `send_config_appkey_add` 消息，为该设备分配 Appkey。
3. 顶级配网者发送 `send_fast_prov_info_set` 消息，提供必要信息，使该设备能转换为主配网者。
4. 设备调用 `esp_ble_mesh_set_fast_prov_action` API，将自身转换为主配网者，并与顶级配网者断开连接。
5. 主配网者发送 `send_config_appkey_add` 消息，为另一台设备分配 Appkey。
6. 主配网者发送 `send_fast_prov_info_set` 消息，提供必要信息，使该设备能转换为临时配网者。
7. 设备调用 `esp_ble_mesh_set_fast_prov_action` API，将自身转换为临时配网者，并启动其地址计时器。
8. 当临时配网者的地址计时器超时（表明临时配网者在 10 秒内未配网任何设备），它会收集自己已配网节点的地址，并将这些地址发送给主配网者。
9. 当主配网者的地址计时器超时（表明主配网者在 10 秒内未收到任何来自临时配网者的消息），主配网者会重新连接到顶级配网者。
10. 顶级配网者在与主配网者重新连接后，会自动发送 `node_adress_Get` 消息。
11. 此时，顶级配网者能够控制 BLE Mesh 网络中的任何节点。

> 注意：
>
> BLE Mesh 网络中的节点只有在被顶级配网者至少控制过一次后，才会禁用其配网者功能。

### 服务器代码实现
#### 1.2 节点组成

本演示只有一个元素，其中实现了以下五个模型：

- **配置服务器**模型用于表示设备的 mesh 网络配置。
- **配置客户端**模型用于表示可以控制和监控节点配置的元素。
- **通用开关服务器**模型实现节点的开关状态。
- **供应商服务器**模型实现节点的`fast_prov_server`状态。
- **供应商客户端**模型用于控制`fast_prov_server`状态，该状态定义了节点的快速配网行为。


#### 2. 代码分析

代码初始化部分参考[初始化蓝牙和 BLE Mesh](../../../wifi_coexist/tutorial/BLE_Mesh_WiFi_Coexist_Example_Walkthrough.md)。

##### 2.1 数据结构

本节介绍本演示的`example_fast_prov_server_t`结构体及其分组变量。

```
typedef struct {
    esp_ble_mesh_model_t *model;    /* 快速配网服务器模型指针 */
    ATOMIC_DEFINE(srv_flags, SRV_MAX_FLAGS);

    bool     primary_role;  /* 指示设备是否为主要配网者 */
    uint8_t  max_node_num;  /* 配网者可配网的最大设备数量 */
    uint8_t  prov_node_cnt; /* 自行配网的节点数量 */
    uint16_t app_idx;       /* 其他配网者添加的应用程序密钥的 AppKey 索引 */
    uint16_t top_address;   /* 触发快速配网的设备（如手机）的地址 */

    esp_ble_mesh_msg_ctx_t ctx; /* 用于发送快速配网状态消息的存储上下文 */
    struct fast_prov_info_set *set_info;    /* 用于存储接收到的快速配网信息设置上下文 */

    uint16_t node_addr_cnt;     /* 应接收的节点地址数量 */
    uint16_t unicast_min;       /* 可发送给其他节点的最小单播地址 */
    uint16_t unicast_max;       /* 可发送给其他节点的最大单播地址 */
    uint16_t unicast_cur;       /* 当前可分配的单播地址 */
    uint16_t unicast_step;      /* 单播地址变更步长 */
    uint8_t  flags;             /* 标志状态 */
    uint32_t iv_index;          /* Iv_index 状态 */
    uint16_t net_idx;           /* Netkey 索引状态 */
    uint16_t group_addr;        /* 订阅的组地址 */
    uint16_t prim_prov_addr;    /* 主要配网者的单播地址 */
    uint8_t  match_val[16];     /* 用于与未配网设备 UUID 比较的匹配值 */
    uint8_t  match_len;         /* 要比较的匹配值的长度 */

    uint8_t  pend_act;          /* 待执行的挂起操作 */
    uint8_t  state;             /* 快速配网状态 -> 0：空闲，1：挂起，2：活跃 */

    struct k_delayed_work disable_fast_prov_timer;  /* 用于禁用快速配网 */
    struct k_delayed_work gatt_proxy_enable_timer;  /* 用于 Mesh GATT 代理功能 */
} __attribute__((packed)) example_fast_prov_server_t;
```


###### 2.1.1 配网者角色和状态

不同的配网者有不同的行为，了解不同角色的概念有助于更好地理解代码。

在该结构体中，有三个与角色和状态相关的变量，如下表所述：

| 变量名        | 描述               |
| ---------------------|------------------------- |
| `primary_role`      | 配网者身份 |
| `state`      | 快速配网者状态（0：空闲，1：挂起，2：活跃） |
| `srv_flags`  | 标志（`disable_FAST_PROV_START`、`GATT_PROXY_ENABLE_START`、`RELAY_PROXY_DISABLED`、`SRV_MAX_FLAGS`） |

其中，本演示中有四种角色（`primary_role`）：

* 手机 - 顶级配网者
* 已由手机配网的设备 - 主要配网者
* 已配网并已转换为配网者角色的设备 - 临时配网者
* 已配网但未转换为配网者角色的设备 - 节点


###### 2.1.2 配网者地址管理

配网者地址管理用于为每个节点分配单播地址，通过均衡分配地址来防止地址冲突。每个配网者都有自己的地址范围和可配网的最大节点数量。配网者会将其地址范围的一个子集分配给它已配网的节点。

示例：顶级配网者的地址范围是 0 到 100，可配网的最大节点数量是 5。配网者地址管理将为这 5 个节点分配地址范围子集，分别是 1 到 20、21 到 40、41 到 60、61 到 80 和 81 到 100。

与地址管理相关的变量如下表所述：

| 变量名        | 描述               |
| ----------------------|------------------------- |
| `unicast_min`      | 可分配给其他节点的最小单播地址 |
| `unicast_max`      | 可分配给其他节点的最大单播地址 |
| `unicast_cur`      | 当前单播地址 |
| `unicast_step`     | 单播地址变更步长偏移量|

###### 2.1.3 配网者缓存数据

缓存数据是必需的，以便节点可以转换角色成为配网者。在此过程中，会调用`esp_ble_mesh_set_fast_prov_info`和`esp_ble_mesh_set_fast_prov_action`API。

节点的缓存数据由配网者发送，如下表所述：

| 变量名        | 描述               |
| ----------------------|------------------------- |
| `flags`       | 标志状态|
| `iv_index`    | Iv_index 状态|
| `net_idx`     | Netkey 索引状态 |
| `group_addr`  | 订阅的组地址 |
| `prim_prov_addr`  | 主要配网者的单播地址 |
| `match_val[16]`  | 用于与未配网设备 UUID 比较的匹配值 |
| `match_len`   | 要比较的匹配值的长度 |
| `max_node_num`   | 配网者可配网的最大设备数量 |
| `prov_node_cnt`   | 自行配网的节点数量 |
| `app_idx`   | 其他配网者添加的应用程序密钥的 AppKey 索引 |
| `top_address`   | 触发快速配网的设备（如手机）的地址 |


###### 2.1.4 配网者定时器

本演示中有两个定时器，分别是：

1. `gatt_proxy_enable_timer`用于启用 Mesh GATT 代理功能。
  * 当临时配网者为未配网设备配网时，定时器启动或重置并启动。
  * 临时配网者将向主要配网者发送一条消息（地址信息）。
2. `disable_fast_prov_timer`用于禁用配网功能。
  * 当节点接收到 EspBleMesh 应用程序发送的**通用开关获取/设置/无确认设置**消息时，启动该定时器。如果要禁用所有节点的配网功能，应使用组地址。

与这两个定时器相关的变量如下所述：

| 变量名        | 描述               |
| ----------------------|------------------------- |
| `disable_fast_prov_timer`       | 用于禁用快速配网|
| `gatt_proxy_enable_timer`       | 用于启用 Mesh GATT 代理功能|

##### 2.2 模型定义

###### 2.2.1 供应商服务器模型

**供应商服务器**模型实现节点的`fast_prov_server`状态，上一节已介绍。

```c
example_fast_prov_server_t fast_prov_server = {
    .primary_role  = false,
    .max_node_num  = 6,
    .prov_node_cnt = 0x0,
    .unicast_min   = ESP_BLE_MESH_ADDR_UNASSIGNED,
    .unicast_max   = ESP_BLE_MESH_ADDR_UNASSIGNED,
    .unicast_cur   = ESP_BLE_MESH_ADDR_UNASSIGNED,
    .unicast_step  = 0x0,
    .flags         = 0x0,
    .iv_index      = 0x0,
    .net_idx       = ESP_BLE_MESH_KEY_UNUSED,
    .app_idx       = ESP_BLE_MESH_KEY_UNUSED,
    .group_addr    = ESP_BLE_MESH_ADDR_UNASSIGNED,
    .prim_prov_addr = ESP_BLE_MESH_ADDR_UNASSIGNED,
    .match_len     = 0x0,
    .pend_act      = FAST_PROV_ACT_NONE,
    .state         = STATE_IDLE,
};
```

`fast_prov_srv_op`用于注册消息的最小长度。例如，`ESP_BLE_MESH_VND_MODEL_OP_FAST_PROV_INFO_SET`消息的最小长度注册为 3 个八位字节。

```c
static esp_ble_mesh_model_op_t fast_prov_srv_op[] = {
    { ESP_BLE_MESH_VND_MODEL_OP_FAST_PROV_INFO_SET,      3,  NULL },
    { ESP_BLE_MESH_VND_MODEL_OP_FAST_PROV_NET_KEY_ADD,   16, NULL },
    { ESP_BLE_MESH_VND_MODEL_OP_FAST_PROV_NODE_ADDR,     2,  NULL },
    { ESP_BLE_MESH_VND_MODEL_OP_FAST_PROV_NODE_ADDR_GET, 0,  NULL },
    ESP_BLE_MESH_MODEL_OP_END,
};

```
`example_fast_prov_server_init`函数用于注册定时器超时触发的回调函数，并初始化数据结构体中与模型相关的变量。

```c
err = example_fast_prov_server_init(&vnd_models[0]);
if (err != ESP_OK) {
    ESP_LOGE(TAG, "%s: 初始化快速配网服务器模型失败", __func__);
    return err;  
}
```

`fast_prov_server`结构体表示供应商服务器的状态。常量`CID_ESP`和`ESP_BLE_MESH_VND_MODEL_ID_FAST_PROV_SRV`组成了供应商服务器模型的模型 ID`ESP_BLE_MESH_VND_MODEL_ID_FAST_PROV_SRV`，用于标识供应商服务器模型。


```c
static esp_ble_mesh_model_t vnd_models[] = {
    ESP_BLE_MESH_VENDOR_MODEL(CID_ESP, ESP_BLE_MESH_VND_MODEL_ID_FAST_PROV_SRV,
    fast_prov_srv_op, NULL, &fast_prov_server),
};
static esp_ble_mesh_elem_t elements[] = {
    ESP_BLE_MESH_ELEMENT(0, root_models, vnd_models),
};
```


###### 2.2.2 供应商客户端模型

**供应商客户端**模型用于控制`fast_prov_server`状态，该状态定义了节点的快速配网行为。

`fast_prov_cli_op_pair`结构体用于注册相应的消息确认。

```c
static const esp_ble_mesh_client_op_pair_t fast_prov_cli_op_pair[] = {
    { ESP_BLE_MESH_VND_MODEL_OP_FAST_PROV_INFO_SET,      ESP_BLE_MESH_VND_MODEL_OP_FAST_PROV_INFO_STATUS      },
    { ESP_BLE_MESH_VND_MODEL_OP_FAST_PROV_NET_KEY_ADD,   ESP_BLE_MESH_VND_MODEL_OP_FAST_PROV_NET_KEY_STATUS   },
    { ESP_BLE_MESH_VND_MODEL_OP_FAST_PROV_NODE_ADDR,     ESP_BLE_MESH_VND_MODEL_OP_FAST_PROV_NODE_ADDR_ACK    },
    { ESP_BLE_MESH_VND_MODEL_OP_FAST_PROV_NODE_ADDR_GET, ESP_BLE_MESH_VND_MODEL_OP_FAST_PROV_NODE_ADDR_STATUS },
};
```

示例：**供应商客户端**模型发送操作码为`ESP_BLE_MESH_VND_MODEL_OP_FAST_PROV_INFO_SET`的消息，要求**供应商服务器**模型返回操作码为`ESP_BLE_MESH_VND_MODEL_OP_FAST_PROV_INFO_STATUS`的消息。之后，如果**供应商客户端**模型未收到相应的确认，将会超时。

```c
static const esp_ble_mesh_client_op_pair_t fast_prov_cli_op_pair[] = {
    { ESP_BLE_MESH_VND_MODEL_OP_FAST_PROV_INFO_SET,      ESP_BLE_MESH_VND_MODEL_OP_FAST_PROV_INFO_STATUS      },
};
```
注意，如果不希望**供应商客户端**模型等待服务器模型的确认，也可以使用以下代码，这意味着客户端模型永远不会超时。

```c
static const esp_ble_mesh_client_op_pair_t fast_prov_cli_op_pair[] = {
    { ESP_BLE_MESH_VND_MODEL_OP_FAST_PROV_INFO_SET,      NULL      },
};
```

`esp_ble_mesh_client_model_init`API 用于注册定时器超时触发的回调函数，并初始化数据结构体中与模型相关的变量。

```c
err = esp_ble_mesh_client_model_init(&vnd_models[1]);
if (err != ESP_OK) {
    ESP_LOGE(TAG, "%s: 初始化快速配网客户端模型失败", __func__);
    return err;
}
```

常量`CID_ESP`和`ESP_BLE_MESH_VND_MODEL_ID_FAST_PROV_CLI`组成了供应商客户端模型的模型 ID`ESP_BLE_MESH_VND_MODEL_ID_FAST_PROV_CLI`，用于标识供应商客户端模型。

```c

esp_ble_mesh_client_t fast_prov_client = {
    .op_pair_size = ARRAY_SIZE(fast_prov_cli_op_pair),
    .op_pair = fast_prov_cli_op_pair,
};

static esp_ble_mesh_model_op_t fast_prov_cli_op[] = {
    { ESP_BLE_MESH_VND_MODEL_OP_FAST_PROV_INFO_STATUS,    1, NULL },
    { ESP_BLE_MESH_VND_MODEL_OP_FAST_PROV_NET_KEY_STATUS, 2, NULL },
    { ESP_BLE_MESH_VND_MODEL_OP_FAST_PROV_NODE_ADDR_ACK,  0, NULL },
    ESP_BLE_MESH_MODEL_OP_END,
};

static esp_ble_mesh_model_t vnd_models[] = {
    ESP_BLE_MESH_VENDOR_MODEL(CID_ESP, ESP_BLE_MESH_VND_MODEL_ID_FAST_PROV_CLI,
    fast_prov_cli_op, NULL, &fast_prov_client),
};
static esp_ble_mesh_elem_t elements[] = {
    ESP_BLE_MESH_ELEMENT(0, root_models, vnd_models),
};

```

#### 2.3 消息操作码

“操作码-发送”表示客户端发送给服务器的消息。

“操作码-确认”表示服务器发送给客户端的消息。

* 信息设置（INFO_SET）

| 含义 | 操作码-发送   | 操作码-确认   |                  
| -----| ------------- | -------------|
| 操作码 | `ESP_BLE_MESH_VND_MODEL_OP_FAST_PROV_INFO_SET` | `ESP_BLE_MESH_VND_MODEL_OP_FAST_PROV_INFO_STATUS`    |
| 功能 | 此消息包含作为配网者的所有信息 | 检查配网者信息的每个字段并设置相应的标志位。返回的状态是可变的。|
| 参数 | structfast_prov_info_set | status_bit_mask、status_ctx_flag、status_unicast、status_net_idx、status_group、status_pri_prov、status_match、status_action|


* 节点地址（NODE_ADDR）

| 含义 | 操作码-发送   | 操作码-确认   |                  
| -----| ------------- | -------------|
| 操作码 | `ESP_BLE_MESH_VND_MODEL_OP_FAST_PROV_NODE_ADDR`  | `ESP_BLE_MESH_VND_MODEL_OP_FAST_PROV_NODE_ADDR_ACK`  |
| 功能 | 临时配网者报告其已配网的节点的地址。 | 用于检查消息是否发送成功。 |
| 参数 | 地址数组    | 无   |

* 地址获取（ADDR_GET）

| 含义 | 操作码-发送   | 操作码-确认   |                  
| -----| ------------- | -------------|
| 操作码 | `ESP_BLE_MESH_VND_MODEL_OP_FAST_PROV_NODE_ADDR_GET` | `ESP_BLE_MESH_VND_MODEL_OP_FAST_PROV_NODE_ADDR_STATUS`  |
| 功能 | 顶级配网者从主要配网者获取所有节点的地址。 | 返回所有节点的地址，但不包含自身地址。     |
| 参数 | 无    | 地址数组    |

* 网络密钥添加（NET_KEY_ADD）

| 含义 | 操作码-发送   | 操作码-确认   |                  
| -----| ------------- | -------------|
| 操作码 | `ESP_BLE_MESH_VND_MODEL_OP_FAST_PROV_NET_KEY_ADD`   | `ESP_BLE_MESH_VND_MODEL_OP_FAST_PROV_NET_KEY_STATUS`    |
| 功能 | 预留供以后使用   | 预留供以后使用     |
| 参数 | 无   | 无     |


##### 2.4 回调函数
###### 2.4.1 供应商服务器模型的回调函数

```c
    esp_ble_mesh_register_custom_model_callback(example_ble_mesh_custom_model_cb);
    esp_ble_mesh_register_prov_callback(example_ble_mesh_provisioning_cb);
```

1. 当**供应商服务器**模型出现以下情况时，将触发回调函数：
  * 接收到指示客户端模型开关状态的消息；或者
  * 调用任何发送消息的 API。

2. 此回调函数处理的事件：

* 通用开关服务器模型

| 事件名称    | 操作码      | 描述                                 |
| ------------- | ------------|------------------------------------------- |
| ESP_BLE_MESH_MODEL_OPERATION_EVT|ESP_BLE_MESH_MODEL_OP_GEN_ONOFF_SET | 当**通用开关服务器**模型接收到`ESP_BLE_MESH_MODEL_OP_GEN_ONOFF_SET`消息时，触发此事件 |
| ESP_BLE_MESH_MODEL_OPERATION_EVT|ESP_BLE_MESH_MODEL_OP_GEN_ONOFF_SET_UNACK| 当**通用开关服务器**模型接收到`ESP_BLE_MESH_MODEL_OP_GEN_ONOFF_SET_UNACK`消息时，触发此事件。 |

* 供应商服务器模型

| 事件名称    | 操作码      | 描述                                 |
| ------------- | ------------|------------------------------------------- |
| ESP_BLE_MESH_MODEL_OPERATION_EVT | ESP_BLE_MESH_VND_MODEL_OP_FAST_PROV_INFO_SET  | 当**供应商服务器**模型接收到`ESP_BLE_MESH_VND_MODEL_OP_FAST_PROV_INFO_SET`消息时，触发此事件。|
| ESP_BLE_MESH_MODEL_OPERATION_EVT | ESP_BLE_MESH_VND_MODEL_OP_FAST_PROV_NODE_ADDR    | 当**供应商服务器**模型接收到`ESP_BLE_MESH_VND_MODEL_OP_FAST_PROV_NODE_ADDR`消息时，触发此事件。|
| ESP_BLE_MESH_MODEL_OPERATION_EVT | ESP_BLE_MESH_VND_MODEL_OP_FAST_PROV_NODE_ADDR_GET    | 当**供应商服务器**模型接收到`ESP_BLE_MESH_VND_MODEL_OP_FAST_PROV_NODE_ADDR_GET`消息时，触发此事件。|

* **配置客户端**模型

| 事件名称    | 操作码      | 描述                                 |
| ------------- | ------------|------------------------------------------- |
|ESP_BLE_MESH_SET_FAST_PROV_INFO_COMP_EVT| 无| 当调用`esp_ble_mesh_set_fast_prov_info`API 时，触发此事件。  |
|ESP_BLE_MESH_SET_FAST_PROV_ACTION_COMP_EVT| 无| 当调用`esp_ble_mesh_set_fast_prov_action`API 时，触发此事件。 |
|ESP_BLE_MESH_CFG_CLIENT_SET_STATE_EVT|ESP_BLE_MESH_MODEL_OP_APP_KEY_ADD|当**配置服务器**模型接收到消息并进一步触发 API 调用来发送`ESP_BLE_MESH_VND_MODEL_OP_FAST_PROV_INFO_SET`消息时，触发此事件。 |
|ESP_BLE_MESH_CFG_CLIENT_TIMEOUT_EVT|ESP_BLE_MESH_MODEL_OP_APP_KEY_ADD|当`example_send_config_appkey_add`API 超时时，触发此事件。|

###### 2.4.2 供应商客户端模型

```c
    esp_ble_mesh_register_custom_model_callback(example_ble_mesh_custom_model_cb);
```

1. 当**供应商客户端**模型出现以下情况时，将触发回调函数：
  * 接收到供应商服务器模型发送的任何消息；或者
  * 调用任何发送消息的 API。

2. 此回调函数处理的事件：

| 事件名称    | 操作码      | 描述                                 |
| ------------- | ------------|------------------------------------------- |
| ESP_BLE_MESH_MODEL_OPERATION_EVT   | ESP_BLE_MESH_VND_MODEL_OP_FAST_PROV_INFO_STATUS  | 当**供应商客户端**模型接收到`ESP_BLE_MESH_VND_MODEL_OP_FAST_PROV_INFO_STATUS`消息时，触发此事件。|
| ESP_BLE_MESH_MODEL_OPERATION_EVT   | ESP_BLE_MESH_VND_MODEL_OP_FAST_PROV_NET_KEY_STATUS | 当**供应商客户端**模型接收到`ESP_BLE_MESH_VND_MODEL_OP_FAST_PROV_NET_KEY_STATUS`消息时，触发此事件。|
| ESP_BLE_MESH_MODEL_OPERATION_EVT   | ESP_BLE_MESH_VND_MODEL_OP_FAST_PROV_NODE_ADDR_ACK  | 当**供应商客户端**模型接收到`ESP_BLE_MESH_VND_MODEL_OP_FAST_PROV_NODE_ADDR_ACK`消息时，触发此事件 |
| ESP_BLE_MESH_CLIENT_MODEL_SEND_TIMEOUT_EVT     | client_send_timeout.opcode    | 当`esp_ble_mesh_client_model_send_msg`API 超时时，触发此事件。|

##### 2.5 消息发送
###### 2.5.1 供应商客户端发送消息

供应商客户端模型调用`esp_ble_mesh_client_model_send_msg`API 向供应商服务器模型发送消息。

| 参数名称        | 描述               |
| ----------------------|------------------------- |
| `model`       | 客户端模型结构体的指针  |
| `ctx.net_idx` | 发送消息所经过的子网的 NetKey 索引 |
| `ctx.app_idx` | 用于消息加密的 AppKey 索引 |
| `ctx.addr`    | 目标节点的地址 |
| `ctx.send_ttl`| TTL 状态，决定消息可被中继的次数|
| `opcode`      | 消息操作码  |
| `msg->len`    | `msg->data`的长度|
| `msg->data`   | 要发送的数据的指针|
| `msg_timeout` | 模型等待确认的最长持续时间（默认 4000 毫秒）。  |
|`true`         | 真：需要确认；假：不需要确认 |

```c
esp_ble_mesh_msg_ctx_t ctx = {
    .net_idx  = info->net_idx,
    .app_idx  = info->app_idx,
    .addr     = info->dst, 
    .send_ttl = 0,
 };
 err = esp_ble_mesh_client_model_send_msg(model, &ctx,
        ESP_BLE_MESH_VND_MODEL_OP_FAST_PROV_INFO_SET,
        msg->len, msg->data, info->timeout, true, info->role);
```

###### 2.5.2 供应商服务器发送消息

**供应商服务器**模型在调用`esp_ble_mesh_server_model_send_msg`API 发送消息之前，必须绑定其 Appkey。

```c
esp_ble_mesh_server_model_send_msg(model, ctx, ESP_BLE_MESH_VND_MODEL_OP_FAST_PROV_INFO_STATUS,
                                   msg->len ,msg->data );
```
**供应商服务器**模型调用`esp_ble_mesh_model_publish`API 发布消息。只有已订阅此目标地址的模型才能接收发布的消息。

```c
esp_err_t esp_ble_mesh_model_publish(esp_ble_mesh_model_t *model, uint32_t opcode,
                                     uint16_t length, uint8_t *data,
                                     esp_ble_mesh_dev_role_t device_role);
```
### 客户端代码实现
#### 1.2 节点构成

本演示例仅有一个元素，其中实现了以下四个模型：

- **配置服务器**模型用于表示设备的 mesh 网络配置。
- **配置客户端**模型用于表示能够控制和监控节点配置的元素。
- **通用开关客户端**模型通过**通用开关**模型定义的消息来控制通用开关服务器（本演示例中为控制灯的开关）。
- **供应商客户端**模型用于控制`fast_prov_server`状态，该状态定义了节点的快速配网行为。

**注：有关这些模型的详细信息，请参考其他 BLE Mesh 演示例。**

#### 2. 代码分析

代码初始化部分参考[初始化蓝牙和 BLE Mesh](../../../wifi_coexist/tutorial/BLE_Mesh_WiFi_Coexist_Example_Walkthrough.md)。

##### 2.1 数据结构

`example_prov_info_t`用于定义密钥、节点可分配的地址范围以及 mesh 网络支持的最大节点数。

| 名称 | 描述 |
| ---------------------- | ------------------------- |
| `net_idx` | 网络密钥索引值 |
| `app_idx` | 应用密钥索引值 |
| `app_key[16]` | 应用密钥，在整个网络中使用 |
| `node_addr_cnt` |  mesh 网络支持的最大节点数，其作用与 EspBleMesh 应用程序中的“快速配网数量”参数相同 |
| `unicast_min` | 要分配给 mesh 网络中节点的最小单播地址 |
| `unicast_max` | 要分配给 mesh 网络中节点的最大单播地址 |
| `group_addr` | 组地址，用于控制 mesh 网络中所有节点的开关状态，在本演示例中即控制灯的开关 |
| `match_val[16]` | 快速配网配网器用于筛选待配网设备的值 |
| `match_len` | `match_val[16]`的最大长度 |
| `max_node_num` | 客户端可配网的最大节点数 |

##### 2.2 代码流程

本节中的事件和 API 按照代码执行的顺序呈现。

##### 2.2.1 初始化

###### 2.2.1.1 设置 UUID 过滤器

配网器调用`esp_ble_mesh_provisioner_set_dev_uuid_match` API 来设置开始配网前要比较的设备 UUID 的部分内容。

```
/**
 * @brief         配网器调用此函数设置开始配网前要比较的设备 UUID 的部分内容。
 *
 * @param[in]     match_val: 要与设备 UUID 的部分内容进行比较的值。
 * @param[in]     match_len: 要比较的匹配值的长度。
 * @param[in]     offset: 要比较的设备 UUID 的偏移量（基于零）。
 * @param[in]     prov_after_match: 标志，用于指示如果 UUID 的部分内容匹配，配网器是否应立即开始对设备进行配网。
 *
 * @return        成功时返回 ESP_OK，否则返回错误代码。
 *
 */
esp_err_t esp_ble_mesh_provisioner_set_dev_uuid_match(const uint8_t *match_val, uint8_t match_len,
        uint8_t offset, bool prov_after_match);
```

```c
err = esp_ble_mesh_provisioner_set_dev_uuid_match(match, 0x02, 0x00, false);
if (err != ESP_OK) {
    ESP_LOGE(TAG, "%s: 设置匹配设备 UUID 失败", __func__);
    return ESP_FAIL;
}
```

###### 2.2.1.2 添加本地 Appkey

配网器初始化后没有 Appkey。因此，必须通过调用`esp_ble_mesh_provisioner_add_local_app_key`为配网器添加本地 Appkey。

```c
err = esp_ble_mesh_provisioner_add_local_app_key(prov_info.app_key, prov_info.net_idx, prov_info.app_idx);
if (err != ESP_OK) {
    ESP_LOGE(TAG, "%s: 添加本地应用密钥失败", __func__);
    return ESP_FAIL;
}
```

请检查 API 调用的返回值以及`ESP_BLE_MESH_PROVISIONER_ADD_LOCAL_APP_KEY_COMP_EVT`的返回值，确保 Appkey 已添加到此配网器。

###### 2.2.1.3 将 Appkey 绑定到本地模型

为了控制服务器模型，客户端模型使用消息来控制服务器模型，这些消息必须通过 Appkey 进行加密。为此，用户必须通过调用`esp_ble_mesh_provisioner_add_local_app_key` api 将配网器的 Appkey 绑定到其本地模型，即**通用开关客户端**模型和**供应商客户端**模型。

```c
prov_info.app_idx = param->provisioner_add_app_key_comp.app_idx;
err = esp_ble_mesh_provisioner_bind_app_key_to_local_model(PROV_OWN_ADDR, prov_info.app_idx,
                                              ESP_BLE_MESH_MODEL_ID_GEN_ONOFF_CLI, ESP_BLE_MESH_CID_NVAL);
if (err != ESP_OK) {
    ESP_LOGE(TAG, "%s: 将 AppKey 与开关客户端模型绑定失败", __func__);
    return;
}
err = esp_ble_mesh_provisioner_bind_app_key_to_local_model(PROV_OWN_ADDR, prov_info.app_idx,
                                            ESP_BLE_MESH_VND_MODEL_ID_FAST_PROV_CLI, CID_ESP);
if (err != ESP_OK) {
    ESP_LOGE(TAG, "%s: 将 AppKey 与快速配网客户端模型绑定失败", __func__);
    return;
}
```

请检查 API 调用的返回值以及`ESP_BLE_MESH_PROVISIONER_ADD_LOCAL_APP_KEY_COMP_EVT`事件的返回值，确保 Appkey 已绑定到本地模型。

##### 2.2.2 设备配网

未配网设备持续发送**未配网设备**信标，其中包含其 UUID 值。

* 如果 UUID 匹配，将触发`ESP_BLE_MESH_PROVISIONER_RECV_UNPROV_ADV_PKT_EVT`事件，该事件会将未配网设备信息添加到待配网设备队列中。

  ```c
  err = esp_ble_mesh_provisioner_add_unprov_dev(&add_dev, flag);
  if (err != ESP_OK) {
      ESP_LOGE(TAG, "%s: 开始设备配网失败", __func__);
      return;
  }

  if (!reprov) {
      if (prov_info.max_node_num) {
          prov_info.max_node_num--;
  }
  }
  ```
* 如果不匹配，则忽略该设备。

之后，队列中的所有设备将自动进行配网。

##### 2.2.3 发送缓存数据

Appkey 是该节点成为配网器所需的缓存之一。

配网完成后，将触发`ESP_BLE_MESH_PROVISIONER_PROV_COMPLETE_EVT`事件，该事件通过调用`esp_ble_mesh_config_client_set_state` API 将 Appkey 添加到节点的**配置服务器**模型：

```c
common.opcode       = ESP_BLE_MESH_MODEL_OP_APP_KEY_ADD;
common.model        = model;
common.ctx.net_idx  = info->net_idx;
common.ctx.app_idx  = 0x0000; /* 配置消息不使用 */
common.ctx.addr     = info->dst;
common.ctx.send_ttl = 0;
common.msg_timeout  = info->timeout;

return esp_ble_mesh_config_client_set_state(&common, &set);
```

* 如果 API 调用成功，将触发`ESP_BLE_MESH_CFG_CLIENT_SET_STATE_EVT`事件，该事件通过调用`example_send_fast_prov_info_set`函数向节点的**供应商服务器**模型发送其他缓存信息（`example_fast_prov_info_set_t`）；
  * 如果（`example_send_fast_prov_info_set`）API 调用成功，将发送一个操作码为`ESP_BLE_MESH_VND_MODEL_OP_FAST_PROV_INFO_SET`的消息，其确认消息（操作码为`ESP_BLE_MESH_VND_MODEL_OP_FAST_PROV_INFO_STATUS`）将进一步触发`ESP_BLE_MESH_MODEL_OPERATION_EVT`事件
    ```c
    err = example_send_fast_prov_info_set(fast_prov_client.model, &info, &set);
    if (err != ESP_OK) {
        ESP_LOGE(TAG, "%s: 设置快速配网信息设置消息失败", __func__);
      return;
    }
    ```
  * 如果（`example_send_fast_prov_info_set`）API 调用超时，将触发`ESP_BLE_MESH_CLIENT_MODEL_SEND_TIMEOUT_EVT`事件。
* 如果 API 调用超时，将触发`ESP_BLE_MESH_CFG_CLIENT_TIMEOUT_EVT`事件。

之后，该节点具备作为配网器对其他节点进行配网的能力，并能进一步控制其他节点。

**注：操作码为`ESP_BLE_MESH_VND_MODEL_OP_FAST_PROV_INFO_SET`的消息包含所有节点的组地址。当节点收到此消息时，它将自动订阅该地址的开关服务器模型。**

##### 2.2.4 控制节点

当`ESP_BLE_MESH_MODEL_OPERATION_EVT`事件触发时，配网器启动一个计时器。

```c
        ESP_LOG_BUFFER_HEX("fast prov info status", data, len);
#if !defined(CONFIG_BLE_MESH_FAST_PROV)
        prim_prov_addr = ctx->addr;
        k_delayed_work_init(&get_all_node_addr_timer, example_get_all_node_addr);
        k_delayed_work_submit(&get_all_node_addr_timer, GET_ALL_NODE_ADDR_TIMEOUT);
#endif
        break;
```

计时器超时后，配网器通过调用`example_send_fast_prov_all_node_addr_get`函数开始获取 mesh 网络中所有节点的地址，该函数发送一个操作码为`ESP_BLE_MESH_VND_MODEL_OP_FAST_PROV_NODE_ADDR_GET`的消息。

```c
err = example_send_fast_prov_all_node_addr_get(model, &info);
if (err != ESP_OK) {
    ESP_LOGE(TAG, "%s: 发送快速配网节点地址获取消息失败", __func__);
    return;
}
```

之后，配网器将收到一个确认消息，该消息的操作码为`ESP_BLE_MESH_VND_MODEL_OP_FAST_PROV_NODE_ADDR_STATUS`，它会触发`ESP_BLE_MESH_MODEL_OPERATION_EVT`事件。

然后，配网器能够通过使用组地址调用`example_send_generic_onoff_set`函数来打开所有节点（本演示例中为灯）。

```c
example_msg_common_info_t info = {
    .net_idx = node->net_idx,
    .app_idx = node->app_idx,
    .dst = node->group_addr,
    .timeout = 0,
};
err = example_send_generic_onoff_set(cli_model, &info, LED_ON, 0x00, false);
if (err != ESP_OK) {
    ESP_LOGE(TAG, "%s: 发送通用开关设置无确认消息失败", __func__);
    return ESP_FAIL;
}
```
## 蓝牙 Mesh 1.1 
协议是蓝牙技术领域的重要更新，其新功能亮点包括：引入“定向转发路由”和“远程配网”机制。
### 定向转发路由
![alt text](image-37.png)
![alt text](image-38.png)
![alt text](image-39.png)
### 远程配网
![alt text](image-40.png)
![alt text](image-41.png)
![alt text](image-42.png)