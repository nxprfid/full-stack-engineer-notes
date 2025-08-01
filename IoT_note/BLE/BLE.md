# BLE
蓝牙低功耗（简称 BLE）是蓝牙的一种节能变体。BLE 的主要应用是短距离传输少量数据（低带宽）。与始终开启的传统蓝牙不同，BLE 除非建立连接，否则始终处于休眠模式。  
由于其特性，BLE 非常适合需要定期交换少量数据并运行在纽扣电池上的应用。这使得它的功耗非常低。根据使用场景，BLE 的功耗约为传统蓝牙的 1/100。    
[nRF Connect for Desktop下载地址](https://www.nordicsemi.com/Products/Development-tools/nrf-connect-for-desktop)  
[nRF Connect for Desktop详细教程请看](https://wiki.seeedstudio.com/cn/xiao-ble-sidewalk/#%E5%BF%85%E9%9C%80%E8%AE%BE%E5%A4%87)
[nrf connect_4.10.0 软件使用指南](https://blog.51cto.com/u_16213575/11321104)
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
[深入分析蓝牙BLE协议【附代码实例】](https://www.eet-china.com/mp/a285112.html)  
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
- Time to Live(TTL): 每个消息都会包含一个Time to Live(TTL)的值, 来限制中继的次数, 最大可以中继126次. 消息每转发一次TTL的值就减1, TTL值为1就不再转发。  

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
- 每个元素在加网的过程会被分配唯一的单播地址(Unicast Address), 地址范围是0x0001-0x7FFF.
- 还有一个组播地址(Group Address)就是前面讲到的发布/订阅机制里的厨房, 花园等. 元素订阅特定的组播地址, 就会收到发布者发送到此地址的消息.分为动态和固定地址，动态的用来做一般的“组播”，固定地址用来做一些协议规定的功能。动态组播地址范围0xC000-0xFEFF.  
● 固定地址  
  ○ 保留：0xFF00-0xFFFB  
  ○ 发送到启用代理（proxy）功能的所有节点： 0xFFFC  
  ○ 发送到启用friend功能的所有节点：0xFFFD  
  ○ 发送到启用中继（relay）功能的所有节点：0xFFFE  
  ○ 发送到所有节点：0xFFFF  
- 还有虚拟地址(Virtual Address), 每一个虚拟地址逻辑上对应一个128-bit的Label UUID. 通过对该Label UUID作哈希运算得出虚拟地址的低14位数值. 虚拟地址的范围为0x8000-0xBFFF。  
### 模型
![alt text](image-51.png)
设备节点由多个元素构成，每个元素包含了多个模型，而每个模型定义了节点的基本功能，比如节点所需要的状态、控制状态的消息以及处理消息所产生的动作等。节点功能的实现是基于模型的，模型可分为 SIG 模型和自定义模型，前者由 SIG 定义，而后者由开发者定义。模型也可基于消息的发送 / 接收方分为客户端模型与服务端模型。  
模型(Models)顾名思义就是定义了基本功能的最小单位模型, 比如设备的开关 灯光亮度调节等 模型包含了三个部分:  
![alt text](image-49.png)  
- 状态(State)表明一个元素的当前状态. 比如灯泡中包含开关和亮度的状态值. 不同状态可以设置为绑定关系(Bound State). 比如灯泡亮度为非零值时, 开关状态应该是开. 而灯泡亮度调整到0的时候, 其开关状态也应该被设置为关闭.  
- 消息(Message)有SET/GET/STATUS三种类型, 分别用来设置请求发送状态值.  
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
例如onoff这种，sig mesh协议里规定了的通用型模型，各个厂家只的设备之间可以互相通用！
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