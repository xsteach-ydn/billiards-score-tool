# AI 交接记录

这个文件用于在不同 AI 工具之间传递稳定上下文。记录应简短、具体、可验证。

## 模板

```md
## YYYY-MM-DD

### 变更
- ...

### 验证
- ...

### 已知问题
- ...

### 下一步
- ...
```

## 2026-06-15

### 变更
- 初始化远程仓库 `xsteach-ydn/billiards-score-tool`。
- 为后续多应用开发整理仓库结构：`apps/web`、`apps/api`、`packages/shared`。
- 新增根目录 npm 脚本，用于前端开发、构建和预览。
- 保留当前 React + Vite 前端应用在 `apps/web`。
- 新增跨 AI 项目上下文资料：根目录 `AGENTS.md`、`CLAUDE.md`、`GEMINI.md`、Cursor 规则、项目简报、架构说明、数据模型、贡献说明和 ADR。
- 将跨 AI 协作资料切换为中文表达，保留工具文件名、命令名和必要的代码类型片段。

### 验证
- 仓库结构调整后，`npm run build:web` 已通过。

### 已知问题
- 当前本地工作区 Git 元数据可能仍显示初始树未提交，因为远程推送是通过临时干净仓库完成的。
- 暂无自动化测试套件。
- `localStorage` key 仍保留为 `pool-score-prototype-sessions-v2`，用于兼容已有原型数据。

### 下一步
- 把纯计分和结算逻辑抽到 `packages/shared`。
- 为导入/导出增加 schema 校验。
- 为零和校验、总分、排名、结算建议增加基础前端测试。
- 当需要云同步或分享链接时，再规划 `apps/api`。

