# 置顶链接
[OpenAI 官方 Codex 最佳实践系统学习文档](https://developers.openai.com/codex/learn/best-practices)
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

# MCP
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

## 安装

```bash
npm install -g @anthropic-ai/claude-code
```
qwen code
```bash
npx @qwen-code/qwen-code@latest 
```

## 基础用法

```bash
# 直接对话
claude

# 执行单次命令
claude "解释这段代码"

# 交互模式
claude -i
```

## 核心功能

## 命令行指令

### 1. 系统指令
```bash
# 初始化Claude Code
claude /init

# 查看状态
claude /status

# 重置会话
claude /reset

# 退出
claude /exit
```

### 2. 配置指令
```bash
# 查看配置
claude /config

# 修改配置
claude /config set key=value

# 重置配置
claude /config reset
```

### 3. 上下文指令
```bash
# 清除上下文
claude /clear

# 保存上下文
claude /save <name>

# 加载上下文
claude /load <name>
```

### 4. 工具指令
```bash
# 列出可用工具
claude /tools

# 启用工具
claude /tool enable <tool>

# 禁用工具
claude /tool disable <tool>
```

## 功能操作

### 1. 文件操作
```bash
# 读取文件
claude "读取src/index.js并分析"

# 编辑文件
claude "在index.html添加导航栏"

# 创建项目
claude "创建一个React TypeScript项目"
```

### 2. Git操作
```bash
# 提交代码
claude "提交这次修改，commit message要清晰"

# 代码审查
claude "审查main分支的最新提交"
```

### 3. 任务执行
```bash
# 运行测试
claude "运行单元测试并修复失败的用例"

# 构建项目
claude "构建生产版本"
```

### 4. 问题排查
```bash
# 调试错误
claude "这个报错是什么意思: Error: Cannot find module"

# 性能分析
claude "分析这个函数的性能瓶颈"
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

### 操作相关
- **Q: 如何停止正在执行的任务?**
  A: 按`Ctrl+C`

- **Q: 如何查看历史对话?**
  A: 使用方向键上下翻页

- **Q: 如何配置代理?**
  A: 设置环境变量`HTTP_PROXY`和`HTTPS_PROXY`

- **Q: 如何使用自定义工具?**
  A: 在`.claude/tools`目录中创建工具定义文件

### 故障排除
- **Q: 指令执行失败怎么办?**
  A: 检查网络连接，确认Claude API密钥配置正确

- **Q: 如何重置Claude Code?**
  A: 运行 `claude /reset` 或删除`.claude`目录
