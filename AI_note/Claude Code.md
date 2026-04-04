# Claude Code 实用教程

Claude Code是Anthropic提供的命令行工具，让开发者通过终端与Claude交互。

## 安装

```bash
npm install -g @anthropic-ai/claude-code
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
