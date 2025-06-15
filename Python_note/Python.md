# Python基础
## 注释
```python
# 单行注释
"""
多行注释
"""

'''
多行注释
'''
```
## 声明变量
变量名只能包含字母下划线和数字（不能以数字开头）

```python
MyNum =1
myNum = 1
_Num = False
_num = True
#字符串类型
the_name="name"
The_name = 'name'
```
## 列表集合元组字典
```python
a=[1,3,4]                       #列表
b={1,3,4}                       #集合
c=(1,3,4)                       #元组
d={'name':'zhangsan','age':18}  #字典
```
## 数据类型转换
```python
int('1')
float('1')
str(1)
bool(1)
```
## 输入输出
```python
#输入（默认输入字符串）
name = input('请输入姓名：')
#想要输入数字类型需要转换类型
age = int(input('请输入年龄：'))
print('姓名：',name,'年龄：',age)
#输出固定的话里面含有变量
a=12
print(f'年龄：{a}')
print(f"年龄：{a}")
print("年龄：%d"%a)
#输出不换行
print('hello',end='')
print("我是帅哥",end='')
```
长空格 \t  
换行 \n
与或非 and or not
## 算数
```python
# 两个星号就是它的多少次方
a=a**10
a**=10
```
### 随机数

```python
import random
a = random.randint(1, 100)#整数 包含1和100
b = random.uniform(1, 100)#小数
c = random.random()#随机生成0-1之间的小数
print(c)
```
### 字符串拼接
```python
a = 'h'
b = 'w'
c = a + b
d = a * 3
e = a + b*3
print(c)
print(d)
print(e)

```
> hw
hhh
hwww

### 字符串截取
```python
a = 'hello world'
print(a[0])#第一个字符
print(a[0:5])#截取0到5的字符
print(a[0:5:2])#截取0到5的字符，步长为2
print(a[-1])#最后一个字符
print(a[-1:-5:-1])#从后往前截取，步长为-1
```
### 字符串查找
```python
a = 'hello world'
```


# 条件和循环
## 条件语句
TAB缩进或者4个空格
```python
if True:
    print('True')
elif False:
    print('False')
else:
    print('None')
```
## 循环语句
```python
for i in range(10):
    print(i)
```
## 函数
```python
def func():
    print('hello')
func()
```
## 运算符
```python
#算术运算符
a=1
b=2
print(a+b)

```


```python
```

```python
```


```python
```


```python
```


```python
```


```python
```

```python
```

```python
```
