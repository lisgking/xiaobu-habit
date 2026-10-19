# Spec: 习惯提醒 v0.2
From: intent.md (monitoring agent, 2026-10-18). Status: ready for product owner review.
Skills applied: a11y-baseline, privacy-by-default

## Requirements
- R1. 用户可为每个习惯单独开启提醒，并设置本地时间（HH:mm）。
- R2. 提醒默认关闭；只有用户主动开启后才请求通知权限。
- R3. 到点时：有通知权限则发本地通知；无权限则显示应用内提示条，不阻断打卡。
- R4. 已完成的习惯当天不再提醒。
- R5. 提醒配置与习惯数据一样只存 localStorage，不上传、不请求服务端。
- R6. 关闭提醒后立即停止，不保留后台任务。

## Design
- 设置页每个习惯增加一行：开关 + 时间选择（`<input type="time">`）。
- 数据模型：`reminders: { [habitId]: { enabled: boolean, time: "HH:mm" } }`，与 `habits/logs` 同级存储。
- 调度：页面加载时计算下一次提醒时间，`setTimeout` 到点触发；页面不可见/关闭时不保证触发（v0.2 明确不做 Service Worker）。
- 权限：仅在首次开启某习惯提醒时调用 `Notification.requestPermission()`；拒绝后写入 `permission=denied`，后续只走应用内提示。
- 应用内提示：顶部条「该喝水了」，可点击直达打卡，或关闭本次提示。
- 设计稿：需在 v0.1 三屏基础上新增「设置页提醒行 + 应用内提示条」两处，见 concern 4。

## How each constraint in the intent is met
| Constraint | 由什么满足 |
|---|---|
| 不引入账号/服务端 | R5：仅 localStorage；无网络请求 |
| 提醒时间存本机 | R5 + 数据模型 `reminders` |
| 权限被拒降级为应用内提示 | R3 + 权限分支设计 |
| 不默认开启 | R2 |
| 不影响打卡 | R3：提示条不阻断主流程 |

## Open questions from the intent
1. 浏览器通知 vs 应用内提示先做哪个？→ **两者都做**，但按权限能力分支（R3）；无权限时应用内提示是唯一路径。
2. 权限被拒后是否引导到设置页？→ 是，提示条附「去设置」链接（仅文案引导，不自动跳转）。
3. 是否避开已完成的习惯？→ 是（R4）。

## Areas of concern
1. **iOS Safari 通知支持有限**：非 PWA 安装状态下可能无法发通知，只能应用内提示。Owner: eng
2. **页面关闭后提醒不触发**：v0.2 不做 Service Worker/后台调度，用户可能误以为「提醒一定会响」。Owner: product
3. **时区/DST 边界**：跨时区或夏令时切换时，提醒时间按本地墙钟时间处理，可能偏移一次。Owner: eng
4. **设计稿未覆盖新界面**：v0.1 mockup 没有提醒行与提示条，需 Design 阶段补图并重新签核。Owner: design
5. **无障碍**：应用内提示条需可被读屏播报，且不自动抢焦点。Owner: design
