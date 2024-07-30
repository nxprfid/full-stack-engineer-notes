# AD笔记
## 绘制原理图库
### 元器件符号属性设置
![alt text](image-1.png)

    vgs快捷键，调整栅格大小

> 管脚放置格点：100mil
> 图形元素格点：10mil
> 注意移动也要调整vgs

### 添加封装

![alt text](image-3.png)
![alt text](image-2.png)

### 遮挡解决方法
![alt text](image-5.png)

>A管脚表示二极管正极
>K管脚表示二极管负极

### 多Part部件

![alt text](image-4.png)

### 调用原理图库
1. 复制现有库
2. 已有原理图进行生成
3. 网络（IC封装网）
   
### 检查原理图库设计
![alt text](image-6.png)

## 绘制原理图
### 放置元器件
格点选择100mil

![alt text](image-8.png)
![alt text](image-7.png)
### 添加原理图库
![alt text](image-9.png)
    
    元器件对齐快捷键a
    电气连线 CTRL+W

对后面PCB设计做粗细标识
![alt text](image-10.png)


### 切换走线形式shift+空格
>信号一般是采用网络标签，电源一般采用端口

    选中导线，按alt键可以高亮同一网络
### 分配元器件位号
    快捷键taa

![alt text](image-11.png)
![alt text](image-12.png)

接着点击执行变更
如果不想整页原理图变更，可以框选后
taa 选择下拉的最后一个

![alt text](image-13.png)

    查找文字是CTRL+F
### 查找元器件快捷键是JC

## 封装
修改助焊层形状及其大小

![alt text](image-14.png)

空白处点一下，按q切换mil和mm

快捷键m移动，选择xy移动

![alt text](image-15.png)

1. Top Layer 顶层
2. Bottom Layer 底层
3. Mechanical  机械层
4. Top Overlay 顶层丝印层
5. Bottom Overlay 底层丝印层
6. Top Paste 顶层锡膏层
7. Bottom Paste 底层锡膏层
8. Top Solder 
顶层阻焊层
9. Bottom Solder 底层阻焊层
10. Drill Guide
钻孔层
11.  Keep-O
ut Layer 防焊层
12. Drill Drawing
钻孔层
13. Multi-Layer 多层

    快捷键efc设置原点为中间  
![alt text](image-16.png)

>丝印绘制一般为5mil

    shift+空格 切换走线形式
![alt text](image-17.png)

    ctrl m测量距离

如果设计L形状的封装，焊盘可以进行叠加。序号要保持一致

通孔的一些属性
![alt text](image-18.png)

### 调用PCB库
1. 复制现有库
2. 已有PCB进行库生成
3. 网络（IC封装网）

![alt text](image-19.png)

多个元素重叠，可以选择具体哪一个
![alt text](image-20.png)

绘制3D模型，所在层是在机械1层

![alt text](image-21.png)


切换3D视图快捷键`ctrl d`