# Intent: 习惯提醒 v0.2
Author: monitoring agent（weekly_completion_rate, 2σ）. Status: draft.

## Problem
周完成率从基线 52% 掉到 42%（σ=0.06，命中 2σ 带）。
访谈线索：用户「打开后忘了今天还没打卡」，不是不想做。

## Proposed outcome
允许用户为每个习惯设一个本地提醒时间；完成率回到 ≥50%。
成功标准：4 周后周完成率 +8pp，且提醒关闭率 <30%。

## Affected users and systems
现有用户、浏览器通知权限、本地存储。

## Constraints
- 不引入账号/服务端；提醒时间存本机
- 通知权限被拒时，降级为应用内提示，不影响打卡
- 不默认开启，必须用户主动设置

## Out of scope
- 云同步、多设备
- 智能推荐提醒时间（v0.3 再评估）

## Open questions
1. 浏览器通知 vs 应用内提示，先做哪个？
2. 权限被拒后，是否引导到设置页？
3. 提醒是否需要避开用户已完成的习惯？
