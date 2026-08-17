---
title: LuatOS笔记
---
# LuatOS笔记

[LuatOS在线模拟器](https://wiki.luatos.com/_static/luatos-emulator/lua.html)  
[Lua在线REPL工具](https://wiki.luatos.com/_static/repl/index.html)  
[Lua正则在线测试工具](https://wiki.luatos.com/_static/string-match/index.html)  
## 基础语法
字符串连接符号：`..`
字符串前面加`#`，可以获取长度
用`--`开头，来写一段单行注释
也可以用`--[[`开头，`]]`结尾，写一段多行注释。
## 字符串string
Lua 语言中字符串可以使用以下三种方式来表示：
单引号间的一串字符
双引号间的一串字符
[[和]]间的一串字符

Lua 把 false 和 nil 看作是false，其他的都为true（包括0这个值，也是相当于true）
```lua
string.char(0x30)
-- 转换为字符
string.byte(0x30)
-- 转换为十进制
```
lua字符串是可以存0的，不是C中遇到0就停止的
![alt text](./image-7.png)
![alt text](./image-8.png)
## 循环
while后面加的是do，for也是do，判断if才是then。

判断变量可以使用这个，相当于C语言中的三目运算符
```lua
a = nil
b = 0
print(b > 10 and "yes" or "no")
```
结果为no

16进制，大小写都可以
运算可以使用除法运算结合求余运算来进行整除运算，确保小数部分都是0

![alt text](./image.png)
![alt text](./image-1.png)
![alt text](./image-2.png)

## table数组
可以存数字，字符串，table，function
数组下标从1开始

table默认以数字作为下标，下标也可以是字符串

### 特殊的table
`_G`
Lua里面所有的全局变量都在`_G`这个table里面

table删减
`table.insert (table, [pos ,] value)`

在（数组型）表 table 的 pos 索引位置插入 value，其它元素向后移动到空的地方。pos 的默认值是表的长度加一，即默认是插在表的最后。

`table.remove (table [, pos])`

在表 table 中删除索引为 pos（pos 只能是 number 型）的元素，并返回这个被删除的元素，它后面所有元素的索引值都会减一。pos 的默认值是表的长度，即默认是删除表的最后一个元素。
## require多文件调用
![alt text](./image-3.png)
require只是用来引入外部库的。不需要多次调用。如果需要多次调用，可以在被调用的文件里创建table，再往这table中添加函数，在调用文件中使用该函数即可。

## 迭代器
迭代器是用来遍历table里面所有的值的
![alt text](./image-4.png)
`ipairs`用来迭代数字下标的，需要连续下标
![alt text](./image-5.png)
`pairs`用来迭代数字以及字符串下标的，不需要连续
![alt text](./image-6.png)
`pairs`是用了`next`函数
```lua
t={}
next(t)
输出nil，快速判断这个table是否为空
```
## LuaTask框架
当使用LuaTask框架时，需要在代码中引用`sys`库（`_G.sys=require("sys")`），并且在代码的最后一行，调用`sys.run()`以启动LuaTask框架，框架内的任务代码会在sys.run()中运行。

![alt text](./image-9.png)
![alt text](./image-10.png)
![alt text](./image-11.png)
闭包就是返回了一个携带参数的一个函数
## LuatOS
### 日志
```lua
--使用print可以打印数据
print("这是我打印出来的东西")

--一般使用log库来打印日志，更加直观
log.info("日志测试","这是一条普通日志")
log.error("日志测试","这是一条错误提示日志")
log.fatal("日志测试","这是一条致命错误提示日志")
log.debug("日志测试","这是一条调试日志，因为日志等级限制，不会打印")
log.trace("日志测试","这是一条trace日志，因为日志等级限制，不会打印")

--把日志等级改成最高
--如果LOG_LEVEL为0，那么log库所有日志都不会输出
LOG_LEVEL = 1
log.debug("日志测试","这是一条调试日志，现在能看到了")
log.trace("日志测试","这是一条trace日志，现在能看到了")
```
## GPIO
```lua
--加载sys库
sys = require("sys")

-- 设置gpio1为输出模式，初始状态为低电平，返回的led1为控制gpio的函数
led1 = gpio.setup(1,0,gpio.PULLUP)
-- 设置gpio1为高电平，点亮led1
led1(1)

-- 设置gpio2为输出模式，初始状态为低电平，返回的led1为控制gpio的函数
led2 = gpio.setup(2,0,gpio.PULLUP)
-- 记录上次的led状态
local last = false
-- 一秒改变一次led2的状态
sys.timerLoopStart(function()
    led2(last and 0 or 1)-- 根据上次状态决定是否亮灯
    log.info("led2",last)
    last = not last--更改状态标志
end,1000)

-- 用户代码已结束---------------------------------------------
-- 运行lua task，只能调用一次，而且必须写在末尾
-- 结尾总是这一句
sys.run()
-- sys.run()之后后面不要加任何语句!!!!!

```
## 按键
```lua
--加载sys库
sys = require("sys")

K1 = gpio.setup(11, function() -- 中断模式, 下降沿触发，开启上拉
    log.info("gpio11", "gpio11 button down",K1())
end, gpio.PULLUP,gpio.FALLING)

K2 = gpio.setup(12, function(state) -- 中断模式, 上升下降都触发，开启上拉
    log.info("gpio12", "gpio12 button",K2())
end, gpio.PULLUP,gpio.BOTH)

K3 = gpio.setup(13, nil, gpio.PULLUP)--输入模式，手动读取状态，开启上拉
sys.timerLoopStart(function()
    log.info("gpio13",K3())
end,1000)

-- 设置gpio4为输出模式，初始状态为低电平，返回的led4为控制gpio的函数
led4 = gpio.setup(4,0,gpio.PULLUP)
-- 中断模式, 上升下降都触发，开启上拉，触发后改变led4状态
K4 = gpio.setup(14, function(state)
    led4(K4() == 1 and 0 or 1)
end, gpio.PULLUP,gpio.BOTH)

-- 用户代码已结束---------------------------------------------
-- 运行lua task，只能调用一次，而且必须写在末尾
-- 结尾总是这一句
sys.run()
-- sys.run()之后后面不要加任何语句!!!!!

```
## ADC
```lua
--加载sys库
sys = require("sys")

--vbat为4v，两个电阻均为10KΩ
--变阻器量程为100Ω-10KΩ，默认在最小值处

-- 打开adc通道
if adc.open(0) then
    log.info("adc", "adc0 open success")
end
if adc.open(1) then
    log.info("adc", "adc1 open success")
end

--一秒打印一次当前的电压值
sys.timerLoopStart(function()
    log.info("adc0",adc.read(0))
    log.info("adc1",adc.read(1))
end,1000)

--不用的时候应该关掉
--adc.close(0)
--adc.close(1)

-- 用户代码已结束---------------------------------------------
-- 运行lua task，只能调用一次，而且必须写在末尾
-- 结尾总是这一句
sys.run()
-- sys.run()之后后面不要加任何语句!!!!!

```
## PWM
```lua
--加载sys库
sys = require("sys")

-- 打开PWM0, 频率1kHz, 占空比1%
pwm.open(0, 1000, 1)

--开个任务，让pwm转速慢慢增大后，循环
sys.taskInit(function()
    local speed = 0
    while true do
        speed = speed + 10
        if speed > 100 then speed = 0 end
        log.info("pwm","speed now",speed,"%")
        pwm.open(0, 1000, speed)
        sys.wait(5000)
    end
end)

--不用的时候应该关掉
--pwm.close(0)

-- 用户代码已结束---------------------------------------------
-- 运行lua task，只能调用一次，而且必须写在末尾
-- 结尾总是这一句
sys.run()
-- sys.run()之后后面不要加任何语句!!!!!

```

## UART
![alt text](./image-12.png)
## 二进制数据/c结构体的打包与解析
![alt text](./image-13.png)
字节序分为大端序和小端序

TCP、UDP一般是大端序，而MCU一般是小端序
![alt text](./image-14.png)
![alt text](./image-15.png)
解析二进制数据
![alt text](./image-16.png)
![alt text](./image-17.png)
![alt text](./image-18.png)
![alt text](./image-19.png)
![alt text](./image-20.png)

## zbuff库
![alt text](./image-21.png)
![alt text](./image-22.png)
![alt text](./image-23.png)
![alt text](./image-24.png)
![alt text](./image-25.png)
![alt text](./image-26.png)
## 串口实战-读取485温湿度传感器数据
![alt text](./image-27.png)
![alt text](./image-28.png)
## SPI库的介绍+实战读写FLASH
![alt text](./image-29.png)
![alt text](./image-30.png)
![alt text](./image-31.png)
![alt text](./image-32.png)
![alt text](./image-33.png)
