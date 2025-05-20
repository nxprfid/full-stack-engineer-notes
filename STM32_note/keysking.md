# keysking的STM32教程
[文档](https://docs.keysking.com/)  
[串口助手](https://serial.keysking.com)  
![alt text](IMG_2254.JPG)
## 安装STM32CubeIDE
![alt text](IMG_2256.JPG)

![alt text](IMG_2257.JPG)

![alt text](IMG_2258(1).JPG)
将 STM32CubeIDE 排除在扫描范围之外以提升性能。（一般来说，添加排除项可能会影响这台计算机的安全级别 ）  
让 STM32CubeIDE 继续接受微软 Defender 的扫描。  
![alt text](IMG_2259.JPG)
点击同意助力意法半导体改进产品。  
![alt text](IMG_2260.JPG)
打开关联透视图？  
![alt text](IMG_2261(1).JPG)
勾选不在提示的选项会将记忆的选项保存下来，保存在工作空间里面metadate文件夹  
![alt text](IMG_2262(2).JPG)

![alt text](IMG_2263(2).JPG)

![alt text](IMG_2264.JPG)

# GPIO
浮空输入下的GPIO内部处于高阻态
相当于芯片内部有一个巨大的电阻，根据电阻越大分压越多的原理，上拉电阻压降几乎为0V

GPIOx_BSRR（端口位设置 / 清除寄存器）、GPIOx_BRR（端口位清除寄存器）、GPIOx_ODR（端口输出寄存器）  
控制单片机就是控制寄存器  
![alt text](image11.png)  
TTL肖特基触发器（施密特触发器）作用是稳定电平。  
![alt text](image-7.png)
# 中断
中断信号是送到处理器，调用代码进行处理。  
事件信号是送到相应的外设，自行处理。  
响应优先级（次优先级）仅在两中断同时发生时起到辅助作用。  
>配置了GPIO复用功能，但如果没有手动设置下载调试器接口的话，会出现相关接口关闭，下一次可能就烧录不进去。
# 串口
串口是全双工，异步通信。（基于双方各自的时钟）

串口轮询模式改中断只需要在MX里NVIC中使能串口，在发送接收函数名末尾加上_IT即可。

    HAL_UART_Receive_IT(&huart1, &aRxBuffer, 1);
因为不会阻塞程序运行，就不能放到while循环里面了。放里面会还没接收到数据，又开启新中断了。  
又因为串口中断接收完一次后就不再接收了，需要再放在处理串口回调函数最后。  

因为不会阻塞程序运行，不能立刻处理数据。需要在`USART1_IRQHandler`函数中添加处理代码。因为还有处理串口其他中断，需要进入`HAL_UART_IRQHandler`函数中找到 `HAL_UART_RxCpltCallback(&huart1);`函数，在main.c重写该函数。  
只接受到我们想要的字节数，接收才完成会调用`HAL_UART_RxCpltCallback`回调函数。  

    HAL_UART_Transmit_IT(&huart1, (uint8_t *)"hello world", 11);

中断回调函数里面建立数据缓冲区，并且将解析数据的步骤搬出中断，在主循环中进行处理。
main.c
```c
void HAL_UARTEx_RxEventCallback(UART_HandleTypeDef *huart, uint16_t Size)
{
  if (huart == &huart3)
  {
    // 将数据写入命令缓冲区
    uint8_t length = CommandBuffer_Write(receivedData, Size);
    // 继续接收
    HAL_UARTEx_ReceiveToIdle_DMA(&huart3, receivedData, ReceivedDataSize);
    __HAL_DMA_DISABLE_IT(&hdma_usart3_rx, DMA_IT_HT);
  }
}
```
while(1)
```c 
    // 从命令缓冲区获取命令
    uint8_t length = CommandBuffer_GetCommand(command);
    if (length > 0)
    {
      HAL_UART_Transmit_DMA(&huart3, command, length);
      for (int i = 2; i < length - 1; i += 2)
      {
        GPIO_PinState state = GPIO_PIN_SET;
        // 先判断第二个字节，是开灯还是关灯，0x00关灯，0x01开灯
        if (command[i + 1] == 0x00)
        {
          state = GPIO_PIN_RESET;
        }
        // 再判断第一个字节，是红灯还是绿灯还是蓝灯
        if (command[i] == 0x01) // 红灯
        {
          HAL_GPIO_WritePin(LED_RED_GPIO_Port, LED_RED_Pin, state);
        }
        else if (command[i] == 0x02) // 绿灯
        {
          HAL_GPIO_WritePin(LED_GREEN_GPIO_Port, LED_GREEN_Pin, state);
        }
        else if (command[i] == 0x03) // 蓝灯
        {
          HAL_GPIO_WritePin(LED_BLUE_GPIO_Port, LED_BLUE_Pin, state);
        }
      }
    }
```
```c
/**
 * **************************************************************
 * @file        : command.c
 * @author      : keysking
 * @brief       : 利用循环缓冲区实现指令数据缓存
 * **************************************************************
 * @details
 * 指令格式: [包头 0xAA] [数据长度 1字节] [数据 n字节] [校验和 1字节]
 *
 */
#include "command.h"
#include "stdio.h"
#include "string.h"

// 指令的最小长度
#define COMMAND_MIN_LENGTH 4

// 循环缓冲区大小
#define BUFFER_SIZE 128
// 循环缓冲区
static uint8_t buffer[BUFFER_SIZE];
// 循环缓冲区读索引
static uint8_t readIndex = 0;
// 循环缓冲区写索引
static uint8_t writeIndex = 0;

/**
 * @brief 增加读索引
 * @param length 要增加的长度
 */
void CommandBuffer_AddReadIndex(uint8_t length) {
  readIndex += length;
  readIndex %= BUFFER_SIZE;
}

/**
 * @brief 读取第i位数据 超过缓存区长度自动循环
 * @param i 要读取的数据索引
 */

uint8_t CommandBuffer_Read(uint8_t i) {
  uint8_t index = i % BUFFER_SIZE;
  return buffer[index];
}

/**
 * @brief 计算未处理的数据长度
 * @return 未处理的数据长度
 * @retval 0 缓冲区为空
 * @retval 1~BUFFER_SIZE-1 未处理的数据长度
 * @retval BUFFER_SIZE 缓冲区已满
 */
uint8_t CommandBuffer_GetLength() {
  // 读索引等于写索引时，缓冲区为空
  if (readIndex == writeIndex) {
    return 0;
  }
  // 如果缓冲区已满,返回BUFFER_SIZE
  if (writeIndex + 1 == readIndex || (writeIndex == BUFFER_SIZE - 1 && readIndex == 0)) {
    return BUFFER_SIZE;
  }
  // 如果缓冲区未满,返回未处理的数据长度
  if (readIndex < writeIndex) {
    return writeIndex - readIndex;
  } else {
    return BUFFER_SIZE - readIndex + writeIndex;
  }
}

/**
 * @brief 计算缓冲区剩余空间
 * @return 剩余空间
 * @retval 0 缓冲区已满
 * @retval 1~BUFFER_SIZE-1 剩余空间
 * @retval BUFFER_SIZE 缓冲区为空
 */
uint8_t CommandBuffer_GetRemain() { return BUFFER_SIZE - CommandBuffer_GetLength(); }

/**
 * @brief 向缓冲区写入数据
 * @param data 要写入的数据指针
 * @param length 要写入的数据长度
 * @return 写入的数据长度
 */
uint8_t CommandBuffer_Write(uint8_t *data, uint8_t length) {
  // 如果缓冲区不足 则不写入数据 返回0
  if (CommandBuffer_GetRemain() < length) {
    return 0;
  }
  // 使用memcpy函数将数据写入缓冲区
  if (writeIndex + length <= BUFFER_SIZE) {
    memcpy(buffer + writeIndex, data, length);
    writeIndex += length;
  } else {
    uint8_t firstLength = BUFFER_SIZE - writeIndex;
    memcpy(buffer + writeIndex, data, firstLength);
    memcpy(buffer, data + firstLength, length - firstLength);
    writeIndex = length - firstLength;
  }
  return length;
}

/**
 * @brief 尝试获取一条指令
 * @param command 指令存放指针
 * @return 获取的指令长度
 * @retval 0 没有获取到指令
 */
uint8_t CommandBuffer_GetCommand(uint8_t *command) {
  // 寻找完整指令
  while (1) {
    // 如果缓冲区长度小于COMMAND_MIN_LENGTH 则不可能有完整的指令
    if (CommandBuffer_GetLength() < COMMAND_MIN_LENGTH) {
      return 0;
    }
    // 如果不是包头 则跳过 重新开始寻找
    if (buffer[readIndex] != 0xAA) {
      CommandBuffer_AddReadIndex(1);
      continue;
    }
    // 如果缓冲区长度小于指令长度 则不可能有完整的指令
    uint8_t length = CommandBuffer_Read(readIndex + 1);
    if (CommandBuffer_GetLength() < length) {
      return 0;
    }
    // 如果校验和不正确 则跳过 重新开始寻找
    uint8_t sum = 0;
    for (uint8_t i = 0; i < length - 1; i++) {
      sum += CommandBuffer_Read(readIndex + i);
    }
    if (sum != CommandBuffer_Read(readIndex + length - 1)) {
      CommandBuffer_AddReadIndex(1);
      continue;
    }
    // 如果找到完整指令 则将指令写入command 返回指令长度
    for (uint8_t i = 0; i < length; i++) {
      command[i] = CommandBuffer_Read(readIndex + i);
    }
    CommandBuffer_AddReadIndex(length);
    return length;
  }
}

```

通过循环缓冲区缓存数据，并在主循环中进行处理。避免数据粘包，数据丢失。  
该模块适用于串口通信、蓝牙等数据流场景，能够：  
- 缓存不定长指令数据
- 自动识别完整指令
- 处理粘包、半包问题
- 丢弃错误数据
## DMA直接内存访问
代替CPU来搬运数据
![alt text](image-8.png)
在MX建立两条串口DMA通道。把后缀_IT改为_DMA即可。
如果要接收不定长数据，可以利用串口空闲中断。使用`HAL_UARTEx_ReceiveToIdle_DMA(&huart1, (uint8_t *)aRxBuffer, sizeof(aRxBuffer));`函数。  
相应的回调函数则改为`HAL_UARTEx_RxEventCallback(&huart1, uartEvent);`
```c
void HAL_UARTEx_RxEventCallback(UART_HandleTypeDef *huart, uintl6_t Size)
{
    if (huart == &huart2)
    {
        HAL_UART_Transmit_DMA(&huart2, receiveData, Size);


        HAL_UARTEx_ReceiveToIdle_DMA(&huart2, receiveData, sizeof(receiveData));
        __HAL_DMA_DISABLE_IT(&hdma_usart2_rx, DMA_IT_HT);
    }
}
```
为了避免触发DMA传输过半中断，关闭DMA传输过半中断是`__HAL_DMA_DISABLE_IT(&hdma_usart2_rx, DMA_IT_HT);`串口接受开启时也要关闭。
![alt text](image-9.png)
### 校验和
校验和用来校验数据传递过程中是否出错  
计算方式;将前面的数据依次相加，然后取最后1字节数据。  
收到数据包中的校验和后,设备自行计算校验和,然后与收到的校验和进行比较。如果两个数据相同，则说明数据没有出错。若出错忽略此数据包，或请求重新发送数据。  

>有些串口助手支持发送校验和
# IIC
支持多个设备进行通信的通信协议我们称其为总线协议。  
主机发送，从机选择性应答。  
半双工通信，主从模式，总线模式，同步通信。

由主机通过时钟线发送固定频率的脉冲信号来作为IIC总线上所有设备通信的统一时钟源。  
IIC两根线上拉。
从机读取到的电平就是主机在时钟线低电平时设置的电平。

当时钟线处于低电平时主机/从机设置数据线的电平
而时钟线处于高电平时从机/主机读取数据线的电平

ACK应答信号由应答方在时钟线低电平时拉低数据线。

只有主机发送开始和结束信号时才会在时钟线为高时控制数据线，其他阶段都只能在时钟线为低时设置数据线。

I2C地址常用7位地址，但IIC通信中每次发送都是一字节，8位。所以要左移一位。第8位是读写位，0表示写，1表示读。
HAL库会处理好最后一位，默认为0就好了

## OLED
# 看完10以前的代码