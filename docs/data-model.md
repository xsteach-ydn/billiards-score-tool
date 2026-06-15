# 数据模型

本文档描述当前前端数据结构，以及未来共享模型的方向。

## 存储

当前持久化方式是浏览器 `localStorage`。

```text
key: pool-score-prototype-sessions-v2
value: Session 对象数组的 JSON 字符串
```

虽然仓库现在叫 `billiards-score-tool`，但在实现迁移前不要修改当前 key，否则可能丢失已有原型数据。

## Session

```ts
type Session = {
  id: string;
  title: string;
  status: "active" | "ended";
  startedAt: string;
  endedAt?: string;
  rate: number;
  showMoney: boolean;
  players: Player[];
  rounds: Round[];
};
```

说明：

- `startedAt` 和 `endedAt` 是 ISO 风格日期字符串。
- `rate` 表示每 1 分对应多少元，默认值是 `5`。
- `showMoney` 控制分享活动结果时是否包含金额。
- 已结束活动继续记分时，`status` 可以从 `ended` 回到 `active`。

## Player

```ts
type Player = {
  id: string;
  name: string;
  color: "green" | "blue" | "orange" | "purple" | "cyan" | "rose" | "slate";
};
```

规则：

- 单个活动支持 3 到 7 名玩家。
- 玩家姓名不能为空。
- 同一活动内玩家姓名不应重复。
- 最近玩家快捷项从历史活动中收集。

## Round

```ts
type Round = {
  id: string;
  index: number;
  time: string;
  scores: Record<Player["id"], number>;
};
```

规则：

- `index` 从 `1` 开始，删除场次后应保持连续。
- `time` 当前格式是 `HH:mm`。
- `scores` 应包含当前活动的每一位玩家。
- `scores` 所有值相加必须为 `0`。

## 派生值

### 场次合计

```ts
sum(round.scores) === 0
```

UI 不允许保存非零和场次。

### 活动总计

对每位玩家：

```ts
totalScore = sum(round.scores[player.id] for every round)
money = totalScore * session.rate
```

所有玩家总分相加应为 `0`。

### 排名

玩家按 `totalScore` 从高到低排序。

当前平分处理比较简单：按分数排序后的自然顺序展示。如果未来需要明确并列规则，应在本文档和 `docs/decisions` 中记录决策。

### 结算建议

金额为正的玩家是收款方，金额为负的玩家是付款方。结算建议会把付款方和收款方配对，直到金额抵消。

## 导入和导出

导入/导出当前作用于全部活动记录。

当前备份结构：

```ts
type BackupPayload = {
  exportedAt: string;
  sessions: Session[];
};
```

导入模式：

- `replace`：替换本地全部活动。
- `merge`：把导入活动插到当前活动前面，并为重复的 session id 生成新 id。

未来改变备份结构前，应先增加 schema 版本：

```ts
type VersionedBackupPayload = {
  schemaVersion: number;
  exportedAt: string;
  sessions: Session[];
};
```

## 未来共享包

实现 `packages/shared` 后，把这些规则迁移进去：

- Session 校验。
- 场次零和校验。
- 总分计算。
- 排名。
- 金额换算。
- 结算建议。
- 导入/导出 schema 校验和迁移。

