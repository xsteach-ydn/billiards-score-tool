import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  CalendarClock,
  Calculator,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Crown,
  Copy,
  DatabaseBackup,
  Download,
  Edit3,
  FileText,
  History,
  ListChecks,
  Medal,
  Minus,
  MoreHorizontal,
  Plus,
  RotateCcw,
  Save,
  Search,
  Settings,
  Share2,
  SlidersHorizontal,
  Trash2,
  Trophy,
  Upload,
  Users,
  WalletCards,
  X,
} from "lucide-react";

const STORAGE_KEY = "pool-score-prototype-sessions-v2";
const COLORS = ["green", "blue", "orange", "purple", "cyan", "rose", "slate"];

const initialSessions = [
  {
    id: "s-20260612",
    title: "06月12日 20:30 桌球局",
    status: "active",
    startedAt: "2026-06-12T20:30:00",
    rate: 5,
    showMoney: true,
    players: [
      { id: "p-zhang", name: "张强", color: "green" },
      { id: "p-li", name: "李伟", color: "blue" },
      { id: "p-wang", name: "王磊", color: "orange" },
      { id: "p-chen", name: "陈浩", color: "purple" },
    ],
    rounds: [
      {
        id: "r-1",
        index: 1,
        time: "20:22",
        scores: { "p-zhang": 10, "p-li": 2, "p-wang": -6, "p-chen": -6 },
      },
      {
        id: "r-2",
        index: 2,
        time: "20:35",
        scores: { "p-zhang": 8, "p-li": 4, "p-wang": -6, "p-chen": -6 },
      },
    ],
  },
  {
    id: "s-20260611",
    title: "06月11日 19:45 桌球局",
    status: "active",
    startedAt: "2026-06-11T19:45:00",
    rate: 5,
    showMoney: true,
    players: [
      { id: "p-a", name: "张三", color: "green" },
      { id: "p-b", name: "李四", color: "blue" },
      { id: "p-c", name: "王五", color: "orange" },
    ],
    rounds: [
      {
        id: "r-1",
        index: 1,
        time: "20:05",
        scores: { "p-a": 8, "p-b": -2, "p-c": -6 },
      },
    ],
  },
  {
    id: "s-20260610",
    title: "06月10日 21:12 桌球局",
    status: "ended",
    startedAt: "2026-06-10T21:12:00",
    endedAt: "2026-06-11T00:32:00",
    rate: 5,
    showMoney: true,
    players: [
      { id: "p-d1", name: "张三", color: "green" },
      { id: "p-d2", name: "李四", color: "blue" },
      { id: "p-d3", name: "王五", color: "orange" },
      { id: "p-d4", name: "赵六", color: "purple" },
      { id: "p-d5", name: "孙七", color: "cyan" },
    ],
    rounds: [
      {
        id: "r-1",
        index: 1,
        time: "21:20",
        scores: { "p-d1": 15, "p-d2": 5, "p-d3": -8, "p-d4": -6, "p-d5": -6 },
      },
      {
        id: "r-2",
        index: 2,
        time: "21:48",
        scores: { "p-d1": 10, "p-d2": 4, "p-d3": -2, "p-d4": -8, "p-d5": -4 },
      },
      {
        id: "r-3",
        index: 3,
        time: "22:18",
        scores: { "p-d1": 10, "p-d2": 3, "p-d3": 0, "p-d4": -4, "p-d5": -9 },
      },
    ],
  },
  {
    id: "s-20260608",
    title: "06月08日 18:30 桌球局",
    status: "ended",
    startedAt: "2026-06-08T18:30:00",
    endedAt: "2026-06-08T20:40:00",
    rate: 5,
    showMoney: true,
    players: [
      { id: "p-e1", name: "张三", color: "green" },
      { id: "p-e2", name: "李四", color: "blue" },
      { id: "p-e3", name: "王五", color: "orange" },
      { id: "p-e4", name: "赵六", color: "purple" },
    ],
    rounds: [
      {
        id: "r-1",
        index: 1,
        time: "18:52",
        scores: { "p-e1": 8, "p-e2": 2, "p-e3": -5, "p-e4": -5 },
      },
      {
        id: "r-2",
        index: 2,
        time: "19:25",
        scores: { "p-e1": 7, "p-e2": 3, "p-e3": -5, "p-e4": -5 },
      },
    ],
  },
];

function uid(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}

function pad(value) {
  return String(value).padStart(2, "0");
}

function timeNow() {
  const now = new Date();
  return `${pad(now.getHours())}:${pad(now.getMinutes())}`;
}

function formatDurationMinutes(totalMinutes) {
  const safeMinutes = Math.max(0, totalMinutes);
  if (safeMinutes < 1) return "刚刚开始";
  const hours = Math.floor(safeMinutes / 60);
  const minutes = safeMinutes % 60;
  if (hours <= 0) return `${minutes}分钟`;
  return minutes > 0 ? `${hours}小时${minutes}分` : `${hours}小时`;
}

function formatSessionDuration(session, nowMs) {
  const startMs = Date.parse(session.startedAt);
  if (!Number.isFinite(startMs)) return "时间未知";
  const parsedEndMs = Date.parse(session.endedAt || "");
  const endMs = session.status === "ended" ? (Number.isFinite(parsedEndMs) ? parsedEndMs : startMs) : nowMs;
  return formatDurationMinutes(Math.floor((endMs - startMs) / 60000));
}

function defaultTitle() {
  const now = new Date();
  return `${pad(now.getMonth() + 1)}月${pad(now.getDate())}日 ${pad(
    now.getHours(),
  )}:${pad(now.getMinutes())} 桌球局`;
}

function datetimeInputValue() {
  const now = new Date();
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(
    now.getHours(),
  )}:${pad(now.getMinutes())}`;
}

function formatScore(value) {
  if (value > 0) return `+${value}`;
  return `${value}`;
}

function formatMoney(value, signed = true) {
  if (value === 0) return "¥0";
  const sign = value > 0 ? "+" : "-";
  return `${signed ? sign : ""}¥${Math.abs(value)}`;
}

function zeroScores(players) {
  return Object.fromEntries(players.map((player) => [player.id, 0]));
}

function scoreSum(scores) {
  return Object.values(scores).reduce((sum, value) => sum + Number(value || 0), 0);
}

function calculateTotals(session) {
  const totals = zeroScores(session.players);
  session.rounds.forEach((round) => {
    session.players.forEach((player) => {
      totals[player.id] += Number(round.scores[player.id] || 0);
    });
  });
  return totals;
}

function collectRecentPlayerNames(sessions) {
  const names = [];
  sessions.forEach((session) => {
    session.players.forEach((player) => {
      const name = player.name.trim();
      if (name && !names.includes(name)) names.push(name);
    });
  });
  return names;
}

function rankedPlayers(session) {
  const totals = calculateTotals(session);
  return session.players
    .map((player) => ({
      ...player,
      score: totals[player.id] || 0,
      money: (totals[player.id] || 0) * session.rate,
    }))
    .sort((a, b) => b.score - a.score);
}

function transferSuggestions(session) {
  const ranked = rankedPlayers(session);
  const creditors = ranked
    .filter((player) => player.money > 0)
    .map((player) => ({ ...player, remain: player.money }));
  const debtors = ranked
    .filter((player) => player.money < 0)
    .map((player) => ({ ...player, remain: Math.abs(player.money) }));
  const suggestions = [];
  let c = 0;
  let d = 0;
  while (creditors[c] && debtors[d]) {
    const amount = Math.min(creditors[c].remain, debtors[d].remain);
    if (amount > 0) {
      suggestions.push({
        from: debtors[d].name,
        to: creditors[c].name,
        amount,
      });
    }
    creditors[c].remain -= amount;
    debtors[d].remain -= amount;
    if (creditors[c].remain === 0) c += 1;
    if (debtors[d].remain === 0) d += 1;
  }
  return suggestions;
}

function buildShareText(session, includeDetails, includeMoney) {
  const ranked = rankedPlayers(session);
  const lines = [
    session.title,
    `${session.status === "ended" ? "已结束" : "进行中"} · ${session.players.length}人 · 共 ${session.rounds.length} 场`,
    "",
    "最终分数：",
    ...ranked.map((player) => {
      const money = includeMoney ? `，${player.money >= 0 ? "应收" : "应付"} ${formatMoney(player.money, false)}` : "";
      return `${player.name} ${formatScore(player.score)}分${money}`;
    }),
  ];
  if (includeMoney) {
    const suggestions = transferSuggestions(session);
    lines.push("", "结算建议：");
    if (suggestions.length) {
      suggestions.forEach((item) => {
        lines.push(`${item.from} 转给 ${item.to} ¥${item.amount}`);
      });
    } else {
      lines.push("无需转账");
    }
  }
  if (includeDetails) {
    lines.push("", "每场明细：");
    session.rounds.forEach((round) => {
      const detail = session.players
        .map((player) => `${player.name} ${formatScore(round.scores[player.id] || 0)}`)
        .join("，");
      lines.push(`第${round.index}场 ${round.time}：${detail}`);
    });
  }
  return lines.join("\n");
}

function PlayerBadge({ index, color }) {
  return <span className={`player-badge ${color}`}>{index + 1}</span>;
}

function RankBadge({ index, color }) {
  if (index === 0) {
    return (
      <span className={`rank-badge winner ${color}`}>
        <Crown size={15} />
      </span>
    );
  }
  if (index < 3) {
    return (
      <span className={`rank-badge medal ${color}`}>
        <Medal size={15} />
      </span>
    );
  }
  return <span className={`rank-badge ${color}`}>{index + 1}</span>;
}

function IconButton({ label, children, className = "", ...props }) {
  return (
    <button className={`icon-button ${className}`} aria-label={label} title={label} {...props}>
      {children}
    </button>
  );
}

function Header({ title, subtitle, left, right }) {
  return (
    <header className="topbar">
      <div className="topbar-side">{left}</div>
      <div className="topbar-title">
        <h1>{title}</h1>
        {subtitle ? <p>{subtitle}</p> : null}
      </div>
      <div className="topbar-side end">{right}</div>
    </header>
  );
}

function ScoreValue({ value, money = false }) {
  const className = value > 0 ? "positive" : value < 0 ? "negative" : "neutral";
  return <span className={`score-value ${className}`}>{money ? formatMoney(value) : formatScore(value)}</span>;
}

function HomeScreen({
  sessions,
  onOpenSession,
  onOpenDetail,
  onNew,
  onOpenData,
  nowMs,
  search,
  setSearch,
  filter,
  setFilter,
}) {
  const filtered = sessions.filter((session) => {
    const matchesFilter = filter === "all" || session.status === filter;
    const haystack = `${session.title} ${session.players.map((p) => p.name).join(" ")}`;
    return matchesFilter && haystack.includes(search.trim());
  });
  const activeCount = sessions.filter((session) => session.status === "active").length;
  const sectionTitle =
    filter === "active" ? "继续进行中" : filter === "ended" ? "历史活动" : "活动记录";
  return (
    <section className="screen home-screen">
      <Header
        title="桌球记分"
        subtitle="历史活动可随时继续"
        left={
          <span className="brand-mark">
            <Trophy size={22} />
          </span>
        }
        right={
          <div className="header-actions">
            <IconButton label="数据管理" onClick={onOpenData}>
              <MoreHorizontal size={24} />
            </IconButton>
          </div>
        }
      />

      <div className="search-row">
        <Search size={19} />
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="搜索活动或玩家"
        />
        <button className="filter-button">
          <SlidersHorizontal size={18} />
          筛选
        </button>
      </div>

      <div className="segmented">
        {[
          ["all", "全部"],
          ["active", "进行中"],
          ["ended", "已结束"],
        ].map(([key, label]) => (
          <button key={key} className={filter === key ? "active" : ""} onClick={() => setFilter(key)}>
            {label}
          </button>
        ))}
      </div>

      <div className="section-heading">
        <span className="heading-icon">
          <RotateCcw size={17} />
        </span>
        <h2>{sectionTitle}</h2>
        <span>{filter === "all" ? `${activeCount} 个进行中` : `${filtered.length} 个活动`}</span>
      </div>

      <div className="home-actions">
        <button className="primary-button" onClick={onNew}>
          <Plus size={20} />
          新建活动
        </button>
      </div>

      <div className="activity-list">
        {filtered.map((session) => (
          <ActivityCard
            key={session.id}
            session={session}
            nowMs={nowMs}
            onOpen={() => (session.status === "active" ? onOpenSession(session.id) : onOpenDetail(session.id))}
            onDetail={() => onOpenDetail(session.id)}
          />
        ))}
      </div>
    </section>
  );
}

function ActivityCard({ session, nowMs, onOpen, onDetail }) {
  const ranked = rankedPlayers(session);
  const top = ranked.slice(0, 5);
  const durationText = formatSessionDuration(session, nowMs);
  return (
    <article className={`activity-card ${session.status}`}>
      <button className="card-hit" onClick={onOpen} aria-label={`打开 ${session.title}`} />
      <div className="card-topline">
        <div>
          <h3>
            <CalendarClock size={17} />
            {session.title}
          </h3>
          <p>
            {session.status === "active" ? "进行中" : "已结束"} · {session.players.length}人 · {session.rounds.length}场
          </p>
        </div>
        <div className={`status-pill ${session.status}`}>{session.status === "active" ? "进行中" : "已结束"}</div>
      </div>
      <div className="money-rule">1分 = ¥{session.rate}</div>
      <div className="card-score-grid">
        {top.map((player) => (
          <div className="mini-score" key={player.id}>
            <span>{player.name}</span>
            <ScoreValue value={player.score} />
            {session.showMoney ? <small>{formatMoney(player.money)}</small> : null}
          </div>
        ))}
      </div>
      <div className="card-foot">
        <span>
          <Clock3 size={15} />
          {session.status === "active" ? `已进行 ${durationText}` : `总时长 ${durationText}`}
        </span>
        <button className={session.status === "active" ? "solid-action" : "ghost-action"} onClick={onOpen}>
          {session.status === "active" ? "继续" : "查看明细"}
        </button>
        <IconButton label="活动明细" onClick={onDetail}>
          <ChevronRight size={20} />
        </IconButton>
      </div>
    </article>
  );
}

function NewActivityScreen({ sessions, onBack, onCreate }) {
  const [count, setCount] = useState(4);
  const [title, setTitle] = useState(defaultTitle());
  const [startedAt, setStartedAt] = useState(datetimeInputValue());
  const recentPlayers = collectRecentPlayerNames(sessions);
  const defaultPlayers =
    recentPlayers.length >= 4 ? recentPlayers.slice(0, 4) : ["张强", "李伟", "王磊", "陈浩"];
  const [players, setPlayers] = useState(defaultPlayers);
  const [focusedPlayerIndex, setFocusedPlayerIndex] = useState(0);

  function changeCount(nextCount) {
    setCount(nextCount);
    setFocusedPlayerIndex((current) => Math.min(current, nextCount - 1));
    setPlayers((current) => {
      const next = [...current];
      while (next.length < nextCount) next.push(`玩家${next.length + 1}`);
      return next.slice(0, nextCount);
    });
  }

  function updatePlayer(index, name) {
    setPlayers((current) => current.map((player, playerIndex) => (playerIndex === index ? name : player)));
  }

  function applyRecentPlayer(name) {
    const fallbackIndex = players.findIndex((value) => !value.trim() || /^玩家\d+$/.test(value.trim()));
    const hasFocusedTarget = focusedPlayerIndex >= 0 && focusedPlayerIndex < players.length;
    const targetIndex = hasFocusedTarget ? focusedPlayerIndex : fallbackIndex >= 0 ? fallbackIndex : 0;
    updatePlayer(targetIndex, name);
    setFocusedPlayerIndex(targetIndex);
  }

  const hasEmpty = players.some((player) => !player.trim());
  const hasDuplicate = new Set(players.map((player) => player.trim())).size !== players.length;
  const canCreate = !hasEmpty && !hasDuplicate && count >= 3 && count <= 7;

  return (
    <section className="screen">
      <Header
        title="新建活动"
        subtitle="默认名称来自当前日期时间"
        left={
          <IconButton label="返回" onClick={onBack}>
            <ArrowLeft size={24} />
          </IconButton>
        }
      />

      <div className="form-surface">
        <label>
          <span>活动名称</span>
          <input value={title} onChange={(event) => setTitle(event.target.value)} />
        </label>
        <label>
          <span>开始时间</span>
          <input type="datetime-local" value={startedAt} onChange={(event) => setStartedAt(event.target.value)} />
        </label>
      </div>

      <div className="form-surface">
        <div className="field-title">
          <span>玩家人数</span>
        </div>
        <div className="count-grid">
          {[3, 4, 5, 6, 7].map((num) => (
            <button key={num} className={count === num ? "selected" : ""} onClick={() => changeCount(num)}>
              {num}人
              {num <= 5 ? <small>常用</small> : <small>更多</small>}
            </button>
          ))}
        </div>
      </div>

      <div className="form-surface">
        <div className="field-title">
          <span>玩家姓名</span>
          <small>{hasDuplicate ? "姓名不能重复" : "可使用最近玩家"}</small>
        </div>
        {players.map((player, index) => (
          <label className={`player-input ${focusedPlayerIndex === index ? "focused" : ""}`} key={index}>
            <PlayerBadge index={index} color={COLORS[index]} />
            <input
              value={player}
              onFocus={() => setFocusedPlayerIndex(index)}
              onChange={(event) => updatePlayer(index, event.target.value)}
            />
          </label>
        ))}
        <div className="chips">
          {recentPlayers.map((player) => (
            <button
              key={player}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => applyRecentPlayer(player)}
            >
              {player}
            </button>
          ))}
        </div>
      </div>

      <button
        className="primary-button sticky-action"
        disabled={!canCreate}
        onClick={() =>
          onCreate({
            title,
            startedAt,
            players: players.map((player, index) => ({
              id: uid("p"),
              name: player.trim(),
              color: COLORS[index],
            })),
          })
        }
      >
        <CheckCircle2 size={20} />
        创建并开始记分
      </button>
    </section>
  );
}

function ActivityScreen({
  session,
  draft,
  setDraft,
  selectedPlayerId,
  setSelectedPlayerId,
  onBack,
  onSaveRound,
  onOpenRound,
  onOpenSettings,
  onOpenSettlement,
  onOpenShare,
  onOpenDetail,
}) {
  const [roundTime, setRoundTime] = useState(timeNow());
  const [roundTimeLocked, setRoundTimeLocked] = useState(false);
  const ranked = rankedPlayers(session);
  const sum = scoreSum(draft);
  const hasInput = Object.values(draft).some((value) => Number(value) !== 0);
  const canSave = sum === 0 && hasInput;

  function adjust(playerId, delta) {
    setSelectedPlayerId(playerId);
    setDraft((current) => ({ ...current, [playerId]: Number(current[playerId] || 0) + delta }));
  }

  function balanceLastPlayer() {
    const lastPlayer = session.players[session.players.length - 1];
    const sumExceptLast = session.players
      .filter((player) => player.id !== lastPlayer.id)
      .reduce((total, player) => total + Number(draft[player.id] || 0), 0);
    setSelectedPlayerId(lastPlayer.id);
    setDraft((current) => ({ ...current, [lastPlayer.id]: -sumExceptLast }));
  }

  const roundIndex = session.rounds.length + 1;

  useEffect(() => {
    setRoundTime(timeNow());
    setRoundTimeLocked(false);
  }, [session.id, roundIndex]);

  useEffect(() => {
    if (roundTimeLocked || hasInput) return undefined;
    const syncTime = () => setRoundTime(timeNow());
    syncTime();
    const intervalId = window.setInterval(syncTime, 15000);
    return () => window.clearInterval(intervalId);
  }, [roundTimeLocked, hasInput, roundIndex]);

  return (
    <section className="screen activity-screen">
      <Header
        title={session.title}
        subtitle={`${session.status === "active" ? "进行中" : "已结束"} · ${session.players.length}人 · 第${roundIndex}场`}
        left={
          <IconButton label="返回首页" onClick={onBack}>
            <ArrowLeft size={24} />
          </IconButton>
        }
        right={
          <IconButton label="活动设置" onClick={onOpenSettings}>
            <Settings size={22} />
          </IconButton>
        }
      />

      <TotalsBoard session={session} ranked={ranked} compact />

      <div className="entry-panel">
        <div className="panel-title">
          <div>
            <h2>第{roundIndex}场 录入得分</h2>
            <p>每场所有分数相加必须为 0</p>
          </div>
          <label className="time-pill">
            <Clock3 size={17} />
            <input
              type="time"
              value={roundTime}
              onChange={(event) => {
                setRoundTime(event.target.value);
                setRoundTimeLocked(true);
              }}
            />
          </label>
        </div>

        <div className="score-entry-list">
          {session.players.map((player, index) => (
            <div
              key={player.id}
              className={`score-entry-row ${selectedPlayerId === player.id ? "selected" : ""}`}
              onClick={() => setSelectedPlayerId(player.id)}
            >
              <div className="player-cell">
                <PlayerBadge index={index} color={player.color} />
                <span>{player.name}</span>
              </div>
              <div className="stepper">
                <button onClick={() => adjust(player.id, -1)} aria-label={`${player.name} 减 1`}>
                  <Minus size={18} />
                </button>
                <input
                  value={draft[player.id] ?? 0}
                  inputMode="numeric"
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      [player.id]: Number(event.target.value || 0),
                    }))
                  }
                />
                <button onClick={() => adjust(player.id, 1)} aria-label={`${player.name} 加 1`}>
                  <Plus size={18} />
                </button>
              </div>
              <ScoreValue value={(draft[player.id] || 0) * session.rate} money />
            </div>
          ))}
        </div>

        <div className="sum-row">
          <span>本场合计（分）</span>
          <strong className={sum === 0 ? "ok" : "bad"}>{sum}</strong>
        </div>
        <div className="quick-buttons">
          {[-10, -5, 5, 10].map((delta) => (
            <button
              key={delta}
              className={delta > 0 ? "positive" : "negative"}
              onClick={() => adjust(selectedPlayerId || session.players[0].id, delta)}
            >
              {formatScore(delta)}
            </button>
          ))}
          <button onClick={balanceLastPlayer}>补齐最后一人</button>
        </div>
        <button className="primary-button" disabled={!canSave} onClick={() => onSaveRound(roundTime)}>
          <Save size={20} />
          保存本场
        </button>
        <p className={`entry-hint ${canSave ? "ok" : "bad"}`}>
          {!hasInput
            ? "请输入本场分数，合计为 0 后可保存"
            : sum === 0
              ? "本场合计已平衡，可以保存"
              : `当前合计 ${sum}，还差 ${formatScore(-sum)}`}
        </p>
      </div>

      <div className="activity-actions">
        <button onClick={onOpenDetail}>
          <History size={19} />
          历史明细
        </button>
        <button onClick={onOpenShare}>
          <Share2 size={19} />
          分享结果
        </button>
        <button onClick={onOpenSettlement}>
          <Trophy size={19} />
          结算
        </button>
      </div>

      <RecentRounds session={session} onOpenRound={onOpenRound} />
    </section>
  );
}

function TotalsBoard({ session, ranked, compact = false }) {
  const totalScore = ranked.reduce((sum, player) => sum + player.score, 0);
  const totalMoney = ranked.reduce((sum, player) => sum + player.money, 0);
  return (
    <section className={`totals-board ${compact ? "compact" : ""}`}>
      <div className="board-title">
        <div>
          <h2 className="title-with-icon">
            {compact ? <ListChecks size={19} /> : <Trophy size={19} />}
            {compact ? "当前总计" : "最终排名"}
          </h2>
          <p>总分和 {totalScore}，总金额 {formatMoney(totalMoney, false)}</p>
        </div>
        <span className="rate-chip">1分 = ¥{session.rate}</span>
      </div>
      <div className="ranking-list">
        {ranked.map((player, index) => (
          <div className="ranking-row" key={player.id}>
            <RankBadge index={index} color={player.color} />
            <strong>{player.name}</strong>
            <ScoreValue value={player.score} />
            {session.showMoney ? <ScoreValue value={player.money} money /> : null}
          </div>
        ))}
      </div>
    </section>
  );
}

function RecentRounds({ session, onOpenRound }) {
  const rounds = [...session.rounds].reverse().slice(0, 4);
  return (
    <section className="round-list-surface">
      <div className="section-title-line">
        <h2>最近记录</h2>
        <span>共{session.rounds.length}场</span>
      </div>
      {rounds.length === 0 ? (
        <div className="empty-state">保存第一场后，这里会显示历史记录</div>
      ) : (
        rounds.map((round) => <RoundRow key={round.id} session={session} round={round} onOpen={() => onOpenRound(round)} />)
      )}
    </section>
  );
}

function RoundRow({ session, round, onOpen }) {
  return (
    <button className="round-row" onClick={onOpen}>
      <strong>第{round.index}场</strong>
      <span>{round.time}</span>
      <div className="round-scores">
        {session.players.slice(0, 4).map((player) => (
          <span key={player.id}>
            {player.name} <ScoreValue value={round.scores[player.id] || 0} />
          </span>
        ))}
      </div>
      <ChevronRight size={18} />
    </button>
  );
}

function DetailScreen({ session, onBack, onContinue, onOpenSettlement, onOpenShare, onOpenRound, onOpenSettings }) {
  return (
    <section className="screen">
      <Header
        title="活动明细"
        subtitle={session.title}
        left={
          <IconButton label="返回" onClick={onBack}>
            <ArrowLeft size={24} />
          </IconButton>
        }
        right={
          <IconButton label="设置" onClick={onOpenSettings}>
            <Settings size={22} />
          </IconButton>
        }
      />
      <TotalsBoard session={session} ranked={rankedPlayers(session)} />
      <div className="activity-actions">
        <button onClick={onContinue}>
          <RotateCcw size={19} />
          继续记分
        </button>
        <button onClick={onOpenShare}>
          <Share2 size={19} />
          分享结果
        </button>
        <button onClick={onOpenSettlement}>
          <Trophy size={19} />
          结算页
        </button>
      </div>
      <section className="round-list-surface expanded">
        <div className="section-title-line">
          <h2>对局详情</h2>
          <span>每场分数和为 0</span>
        </div>
        {session.rounds.map((round) => (
          <RoundRow key={round.id} session={session} round={round} onOpen={() => onOpenRound(round)} />
        ))}
      </section>
    </section>
  );
}

function SettlementScreen({ session, onBack, onContinue, onShare, onOpenSettings }) {
  const suggestions = transferSuggestions(session);
  return (
    <section className="screen">
      <Header
        title="结算结果"
        subtitle={`${session.status === "ended" ? "已结束" : "可继续"} · ${session.players.length}人 · ${session.rounds.length}场`}
        left={
          <IconButton label="返回" onClick={onBack}>
            <ArrowLeft size={24} />
          </IconButton>
        }
        right={
          <IconButton label="金额设置" onClick={onOpenSettings}>
            <Calculator size={22} />
          </IconButton>
        }
      />
      <section className="settlement-hero">
        <div>
          <h2>{session.title}</h2>
          <p>1分 = ¥{session.rate}，可在活动设置中修改</p>
        </div>
        <WalletCards size={32} />
      </section>
      <TotalsBoard session={session} ranked={rankedPlayers(session)} />
      <section className="payment-surface">
        <div className="section-title-line">
          <h2>结算建议</h2>
          <span>按应收金额从多到少</span>
        </div>
        {suggestions.length ? (
          suggestions.map((item, index) => (
            <div className="payment-row" key={`${item.from}-${item.to}-${index}`}>
              <span>
                {item.from} 转给 {item.to}
              </span>
              <strong>¥{item.amount}</strong>
              <button onClick={onShare}>复制</button>
            </div>
          ))
        ) : (
          <div className="empty-state">当前无人需要转账</div>
        )}
      </section>
      <div className="settlement-actions">
        <button className="primary-button" onClick={onShare}>
          <Copy size={20} />
          复制到微信
        </button>
        <button className="secondary-button" onClick={onContinue}>
          <RotateCcw size={19} />
          继续记分
        </button>
      </div>
      <RecentRounds session={session} onOpenRound={() => {}} />
    </section>
  );
}

function ShareScreen({ session, onBack }) {
  const [includeDetails, setIncludeDetails] = useState(false);
  const [includeMoney, setIncludeMoney] = useState(true);
  const [copied, setCopied] = useState(false);
  const text = buildShareText(session, includeDetails, includeMoney);
  return (
    <section className="screen">
      <Header
        title="分享预览"
        subtitle="针对当前活动结果"
        left={
          <IconButton label="返回" onClick={onBack}>
            <ArrowLeft size={24} />
          </IconButton>
        }
      />
      <div className="toggle-surface">
        <label>
          <span>分享完整明细</span>
          <input type="checkbox" checked={includeDetails} onChange={(event) => setIncludeDetails(event.target.checked)} />
        </label>
        <label>
          <span>包含金额结算</span>
          <input type="checkbox" checked={includeMoney} onChange={(event) => setIncludeMoney(event.target.checked)} />
        </label>
      </div>
      <textarea className="share-textarea" value={text} readOnly />
      <button
        className="primary-button"
        onClick={() => {
          navigator.clipboard?.writeText(text);
          setCopied(true);
        }}
      >
        <Copy size={20} />
        {copied ? "已复制，可粘贴到微信" : "复制到微信"}
      </button>
      <p className="helper-text">分享只包含当前活动，不会包含全部备份数据。</p>
    </section>
  );
}

function RoundEditor({ session, editor, setEditor, onSave, onDelete }) {
  if (!editor) return null;
  const sum = scoreSum(editor.scores);
  return (
    <div className="overlay">
      <div className="bottom-sheet">
        <div className="sheet-head">
          <div>
            <h2>编辑第{editor.index}场</h2>
            <p>修改后会重新计算总分</p>
          </div>
          <IconButton label="关闭" onClick={() => setEditor(null)}>
            <X size={22} />
          </IconButton>
        </div>
        <label className="time-field">
          <CalendarClock size={18} />
          <input
            type="time"
            value={editor.time}
            onChange={(event) => setEditor({ ...editor, time: event.target.value })}
          />
        </label>
        <div className="editor-list">
          {session.players.map((player, index) => (
            <label className="editor-row" key={player.id}>
              <span>
                <PlayerBadge index={index} color={player.color} />
                {player.name}
              </span>
              <input
                value={editor.scores[player.id] ?? 0}
                inputMode="numeric"
                onChange={(event) =>
                  setEditor({
                    ...editor,
                    scores: { ...editor.scores, [player.id]: Number(event.target.value || 0) },
                  })
                }
              />
            </label>
          ))}
        </div>
        <div className="sum-row">
          <span>本场合计</span>
          <strong className={sum === 0 ? "ok" : "bad"}>{sum}</strong>
        </div>
        <div className="sheet-actions">
          <button className="danger-button" onClick={() => onDelete(editor.id)}>
            <Trash2 size={18} />
            删除
          </button>
          <button className="primary-button" disabled={sum !== 0} onClick={() => onSave(editor)}>
            <Save size={18} />
            保存修改
          </button>
        </div>
      </div>
    </div>
  );
}

function SettingsSheet({ session, onClose, onUpdate, onDelete }) {
  if (!session) return null;
  return (
    <div className="overlay">
      <div className="bottom-sheet">
        <div className="sheet-head">
          <div>
            <h2>活动设置</h2>
            <p>低频设置放在这里，录分页保持清爽</p>
          </div>
          <IconButton label="关闭" onClick={onClose}>
            <X size={22} />
          </IconButton>
        </div>
        <div className="form-surface flush">
          <label>
            <span>活动名称</span>
            <input value={session.title} onChange={(event) => onUpdate({ title: event.target.value })} />
          </label>
          <label>
            <span>1 分换算金额</span>
            <input
              type="number"
              min="1"
              value={session.rate}
              onChange={(event) => onUpdate({ rate: Number(event.target.value || 1) })}
            />
          </label>
          <label className="inline-check">
            <span>总分榜显示金额</span>
            <input
              type="checkbox"
              checked={session.showMoney}
              onChange={(event) => onUpdate({ showMoney: event.target.checked })}
            />
          </label>
        </div>
        <button className="danger-button wide" onClick={onDelete}>
          <Trash2 size={18} />
          删除活动
        </button>
      </div>
    </div>
  );
}

function DataManagementSheet({ sessions, open, onClose, onImport }) {
  const [tab, setTab] = useState("export");
  const [importText, setImportText] = useState("");
  const [message, setMessage] = useState("");
  if (!open) return null;
  const backup = JSON.stringify({ app: "桌球记分", version: 1, exportedAt: new Date().toISOString(), sessions }, null, 2);
  function importData(mode) {
    try {
      const parsed = JSON.parse(importText);
      if (!Array.isArray(parsed.sessions)) throw new Error("missing sessions");
      onImport(parsed.sessions, mode);
      setMessage(mode === "replace" ? "已覆盖恢复全部数据" : "已合并导入备份数据");
    } catch {
      setMessage("未识别到有效备份，请粘贴完整导出文本");
    }
  }
  return (
    <div className="overlay">
      <div className="bottom-sheet data-sheet">
        <div className="sheet-head">
          <div>
            <h2>数据管理</h2>
            <p>这里处理全部记录的备份与恢复</p>
          </div>
          <IconButton label="关闭" onClick={onClose}>
            <X size={22} />
          </IconButton>
        </div>
        <div className="segmented compact-tabs">
          <button className={tab === "export" ? "active" : ""} onClick={() => setTab("export")}>
            导出全部
          </button>
          <button className={tab === "import" ? "active" : ""} onClick={() => setTab("import")}>
            导入恢复
          </button>
        </div>
        {tab === "export" ? (
          <>
            <textarea className="backup-textarea" value={backup} readOnly />
            <button
              className="primary-button"
              onClick={() => {
                navigator.clipboard?.writeText(backup);
                setMessage("完整备份已复制，可发送到微信收藏或文件传输助手");
              }}
            >
              <Download size={19} />
              复制完整备份
            </button>
          </>
        ) : (
          <>
            <textarea
              className="backup-textarea"
              value={importText}
              onChange={(event) => setImportText(event.target.value)}
              placeholder="粘贴从本工具导出的完整备份文本"
            />
            <div className="sheet-actions">
              <button className="secondary-button" onClick={() => importData("merge")}>
                <Upload size={18} />
                合并导入
              </button>
              <button className="danger-button" onClick={() => importData("replace")}>
                <DatabaseBackup size={18} />
                覆盖恢复
              </button>
            </div>
          </>
        )}
        {message ? <p className="helper-text strong">{message}</p> : null}
      </div>
    </div>
  );
}

export function App() {
  const [sessions, setSessions] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : initialSessions;
    } catch {
      return initialSessions;
    }
  });
  const [view, setView] = useState("home");
  const [selectedId, setSelectedId] = useState(sessions[0]?.id);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [draft, setDraft] = useState(zeroScores(sessions[0]?.players || []));
  const [selectedPlayerId, setSelectedPlayerId] = useState(sessions[0]?.players[0]?.id);
  const [roundEditor, setRoundEditor] = useState(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [dataOpen, setDataOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [shareBackView, setShareBackView] = useState("settlement");
  const [nowMs, setNowMs] = useState(Date.now());

  const selectedSession = useMemo(
    () => sessions.find((session) => session.id === selectedId) || sessions[0],
    [sessions, selectedId],
  );

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    const intervalId = window.setInterval(() => setNowMs(Date.now()), 30000);
    return () => window.clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (!selectedSession) return;
    setDraft(zeroScores(selectedSession.players));
    setSelectedPlayerId(selectedSession.players[0]?.id);
  }, [selectedSession?.id]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [view, selectedId]);

  function updateSession(id, updater) {
    setSessions((current) =>
      current.map((session) => {
        if (session.id !== id) return session;
        return typeof updater === "function" ? updater(session) : { ...session, ...updater };
      }),
    );
  }

  function openSession(id) {
    setSelectedId(id);
    setView("activity");
  }

  function openDetail(id) {
    setSelectedId(id);
    setView("detail");
  }

  function createSession({ title, startedAt, players }) {
    const session = {
      id: uid("s"),
      title,
      status: "active",
      startedAt,
      rate: 5,
      showMoney: true,
      players,
      rounds: [],
    };
    setSessions((current) => [session, ...current]);
    setSelectedId(session.id);
    setView("activity");
  }

  function saveRound(time) {
    const newRound = {
      id: uid("r"),
      index: selectedSession.rounds.length + 1,
      time,
      scores: { ...draft },
    };
    updateSession(selectedSession.id, (session) => ({
      ...session,
      status: "active",
      rounds: [...session.rounds, newRound],
    }));
    setDraft(zeroScores(selectedSession.players));
    setToast(`第${newRound.index}场已保存`);
    window.setTimeout(() => setToast(""), 2600);
  }

  function saveRoundEdit(editor) {
    updateSession(selectedSession.id, (session) => ({
      ...session,
      rounds: session.rounds.map((round) =>
        round.id === editor.id ? { ...round, time: editor.time, scores: editor.scores } : round,
      ),
    }));
    setRoundEditor(null);
  }

  function deleteRound(roundId) {
    updateSession(selectedSession.id, (session) => ({
      ...session,
      rounds: session.rounds
        .filter((round) => round.id !== roundId)
        .map((round, index) => ({ ...round, index: index + 1 })),
    }));
    setRoundEditor(null);
  }

  function endAndSettle() {
    updateSession(selectedSession.id, { status: "ended", endedAt: new Date().toISOString() });
    setView("settlement");
  }

  function continueSession() {
    updateSession(selectedSession.id, { status: "active" });
    setView("activity");
  }

  function deleteSession() {
    if (!window.confirm("确定删除该活动？删除后无法从本原型内恢复。")) return;
    setSessions((current) => current.filter((session) => session.id !== selectedSession.id));
    setSettingsOpen(false);
    setView("home");
  }

  function importSessions(imported, mode) {
    setSessions((current) => {
      if (mode === "replace") return imported;
      const ids = new Set(current.map((session) => session.id));
      const safeImported = imported.map((session) => (ids.has(session.id) ? { ...session, id: uid("s") } : session));
      return [...safeImported, ...current];
    });
  }

  function openShare(backView) {
    setShareBackView(backView);
    setView("share");
  }

  return (
    <main className="app-shell">
      {view === "home" ? (
        <HomeScreen
          sessions={sessions}
          onOpenSession={openSession}
          onOpenDetail={openDetail}
          onNew={() => setView("new")}
          onOpenData={() => setDataOpen(true)}
          nowMs={nowMs}
          search={search}
          setSearch={setSearch}
          filter={filter}
          setFilter={setFilter}
        />
      ) : null}

      {view === "new" ? (
        <NewActivityScreen sessions={sessions} onBack={() => setView("home")} onCreate={createSession} />
      ) : null}

      {view === "activity" && selectedSession ? (
        <ActivityScreen
          session={selectedSession}
          draft={draft}
          setDraft={setDraft}
          selectedPlayerId={selectedPlayerId}
          setSelectedPlayerId={setSelectedPlayerId}
          onBack={() => setView("home")}
          onSaveRound={saveRound}
          onOpenRound={(round) => setRoundEditor({ ...round, scores: { ...round.scores } })}
          onOpenSettings={() => setSettingsOpen(true)}
          onOpenSettlement={endAndSettle}
          onOpenShare={() => openShare("activity")}
          onOpenDetail={() => setView("detail")}
        />
      ) : null}

      {view === "detail" && selectedSession ? (
        <DetailScreen
          session={selectedSession}
          onBack={() => setView("home")}
          onContinue={continueSession}
          onOpenSettlement={() => setView("settlement")}
          onOpenShare={() => openShare("detail")}
          onOpenRound={(round) => setRoundEditor({ ...round, scores: { ...round.scores } })}
          onOpenSettings={() => setSettingsOpen(true)}
        />
      ) : null}

      {view === "settlement" && selectedSession ? (
        <SettlementScreen
          session={selectedSession}
          onBack={() => setView("detail")}
          onContinue={continueSession}
          onShare={() => openShare("settlement")}
          onOpenSettings={() => setSettingsOpen(true)}
        />
      ) : null}

      {view === "share" && selectedSession ? <ShareScreen session={selectedSession} onBack={() => setView(shareBackView)} /> : null}

      {toast ? <div className="toast">{toast}</div> : null}

      <RoundEditor
        session={selectedSession}
        editor={roundEditor}
        setEditor={setRoundEditor}
        onSave={saveRoundEdit}
        onDelete={deleteRound}
      />
      <SettingsSheet
        session={settingsOpen ? selectedSession : null}
        onClose={() => setSettingsOpen(false)}
        onUpdate={(patch) => updateSession(selectedSession.id, patch)}
        onDelete={deleteSession}
      />
      <DataManagementSheet sessions={sessions} open={dataOpen} onClose={() => setDataOpen(false)} onImport={importSessions} />
    </main>
  );
}
