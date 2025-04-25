# keysking的STM32教程
[文档](https://docs.keysking.com/)  

[串口助手](https://serial.keysking.com)  
![alt text](IMG_2254.JPG)
## 安装STM32CubeIDE


![alt text](IMG_2256.JPG)

![alt text](IMG_2257.JPG)

![alt text](IMG_2258(1).JPG)

![alt text](IMG_2259.JPG)

![alt text](IMG_2260.JPG)

![alt text](IMG_2261(1).JPG)
勾选不在提示的选项会将记忆的选项保存下来  
保存在工作空间里面metadate文件夹  
![alt text](IMG_2262(2).JPG)

![alt text](IMG_2263(2).JPG)

![alt text](IMG_2264.JPG)

# 
浮空输入下的GPIO内部处于高阻态
相当于芯片内部有一个巨大的电阻，根据电阻越大分压越多的原理，上拉电阻压降几乎为0V

GPIOx_BSRR、GPIOx_BRR、GPIOx_ODR→GPIOx引脚高低电平输出  
控制单片机就是控制寄存器  
![alt text](image11.png)  


TTL肖特基触发器（施密特触发器）作用是稳定电平
![alt text](image-7.png)
中断信号是送到处理器，调用代码进行处理
事件信号是送到相应的外设，自行处理。

响应优先级仅在两中断同时发生时起到辅助作用

配置了GPIO复用功能，但如果没有手动设置下载调试器接口的话，会出现相关接口关闭，下一次可能就烧录不进去。

串口轮询模式改中断只需要在MX里NVIC中使能串口，在发送接收函数名末尾加上_IT即可。

HAL_UART_Receive_IT(&huart1, &aRxBuffer, 1);
因为不会阻塞程序运行，就不能放到while循环里面了。放里面会还没接收到数据，又开启新中断了。又因为串口中断接收完一次后就不再接收了，需要放在处理串口回调函数最后。

因为不会阻塞程序运行，不能立刻处理数据。需要在USART1_IRQHandler函数中添加处理代码。因为还有处理串口其他中断，需要进入HAL_UART_IRQHandler函数中找到 HAL_UART_RxCpltCallback(&huart1);函数，在main.c重写该函数。
只接受到我们想要的字节数，接收才完成会调用HAL_UART_RxCpltCallback回调函数。



HAL_UART_Transmit_IT(&huart1, (uint8_t *)"hello world", 11);

## DMA直接内存访问
代替CPU来搬运数据
![alt text](image-8.png)
在MX建立两条串口DMA通道。把后缀_IT改为_DMA即可。
如果要接收不定长数据，可以利用串口空闲中断。使用HAL_UARTEx_ReceiveToIdle_DMA(&huart1, (uint8_t *)aRxBuffer, sizeof(aRxBuffer));函数。
相应的回调函数则改为HAL_UARTEx_RxEventCallback(&huart1, uartEvent);
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
为了避免触发DMA传输过半中断，关闭DMA传输过半中断是__HAL_DMA_DISABLE_IT(&hdma_usart2_rx, DMA_IT_HT);串口接受开启时也要关闭。
![alt text](image-9.png)


#看完10以前的代码