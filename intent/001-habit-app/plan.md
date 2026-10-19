# Plan: 小步 · 习惯打卡 v0.1 (from intent.md and spec.md)

## Files that change
- `prototype/index.html`（结构 + 3 个视图）
- `prototype/app.js`（状态、streak、导入导出）
- `prototype/styles.css`（布局、深浅色、动效）
- `tests/streak.test.js`（Node test，纯函数）
- `evals/streak-boundary.eval.json`（回归用例）

## Order of work
1. 数据模型 + streak 纯函数（R3）
2. 今日视图与打卡/撤销（R1、R2）
3. 周视图（R4）
4. 设置与导出（R5）
5. 无障碍与深浅色
6. 测试与截图对比

## Risks
- 本地时区跨日（spec concern 1）
- localStorage 被清空导致数据丢失（concern 2）
- 移动端 100vh 与安全区

## Proof
- `node --test tests/`：streak 跨日/中断/同日重复打卡
- 三张截图与设计稿一致
- 手动：打卡→撤销→导出→导入
