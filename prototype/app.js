import { DEFAULT_HABITS, dateKey, isComplete, calcStreak, weekRatios, shiftDay } from './streak.js';

const KEY = 'xiaobu.v1';
const state = load();
let lastAction = null;
let toastTimer = null;

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const s = JSON.parse(raw);
      if (Array.isArray(s.habits) && s.logs) return s;
    }
  } catch (e) { /* ignore */ }
  return { habits: DEFAULT_HABITS, logs: {} };
}

function save() {
  localStorage.setItem(KEY, JSON.stringify(state));
}

function render() {
  const today = new Date();
  const key = dateKey(today);
  const done = new Set(state.logs[key] || []);
  document.getElementById('streakBadge').textContent = `🔥 ${calcStreak(state.logs, state.habits, today)} 天`;
  document.getElementById('todayLabel').textContent =
    `${today.getMonth() + 1} 月 ${today.getDate()} 日 · 周${'日一二三四五六'[today.getDay()]}`;
  document.getElementById('habitList').innerHTML = state.habits.map((h) => `
    <div class="habit ${done.has(h.id) ? 'done' : ''}" data-id="${h.id}">
      <span class="emoji">${h.emoji}</span><span class="name">${h.name}</span><span class="check">✓</span>
    </div>`).join('');

  const ratios = weekRatios(state.logs, state.habits, today);
  document.getElementById('weekGrid').innerHTML = ratios.map((d, i) => `
    <div class="day ${i === 6 ? 'today' : ''}">
      <div class="dot"><div class="fill" style="height:${Math.round(d.ratio * 100)}%"></div><span>${Math.round(d.ratio * 100)}%</span></div>
      <div class="wd">${d.weekday}</div>
    </div>`).join('');
  const full = ratios.filter((d) => d.ratio === 1).length;
  document.getElementById('weekHint').textContent = `过去 7 天有 ${full} 天全部完成。`;
}

function toggleHabit(id) {
  const key = dateKey(new Date());
  const list = new Set(state.logs[key] || []);
  const wasDone = list.has(id);
  if (wasDone) list.delete(id); else list.add(id);
  state.logs[key] = [...list];
  lastAction = { key, id, wasDone };
  save(); render(); showToast(wasDone ? '已取消打卡' : '已打卡');
}

function showToast(text) {
  const el = document.getElementById('toast');
  document.getElementById('toastText').textContent = text;
  el.classList.remove('hidden');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { el.classList.add('hidden'); lastAction = null; }, 3000);
}

document.getElementById('undoBtn').addEventListener('click', () => {
  if (!lastAction) return;
  const { key, id, wasDone } = lastAction;
  const list = new Set(state.logs[key] || []);
  if (wasDone) list.add(id); else list.delete(id);
  state.logs[key] = [...list];
  lastAction = null; save(); render();
  document.getElementById('toast').classList.add('hidden');
});

document.getElementById('habitList').addEventListener('click', (e) => {
  const card = e.target.closest('.habit');
  if (card) toggleHabit(card.dataset.id);
});

document.querySelectorAll('.tab').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    ['today', 'week', 'settings'].forEach((v) => {
      document.getElementById(`view-${v}`).classList.toggle('hidden', v !== btn.dataset.tab);
    });
  });
});

document.getElementById('exportBtn').addEventListener('click', () => {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `xiaobu-${dateKey(new Date())}.json`;
  a.click();
  URL.revokeObjectURL(a.href);
});

document.getElementById('importFile').addEventListener('change', async (e) => {
  const file = e.target.files?.[0]; if (!file) return;
  try {
    const s = JSON.parse(await file.text());
    if (!Array.isArray(s.habits) || !s.logs) throw new Error('bad file');
    state.habits = s.habits; state.logs = s.logs; save(); render();
    showToast('已导入');
  } catch (err) { alert('文件格式不对'); }
  e.target.value = '';
});

document.getElementById('clearBtn').addEventListener('click', () => {
  if (!confirm('会清空所有打卡记录，确定？')) return;
  if (!confirm('真的确定？建议先导出。')) return;
  state.logs = {}; save(); render(); showToast('已清空');
});

render();
