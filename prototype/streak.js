/** 纯函数：日期键、完成判定、连续天数、周视图比例。便于单测。 */
export const DEFAULT_HABITS = [
  { id: 'read', name: '读书 10 页', emoji: '📖' },
  { id: 'water', name: '喝水 8 杯', emoji: '💧' },
  { id: 'walk', name: '走 6000 步', emoji: '👟' },
];

export function dateKey(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function isComplete(logs, habits, key) {
  const done = new Set(logs[key] || []);
  return habits.length > 0 && habits.every((h) => done.has(h.id));
}

export function shiftDay(d, delta) {
  const x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  x.setDate(x.getDate() + delta);
  return x;
}

/** 连续天数：今天未完成不算断，从昨天起算；历史上未完成即中断。 */
export function calcStreak(logs, habits, today = new Date()) {
  let cursor = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  if (!isComplete(logs, habits, dateKey(cursor))) {
    cursor = shiftDay(cursor, -1);
  }
  let n = 0;
  while (isComplete(logs, habits, dateKey(cursor))) {
    n += 1;
    cursor = shiftDay(cursor, -1);
  }
  return n;
}

/** 过去 7 天完成比例，旧 → 新。 */
export function weekRatios(logs, habits, today = new Date()) {
  const out = [];
  for (let i = 6; i >= 0; i -= 1) {
    const d = shiftDay(today, -i);
    const done = new Set(logs[dateKey(d)] || []);
    const ratio = habits.length ? habits.filter((h) => done.has(h.id)).length / habits.length : 0;
    out.push({ key: dateKey(d), ratio, weekday: '日一二三四五六'[d.getDay()] });
  }
  return out;
}
