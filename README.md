# Billiards Score Tool

桌球记分工具，当前重点是移动端优先的前端原型，后续会扩展服务端和共享业务模型。

## Repository Layout

- `apps/web`: React + Vite 前端应用，包含活动、场次记分、历史明细、结算、分享、导入导出等界面。
- `apps/api`: 预留的服务端应用目录，后续可放账号、同步、备份、多人协作等接口服务。
- `packages/shared`: 预留的共享模块目录，后续可放计分规则、数据类型、导入导出 schema、接口契约等前后端共用代码。

## Commands

```bash
npm run dev:web
npm run build:web
npm run preview:web
```

也可以进入 `apps/web` 后直接运行对应 npm script。

