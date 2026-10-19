# Spec: 小步 · 习惯打卡 v0.1
From: intent.md. Status: ready for product owner review.
Skills applied: a11y-baseline, privacy-by-default

## Requirements
- R1. 首屏显示今日 3 个习惯及完成状态。
- R2. 点击习惯即打卡/取消，无需二次确认；操作可撤销（3 秒内）。
- R3. 连续天数 = 连续自然日内「当日全部习惯完成」的天数；当天未完成不清零，仅不计入。
- R4. 周视图显示过去 7 天每天的完成比例。
- R5. 数据仅存 localStorage；离线可用；清缓存前提示导出。

## Design
- 3 个视图：今日 / 周视图 / 设置（单页切换，无路由）。
- 今日：顶部连续天数 + 3 个习惯卡片；点击切换完成态。
- 周视图：7 个圆点，按完成比例着色。
- 设置：导出 JSON、导入、清空（二次确认）。
- 数据模型：`habits: [{id,name,emoji}]`；`logs: {"YYYY-MM-DD": ["habitId", ...]}`。

## How each constraint in the intent is met
| Constraint | 由什么满足 |
|---|---|
| 无账号/数据不出设备 | 仅 localStorage，无网络请求 |
| 离线可用 | 纯静态，无依赖 |
| 首屏 <1s | 单文件、无框架、无字体下载 |
| 移动优先 | 375px 基准布局，底部安全区 |

## Open questions from the intent
1. 撤销：R2 用 3 秒撤销条解决。
2. 导出：R5 提供 JSON 导出/导入，清空前提示。
3. 时区：R3 按**本地时区**计算（carried forward as concern 1）。

## Areas of concern
1. 跨日边界：23:59 打卡与 00:01 打卡属于不同天；本地时区切换（旅行）会让 streak 跳变。Owner: eng
2. 清缓存/换浏览器丢数据：v0.1 只提示导出，不做云同步。Owner: product
3. 无障碍：习惯卡片需键盘可达、颜色不是唯一状态标识。Owner: design
