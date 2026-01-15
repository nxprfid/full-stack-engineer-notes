# 置顶链接

# 归零码
800kHz → 1bit = 1.25µs
0码:  T0H ≈ 0.4µs
1码:  T1H ≈ 0.8µs
## 三通道：SM16703、TM1804、UCS1903、WS2811、SK6812、INK1003、APA105、P943S、P9411、TX1812、TX1813、GS8206、GS8208
## 四通道：SK6812、P9412
## 高辉
### TM2918
![alt text](image-12.png)
![alt text](image-13.png)
![alt text](image-14.png)
### SM16705PD
![alt text](image-10.png)
![alt text](image-11.png)
# 归一码
800kHz → 1bit = 1.25µs
0码:  T0L ≈ 0.4µs
1码:  T1L ≈ 0.8µs
## 三通道：TM1913
![alt text](image-7.png)
## 三通道：TM1914（双线备份，一帧含有48bit头）
![alt text](image-5.png)
![alt text](image-6.png)  
## 四通道：TM1814
![alt text](image-4.png)  
![alt text](image-3.png)  
# 双线
800KHz
CLK 上升沿被采样
时钟线在不传输时保持 低电平
线序：黑VCC，绿CLK，红DIN，蓝GND
## WS2801
24bit（仅 RGB 各 8bit）
仅连续 LED 帧 + 时钟低电平复位（发完所有 LED 后，时钟线保持低电平≥500μs 触发复位）
颜色顺序RGB
![alt text](image-1.png)
## LPD8803/8806
一颗IC控两个灯珠24bit+24bit
48bit（固定头1bit RGB 各 7bit）
起始帧（≥32个"0"）+ （24bit+24bit）+ 补位（每颗芯片1个"0"）如果要驱动1200颗灯珠就是发600个0即数据线为低的情况下时钟线600次上升沿
颜色顺序BRG
![alt text](image-2.png)
## LPD6803
一颗 IC 控一个灯珠 16bit，16bit（起始位 1bit+RGB 各 5bit），起始帧（固定 32 个 "0"）+（16bit× 灯珠总数）+ 补位（每颗灯珠 1 个 "0"，即驱动 N 颗灯珠发 N 个 0，数据线为低时时钟线 N 次上升沿）
![alt text](image-9.png)
## APA102、SK9822、P9413 
单 LED 数据长度	32bit（含 3bit 起始码固定为111 + 5bit 亮度）
有 Start Frame（32 个 0）+LED 帧 + End Frame（32 个 1）
颜色顺序BGR
![alt text](image.png)
## P9813
单 LED 数据长度	： 
[2bit标志位(固定11)] + [2bit B7'/B6'] + [2bit G7'/G6'] + [2bit R7'/R6'] + [8bit B] + [8bit G] + [8bit R]    
解释：32bit（2bit 标志位（固定 11）+2bit 校验位（B7’/B6’，蓝色高 2 位反码）+2bit 校验位（G7’/G6’，绿色高 2 位反码）+2bit 校验位（R7’/R6’，红色高 2 位反码）+ 8bit 蓝色灰度 + 8bit 绿色灰度 + 8bit 红色灰度） 
数据帧格式： 
Start Frame(32个0) + LED1数据 + LED2数据 + ... + LEDn数据  
颜色顺序BGR
![alt text](image-8.png)

# DMX512
250KHz
1 bit = 4 µs
# PWM
16KHz
PWM效果很少，只有五种：七彩跳变\七彩呼吸\七彩闪烁\七彩心跳\七彩渐变\。其中呼吸\闪烁\心跳可以加第四、第五通道也就是CW、WW。单色呼吸有红色、绿色、蓝色、黄色、青色、紫色、白色。
# 线材
线序（自箭头往下）：黑绿红蓝
![alt text](lQDPJw96hDd7B7PNAyDNAyCw5bY0GJu_lx8JO3VfzrNZAA_800_800.jpg)
其实是给PWM用的，黑色是共阴，接着是GRB顺序。