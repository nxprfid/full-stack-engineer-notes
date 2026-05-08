# 置顶链接
[OpenAI 官方 Codex 最佳实践系统学习文档](https://developers.openai.com/codex/learn/best-practices)
[GitHub Copilot 最佳实践](https://docs.github.com/en/copilot/get-started/best-practices)
[Claude Code 教程](https://www.runoob.com/claude-code/claude-code-tutorial.html)
[Claude Code 官方文档](https://code.claude.com/docs/zh-CN/overview)

# AI实用教程

1. 开干前先plan，先确定方向需求后再让agant干活。
2. 控制上下文，需要给精准的指令。而不是把所有内容扔个AI。AI的注意力及其分散。
3. claude.md不要超过300行。建议（60至120行）不是文档是宪法。硬性指令集（不可妥协的硬性原则）。每次会话启动都会读这个md载入上下文。
4. skills是可插拔的能力模块。真正需要时才加载进上下文窗口
技巧1：连按两次ESC键会弹出一串对话快照进入回溯对话功能，对它说“从这个检查点起，清空后续所有对话历史”

- Memory记忆：让AI记住你是谁
- Rules规则：你要求AI必须怎么配合你
- Skills技能：教AI怎么把活干好
- MCP模型上下文协议：让AI能真的动手干
- 
# Skills
Skills是基于高标准的重复工作沉淀的可复用技能包，可以持续稳定的按照你的要求输出高质量的产物 
创建skill.md:名称、描述、指令放进去

## Skill类型

### 内置Skill
- 文件搜索、代码搜索
- 任务规划与管理
- 项目诊断

### 自定义Skill
- 领域特定知识库
- 专用工具集成
- 工作流程自动化
## 使用场景

1. **代码开发**: 代码生成、调试、重构
2. **文档处理**: 文档创建、格式化、转换
3. **数据分析**: 数据清洗、可视化建议
4. **项目管理**: 任务分解、进度跟踪

## 创建自定义Skill

```json
{
  "name": "custom-skill",
  "description": "描述技能用途",
  "tools": ["tool1", "tool2"],
  "knowledge_base": "path/to/knowledge"
}
```

## 最佳实践

- 单一职责: 每个Skill专注一个领域
- 清晰命名: 便于AI理解和调用
- 文档完善: 说明输入输出格式
- 版本控制: 追踪Skill演进


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
常用MCP：
Filesystem
markitdown
Excel
context7

# 智能体
智能体提示词：定义它的角色定位，行为风格，以及可以使用的工具。

-在条件允许时，优先参考Context7的最新文档，而非依赖训练数据


# 提示词
1. 现在所有的文档都落实到docs\系统架构设计.md和docs\需求与协议约定.md了，接下来帮我写一个prompt，用来按照文档落实整个工程代码。
2. 当前程已经按docs件夹中的档进了实现，请你根据实现的功能，给我制定份功能验证案，我按照验证案进操作，完成所有功能的验证

# 个人规则模板：
把复杂问题拆解成更小、易处理的模块
若需求含糊不清，主动追问、澄清细节
遇到不确定事项或需工审核的内容，坦诚说明
当问题可能需要专业知识或监督介时，及时给出建议
绝不能记录敏感数据（如密码、令牌、个身份信息）
所有配置机密都通过环境变量来设置
执敏感操作前，务必做好身份验证检查

# 安装
## 使用官方脚本安装（推荐）
```bash
# macOS、Linux、WSL：
curl -fsSL https://claude.ai/install.sh | bash
# Windows PowerShell：
irm https://claude.ai/install.ps1 | iex
# Windows CMD：
curl -fsSL https://claude.ai/install.cmd -o install.cmd && install.cmd && del install.cmd
# 安装完成后，验证是否安装成功：
claude --version
```
## 使用 npm 安装
```bash
# 请先确认已安装 Node.js
node --version

# 进入命令行界面，安装 Claude Code
npm install -g @anthropic-ai/claude-code

# 创建您的工作目录，例如 `your-project`，使用 `cd` 命令导航到您的项目
cd your-project

# 安装完成，运行命令 `claude` 即可进入 Claude Code 交互界面
claude
```

### 安装qwen code
```bash
npx @qwen-code/qwen-code@latest 
```

## 更新 Claude Code
```bash
# 二选一
claude install
claude update
```





## 基础用法

```bash
# 直接对话
claude

项目是做什么的？

这个项目使用了哪些技术？

主入口在哪里？

解释一下文件夹结构

审阅我的修改内容并给出优化建议
```
### 使用Git功能
提交更改（Claude 会自动生成提交信息）：
`提交我的更改并附上描述性说明信息`

协助解决合并冲突：`帮我解决合并冲突`


上下文窗口（Claude 的记忆容量）
Claude 有上下文容量限制。当快满时：

它会自动压缩旧内容
你可以输入 /compact 手动压缩
输入 /context 查看当前占用情况
省空间秘诀：

重要规则写进 CLAUDE.md
用 skills 和 subagents 减少不必要的上下文占用


## 核心功能

## 命令行指令

### 1. 系统指令
```bash
# 初始化Claude Code
/init

# 查看状态
/status

# 重置会话
/reset

# 退出
/exit
```

### 2. 配置指令
```bash
# 查看配置
/config

# 修改配置
/config set key=value

# 重置配置
/config reset
```

### 3. 上下文指令
```bash
# 清除上下文
/clear

# 保存上下文
/save <name>

# 加载上下文
/load <name>
```

### 4. 工具指令
```bash
# 列出可用工具
/tools

# 启用工具
/tool enable <tool>

# 禁用工具
/tool disable <tool>
```

## 功能操作

### 1. 文件操作
```bash
# 读取文件
"读取src/index.js并分析"

# 编辑文件
"在index.html添加导航栏"

# 创建项目
"创建一个React TypeScript项目"
```

### 2. Git操作
```bash
# 提交代码
"提交这次修改，commit message要清晰"

# 代码审查
"审查main分支的最新提交"
```

### 3. 任务执行
```bash
# 运行测试
"运行单元测试并修复失败的用例"

# 构建项目
"构建生产版本"
```

### 4. 问题排查
```bash
# 调试错误
"这个报错是什么意思: Error: Cannot find module"

# 性能分析
"分析这个函数的性能瓶颈"
```

## 工作模式

### Agent Mode (默认)
自动分解任务，逐步执行，无需确认

### Plan Mode
先制定计划，等待确认后执行

### Spec Mode
先编写规格说明，再按规格执行

## 配置文件

在项目根目录创建`.claude`目录：

```
.claude/
├── settings.json      # 项目配置
├── commands/          # 自定义命令
└── skills/            # 自定义技能
```

## 实用技巧

1. **上下文管理**: 使用`@`引用文件或代码片段
2. **多轮对话**: 保持上下文连续性
3. **权限控制**: 使用`--dangerously.skip-permissions`跳过确认（谨慎使用）
4. **输出格式**: 指定输出格式如JSON、Markdown等

## 常见问题

### 指令相关
- **Q: /init 指令有什么作用?**
  A: 初始化Claude Code配置，创建必要的目录结构和配置文件

- **Q: /status 指令显示什么信息?**
  A: 显示当前Claude Code的状态，包括版本、配置、可用工具等

- **Q: 如何查看所有可用指令?**
  A: 使用 `claude /help` 或 `claude --help`

