# AI 协作指南

这个文件是 Billiards Score Tool 项目给 AI 编程工具使用的主上下文。其他工具专用文件只做适配，项目事实和规则以这里为准。

## 优先阅读

修改代码前，请按顺序阅读：

1. `README.md`
2. `docs/project-brief.md`
3. `docs/architecture.md`
4. `docs/data-model.md`
5. `docs/ai-handoff.md`
6. 当前目录附近的补充说明，例如 `apps/web/AGENTS.md`

## 仓库结构

- `apps/web`：当前 React + Vite 移动端优先 Web 应用。
- `apps/api`：预留给未来服务端。
- `packages/shared`：预留给计分规则、数据类型、校验 schema、接口契约等共享代码。
- `docs`：给人和 AI 工具共同使用的长期项目资料。

未来服务端代码放在 `apps/api`。可复用的领域规则和 schema 放在 `packages/shared`，不要散落复制到多个应用里。

## 产品不变量

- 单个活动支持 3 到 7 名玩家，常见场景是 3 到 5 名玩家。
- 每一场必须包含所有玩家的得分，并且本场得分总和必须为 `0`。
- 活动总分由所有场次累加得到，总和也必须为 `0`。
- 金额换算默认 `1 分 = 5 元`。
- 导入/导出是全量记录的备份/恢复。
- 分享是针对单个活动结果。
- 活动名称可以默认使用当前日期和时间。
- 录入场次时，草稿为空时本场时间应同步当前时间；用户手动改过时间后，应尊重手动值。
- 首页活动时长应根据开始/结束时间计算，不使用硬编码展示文案。

## 当前实现事实

- 当前应用使用浏览器 `localStorage` 持久化数据。
- 当前存储 key 是 `pool-score-prototype-sessions-v2`。除非实现迁移，否则不要改这个 key，因为它关系到已有原型数据兼容。
- 当前前端是 JavaScript React，不是 TypeScript。
- 图标使用 `lucide-react`。
- UI 是移动端优先，重点兼顾微信内分享、复制、备份恢复等使用场景。

## 常用命令

从仓库根目录运行：

```bash
npm run dev:web
npm run build:web
npm run preview:web
```

只改前端时，交付前至少运行 `npm run build:web`。

## 工程规则

- 不提交 `node_modules`、`dist`、`.DS_Store`、`.npm-cache`、截图产物或临时输出。
- 构建产物不要进入提交。
- 修改本地存储、导入导出或数据结构时，要优先保护用户已有数据兼容。
- 修改计分规则时，更新 `docs/data-model.md`；当 `packages/shared` 建立后，优先把共享规则放进去。
- 修改应用边界或新增服务端能力时，更新 `docs/architecture.md`。
- 形成长期产品或架构决策时，更新 `docs/project-brief.md`，或在 `docs/decisions` 下新增 ADR。
- 较大的 AI 辅助工作完成后，在 `docs/ai-handoff.md` 追加简短交接记录。

## UI 规则

- 首屏是可直接使用的活动记录页，不做营销落地页。
- 高频操作应足够直接：继续活动、新建活动、保存本场、结算、分享。
- 数字信息要易扫读。
- 计分控件要有稳定尺寸，避免 hover、文本、图标导致布局跳动。
- 使用图标增强常见操作识别，例如导航、设置、分享、导入导出、排名、时间。
- 避免纯装饰性 UI 干扰效率。
- 窄屏文本不能溢出或遮挡控件。

## 交接要求

每个 AI 工具完成较大工作后，都应让下一个工具能接着做。在 `docs/ai-handoff.md` 追加：

- 日期
- 变更内容
- 验证结果
- 已知问题
- 建议下一步

