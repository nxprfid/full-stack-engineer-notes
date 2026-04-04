# MCP (Model Context Protocol)

MCP是一种用于AI模型与外部数据源和工具连接的协议标准。

## 核心概念

- **Host**: 发起连接的AI应用（如Claude Desktop）
- **Client**: 嵌入在Host中的客户端组件
- **Server**: 提供特定能力的服务端（如文件系统、Git、数据库等）

## 常用Server类型

- **文件系统Server**: 读写本地文件
- **Git Server**: 执行Git操作
- **数据库Server**: 连接SQL/NoSQL数据库
- **HTTP Server**: 调用外部API

## 配置示例

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/dir"]
    },
    "git": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-git"]
    }
  }
}
```

## 优势

1. **标准化**: 统一AI与工具交互方式
2. **安全性**: 明确权限控制
3. **可扩展性**: 轻松添加新工具
4. **可移植性**: 一次配置，多处使用
