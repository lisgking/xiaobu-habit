import test from 'node:test';
import assert from 'node:assert/strict';
import { dateKey, isComplete, calcStreak, weekRatios, shiftDay } from '../prototype/streak.js';

const habits = [{ id: 'a' }, { id: 'b' }];
const d = (s) => new Date(`${s}T12:00:00`);

test('全部完成才算一天', () => {
  assert.equal(isComplete({ '2026-10-18': ['a'] }, habits, '2026-10-18'), false);
  assert.equal(isComplete({ '2026-10-18': ['a', 'b'] }, habits, '2026-10-18'), true);
});

test('今天未完成不断 streak，从昨天起算', () => {
  const logs = { '2026-10-16': ['a','b'], '2026-10-17': ['a','b'] };
  assert.equal(calcStreak(logs, habits, d('2026-10-18')), 2);
});

test('今天完成则计入', () => {
  const logs = { '2026-10-17': ['a','b'], '2026-10-18': ['a','b'] };
  assert.equal(calcStreak(logs, habits, d('2026-10-18')), 2);
});

test('中间缺一天即中断', () => {
  const logs = { '2026-10-14': ['a','b'], '2026-10-16': ['a','b'], '2026-10-17': ['a','b'] };
  assert.equal(calcStreak(logs, habits, d('2026-10-18')), 2);
});

test('本地时区日期键', () => {
  assert.equal(dateKey(new Date(2026, 9, 18, 23, 59)), '2026-10-18');
  assert.equal(dateKey(new Date(2026, 9, 19, 0, 1)), '2026-10-19');
});

test('周视图 7 天且比例正确', () => {
  const logs = { '2026-10-18': ['a'] };
  const w = weekRatios(logs, habits, d('2026-10-18'));
  assert.equal(w.length, 7);
  assert.equal(w.at(-1).ratio, 0.5);
  assert.equal(shiftDay(d('2026-01-01'), -1).getMonth(), 11);
});
