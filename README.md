# Billiards Score Tool

桌球记分工具。当前重点是移动端优先的前端原型，后续会扩展服务端和共享业务模型。

## 仓库结构

- `apps/web`：React + Vite 前端应用，包含活动、场次记分、历史明细、结算、分享、导入导出等界面。
- `apps/api`：预留的服务端应用目录，后续可放账号、同步、备份、多人协作等接口服务。
- `packages/shared`：预留的共享模块目录，后续可放计分规则、数据类型、导入导出 schema、接口契约等前后端共用代码。

## 常用命令

```bash
npm run dev:web
npm run build:web
npm run preview:web
```

也可以进入 `apps/web` 后直接运行对应 npm script。

## 项目资料

- `AGENTS.md`：AI 工具共享的主上下文。
- `CLAUDE.md`：Claude Code 适配入口。
- `GEMINI.md`：Gemini 适配入口。
- `.cursor/rules/project.mdc`：Cursor 规则入口。
- `docs/project-brief.md`：产品目标、范围和交互原则。
- `docs/architecture.md`：当前架构和未来服务端扩展边界。
- `docs/data-model.md`：活动、玩家、场次、分数和导入导出数据模型。
- `docs/ai-handoff.md`：不同 AI 工具之间的交接记录。
- `docs/decisions`：长期架构和产品决策记录。

## AI 协作

不同 AI 工具协作时，先阅读 `AGENTS.md` 和 `docs/ai-handoff.md`。完成较大改动后，把变更、验证结果、已知问题和下一步写回 `docs/ai-handoff.md`。

