# 贡献说明

## 开发流程

1. 阅读 `README.md`、`AGENTS.md` 和 `docs/` 下相关资料。
2. 让改动范围尽量贴合当前需求。
3. 运行相关验证命令。
4. 当产品规则、架构边界或数据契约变化时，同步更新文档。
5. 较大的 AI 辅助工作完成后，在 `docs/ai-handoff.md` 添加交接记录。

## 常用命令

```bash
npm run dev:web
npm run build:web
npm run preview:web
```

## 仓库边界

- 前端代码放在 `apps/web`。
- 未来服务端代码放在 `apps/api`。
- 共享业务规则、数据模型、schema 和接口契约放在 `packages/shared`。
- 项目资料放在 `docs`。

## 提交卫生

不要提交：

- `node_modules`
- `dist`
- `.DS_Store`
- `.npm-cache`
- 截图产物
- 临时导出或生成输出

## PR 检查清单

- 改动保持计分总和规则有效，或明确记录规则变化原因。
- 导入/导出兼容性被保留，或已记录迁移路径。
- 前端改动已通过 `npm run build:web`。
- 相关文档已更新。
- 较大的 AI 辅助改动已在 `docs/ai-handoff.md` 留下交接记录。

