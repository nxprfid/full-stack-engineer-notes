# LVGL移植
## 拉取代码
```
git clone -- recursive https://github.com/lvgl/lvgl.git
```
### 切换版本
切换到最新版本
```

cd lvgl
git tag
git checkout v8.3.10
```
## 添加路径
![alt text](image.png)
真正移植LVGL的源代码
![alt text](image-1.png)
## 移植流程
五个步骤
1. 初始化和注册LVGL显示驱动
2. 初始化和注册LVGL触摸驱动
3. 初始化ST7789硬件接口
4. 初始化CST816T硬件接口
5. 提供一个定时器给LVGL使用

### 1. 初始化和注册LVGL显示驱动
提供屏幕长和宽，如何写入数据，数据缓冲区
全局显示驱动变量lv_disp_drv_t
缓存是LVGL计算出要显示的内容画面存在这个缓存，写入到显示驱动芯片中
不能使用`malloc`申请的内存，使用`heap_caps_malloc`申请的内存
内存区域大小一般是一个屏幕的1/4到1/6之间，建议使用`MALLOC_CAP_DMA`方式申请
不能超过DMA的传输大小
```
lv_disp_drv_t disp_drv;

```
# 代码分析
想显示内容，首先得告诉 LVGL 你的显示驱动信息，显示驱动信息包含显
示刷新缓存、显示屏的宽高、显示输出函数这三个信息。
lv_disp_draw_buf_init函数用于初始化显示缓存，把用户定义的缓存设置到draw_buf_dsc
显示缓存描述结构体上，这里要注意，我们使用 esp-idf 内存管理接口 heap_caps_malloc 申
请的缓存一定要用 MALLOC_CAP_INTERNAL | MALLOC_CAP_DMA 修饰，因为 SPI 传输 RGB 数
据用的是 DMA 方式，这种方式无法应用于外部 PSRAM，只能从内部 IRAM 进行申请。
lv_disp_drv_init 函数用于按默认配置初始化一个显示驱动 disp_drv。
之后我们对 disp_drv 这个驱动进行设置，包括显示宽高、缓存、显示数据输出函数，显
示数据输出函数 disp_flush 是需要我们实现的，当 LVGL 进行完界面的绘画后，最终是要调
用这个函数将 RGB 显示数据输出到 LCD 屏上，实现如下